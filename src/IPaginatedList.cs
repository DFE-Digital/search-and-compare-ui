using System.Collections.Generic;

namespace GovUk.Education.SearchAndCompare.UI
{
    public interface IPaginatedList
    {
        int PageIndex { get; }
        int TotalPages { get; }
        int TotalCount { get; }
        bool HasPreviousPage { get; }
        bool HasNextPage { get; }
    }
}
