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

        public static async Task<FilterList<T>> CreateAsync(IQueryable<T> source)
        {
            var count = await source.CountAsync();
            var items = await source.ToListAsync();

            return new FilterList<T>(items, count);
        }

        public static async Task<FilterList<Subject>> CreateAsync(IQueryable<Subject> source, List<int> filterIds)
        {
            var subjects = source;

            if (filterIds.Count() > 0) {
                subjects = source.Where(subject => filterIds.Contains(subject.Id));
            }

            return await FilterList<Subject>.CreateAsync(subjects.AsNoTracking());
        }

        public static async Task<FilterList<Course>> CreateAsync(IQueryable<Course> source, List<int> filterIds)
        {
            var filteredCourses = source.Where(course => course.CourseSubjects
                .Any(courseSubject => filterIds.Contains(courseSubject.Subject.Id)));

            return await FilterList<Course>.CreateAsync(filteredCourses.AsNoTracking());
        }
    }
}
