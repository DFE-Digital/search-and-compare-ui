using NUnit.Framework;
using GovUk.Education.SearchAndCompare.UI.Shared.Utils;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Utils
{
    public class MarkdownFormatterTests
    {
        [Test]
        public void Empty()
        {
            Assert.That(GetHtml(null), Is.EqualTo(""), "null");
            Assert.That(GetHtml(""), Is.EqualTo(""), "empty");
            Assert.That(GetHtml("  \n\t"), Is.EqualTo(""), "whitespace");
        }

        [Test]
        public void PureList()
        {
            var markdown = @"
- one
* two

3. three";

            var expected = "<ul class=\"govuk-list govuk-list--bullet\">\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ul>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void ListWithLeaderAndWhitespace()
        {
            var markdown = @"
 The list is:
- one



   - two
* three


 ";
            var expected = "<p class=\"govuk-body\">The list is:</p>\n<ul class=\"govuk-list govuk-list--bullet\">\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ul>";

            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void SingleCharParagraph()
        {
            Assert.That(GetHtml("["), Is.EqualTo("<p class=\"govuk-body\">[</p>"));
        }

        [Test]
        public void PureLink()
        {
            var markdown = "[www.example.com]";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void PureLinkWithWhiteSpace()
        {
            var markdown = "[ www.example.com    ]";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NamedLink()
        {
            var markdown = "[Go to www.example.com](www.example.com)";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">Go to www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NamedLinkWithSpace()
        {
            var markdown = "[Go to www.example.com] (www.example.com)";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">Go to www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void LinkInParagraph()
        {
            var markdown = "Go to [our website](www.example.com).\nYou'll like it there.";
            var expected = "<p class=\"govuk-body\">Go to <a href=\"www.example.com\" class=\"govuk-link\">our website</a>.</p>\n<p class=\"govuk-body\">You'll like it there.</p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }
        
        public void LinkWithParenthesesInParentheses()
        {
            var markdown = "(Go to [Wikipedia](https://en.wikipedia.org/wiki/Brackets_\\(text_editor\\))).";
            var expected = "<p class=\"govuk-body\">(Go to <a href=\"https://en.wikipedia.org/wiki/Brackets_(text_editor)\" class=\"govuk-link\">Wikipedia</a>.</p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NotALink2()
        {
            var markdown = @"[
www.nosite.com]";
            var expected = "<p class=\"govuk-body\">[</p>\n<p class=\"govuk-body\">www.nosite.com]</p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NoHtml()
        {
            var markdown = "<marquee>I took a HTML course at school</marquee>";
            var expected = "<p class=\"govuk-body\">&lt;marquee&gt;I took a HTML course at school&lt;/marquee&gt;</p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        private static string GetHtml(string markdown)
        {
            return new MarkdownFormatter().ToHtml(markdown).Value;
        }
    }
}
