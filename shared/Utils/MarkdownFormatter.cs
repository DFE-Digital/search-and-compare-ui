using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Html;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Utils
{
    public class MarkdownFormatter
    {
        private static readonly Regex linkRegex = new Regex(@"\[ *([^\]\n]+) *\] ?(?:\( *((?:[^\\\(\)\s\n]|\\\(|\\\)|\\\\)+) *\))?", RegexOptions.Compiled | RegexOptions.Multiline);
        private static readonly Regex listItemRegex = new Regex(@"^\s*(?:-|\*|[0-9]+\.?)[\t\f\v ](.*)\n?", RegexOptions.Compiled | RegexOptions.Multiline);
        private static readonly Regex listWrapperRegex = new Regex(@"<li>(?:<\/li>\s*<li>|(?!<\/li>).)*<\/li>", RegexOptions.Compiled );
        private static readonly Regex paragraphRegex = new Regex(@"^\s*[^<].*$", RegexOptions.Compiled | RegexOptions.Multiline);

        private static readonly Regex lineBreakRegex = new Regex(@"\n\s*", RegexOptions.Compiled);
        private static readonly Regex whitespace = new Regex(@"^\s*$", RegexOptions.Compiled);

        public HtmlString ToHtml(string markdown)
        {
            if (string.IsNullOrWhiteSpace(markdown))
            {
                return new HtmlString("");
            }

            var res = markdown.Trim().Replace("<", "&lt;").Replace(">", "&gt;");

            res = lineBreakRegex.Replace(res, "\n");

            res = listItemRegex.Replace(res, new MatchEvaluator(match => $"<li>{match.Groups[1].Value.Trim()}</li>\n"));

            res = listWrapperRegex.Replace(res, new MatchEvaluator(match => $"<ul class=\"govuk-list govuk-list--bullet\">\n{match.Groups[0].Value.Trim()}\n</ul>"));
            
            res = paragraphRegex.Replace(res, new MatchEvaluator(match => $"<p class=\"govuk-body\">{match.Groups[0].Value.Trim()}</p>"));

            res = linkRegex.Replace(res, new MatchEvaluator(match => {
                var href = match.Groups.Count > 2 && !string.IsNullOrWhiteSpace(match.Groups[2].Value) ? match.Groups[2].Value.Trim() : match.Groups[1].Value.Trim();
                href.Replace("\\(", "(");         
                href.Replace("\\)", ")");
                href.Replace("\\\\", "\\");       
                
                return $"<a href=\"{href}\" class=\"govuk-link\">{match.Groups[1].Value.Trim()}</a>";
                }));

            return new HtmlString(res.Trim());
        }
    }
}
