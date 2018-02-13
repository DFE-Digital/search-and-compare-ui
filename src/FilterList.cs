using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Models;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class FilterList<T> : List<T>
    {
        public int TotalCount { get; private set; }

        public FilterList(List<T> items, int count)
        {
            TotalCount = count;
            this.AddRange(items);
        }

        public static FilterList<T> Create(IQueryable<T> source)
        {
            var count = source.Count();
            var items = source.ToList();

            return new FilterList<T>(items, count);
        }

        public static FilterList<Subject> Create(IQueryable<Subject> source, List<int> filterIds)
        {
            var subjects = source;

            if (filterIds.Count() > 0) {
                subjects = source.Where(subject => filterIds.Contains(subject.Id));
            }

            return FilterList<Subject>.Create(subjects.AsNoTracking());
        }

        public static FilterList<Course> Create(IQueryable<Course> source, List<int> filterIds)
        {
            var filteredCourses = source.Where(course => course.CourseSubjects
                .Any(courseSubject => filterIds.Contains(courseSubject.Subject.Id)));

            return FilterList<Course>.Create(filteredCourses.AsNoTracking());
        }
    }
}
