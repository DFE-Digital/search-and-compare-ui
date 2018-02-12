using System.Data.SqlClient;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI.Models.Joins;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql;

namespace GovUk.Education.SearchAndCompare.UI.DatabaseAccess
{
    public class CourseDbContext : DbContext, ICourseDbContext
    {
        public DbSet<Course> Courses { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<SubjectArea> SubjectAreas { get; set; }

        public DbSet<Campus> Campuses { get; set; }
        
        public DbSet<Route> Routes { get; set; }
        
        public DbSet<Fees> Fees { get; set; }

        // Join tables
        public DbSet<CourseSubject> CourseSubjects { get; set; }

        public CourseDbContext(DbContextOptions<CourseDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Distance is not a real column (except when TVF "course_distance" is used)
            modelBuilder.Entity<Course>()
                .Property(x => x.Distance)
                .Metadata.BeforeSaveBehavior = PropertySaveBehavior.Ignore;  

            modelBuilder.Entity<Course>()
                .Property(x => x.Distance)
                .Metadata.AfterSaveBehavior = PropertySaveBehavior.Ignore;  
                
            // Location Index
            modelBuilder.Entity<Location>()
                .HasIndex(b => new { b.Longitude, b.Latitude });        

            // Many-Many mapping between Course and Subject
            modelBuilder.Entity<CourseSubject>()
                .HasKey(c => new { c.CourseId, c.SubjectId });

            modelBuilder.Entity<CourseSubject>()
                .HasOne(cs => cs.Course)
                .WithMany(c => c.CourseSubjects)
                .HasForeignKey(cs => cs.CourseId);

            modelBuilder.Entity<CourseSubject>()
                .HasOne(cs => cs.Subject)
                .WithMany(c => c.CourseSubjects)
                .HasForeignKey(cs => cs.SubjectId);

            modelBuilder.Entity<DefaultCourseDescriptionSection>();

            base.OnModelCreating(modelBuilder);            
        }

        public IQueryable<Course> GetLocationFilteredCourses(double latitude, double longitude, double radiusInMeters)
        {            
            return Courses.FromSql("SELECT * FROM course_distance(@lat,@lon,@rad)", 
                    new NpgsqlParameter("@lat", latitude),
                    new NpgsqlParameter("@lon", longitude),
                    new NpgsqlParameter("@rad", radiusInMeters))
                .Include("Provider")
                .Include(course => course.CourseSubjects)
                    .ThenInclude(courseSubject => courseSubject.Subject) 
                        .ThenInclude(subject => subject.Funding)               
                .Include(x => x.ProviderLocation)
                .Include(x => x.Route)
                .Include(x => x.Campuses);
        }

        public IQueryable<Course> GetCoursesWithProviderAndSubjects()
        {
            return from course in Courses
                .FromSql("SELECT *, NULL as \"Distance\" FROM \"course\"")
                .Include("Provider")
                .Include(course => course.CourseSubjects)
                    .ThenInclude(courseSubject => courseSubject.Subject)
                        .ThenInclude(subject => subject.Funding)
                select course;
        }

        public IQueryable<Course> GetCoursesWithProviderSubjectsRouteAndCampuses()
        {
            return GetCoursesWithProviderAndSubjects()
                .Include(x => x.ProviderLocation)
                .Include(x => x.Route)
                .Include(x => x.Campuses)
                    .ThenInclude(campus => campus.Location);
        }

        public IQueryable<Course> GetCoursesWithProviderSubjectsRouteCampusesAndDescriptions()
        {
            return GetCoursesWithProviderSubjectsRouteAndCampuses()
                .Include(x => x.DescriptionSections);
        }

        public IQueryable<Subject> GetSubjects()
        {
            return from subject in Subjects select subject;
        }

        public IQueryable<SubjectArea> GetOrderedSubjectsByArea()
        {
            return from subjectArea in SubjectAreas
                .Include(x => x.Subjects)
                .OrderBy(x => x.Ordinal)
                .AsNoTracking()
                select subjectArea;
        }

        public Fees GetLatestFees() 
        {
            return Fees.OrderByDescending(x=>x.EndYear).FirstOrDefault();
        }
    }
}
