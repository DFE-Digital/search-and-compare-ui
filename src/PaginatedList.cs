using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class PaginatedList<T> : List<T>, IPaginatedList
    {
        public int PageIndex { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalCount { get; private set; }

        private PaginatedList(List<T> items, int count, int totalPages, int pageIndex, int pageSize)
        {
            TotalCount = count;
            PageIndex = pageIndex;
            TotalPages = totalPages;

            this.AddRange(items);
        }

        public bool HasPreviousPage
        {
            get { return (PageIndex > 1); }
        }

        public bool HasNextPage
        {
            get { return (PageIndex < TotalPages); }
        }

        public static async Task<PaginatedList<T>> CreateAsync(
            IQueryable<T> source, int pageIndex, int pageSize)
        {
            pageIndex = Math.Max(pageIndex, 1);
            pageSize = Math.Max(pageSize, 1);
            var count = await source.CountAsync();
            var totalPages = Math.Max((int)Math.Ceiling(count / (double)pageSize), 1);
            pageIndex = Math.Min(totalPages, pageIndex);

            var items = await source.Skip((pageIndex - 1) * pageSize)
                                    .Take(pageSize).ToListAsync();
            return new PaginatedList<T>(items, count, totalPages, pageIndex, pageSize);
        }
    }
}
