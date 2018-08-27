using NUnit.Framework;
using GovUk.Education.SearchAndCompare.UI.Utils;

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

        // [Test]
        // public void Headers()
        // {
        //     const string expected = "<h4 class=\"govuk-heading-s\">test</h4>";

        //     Assert.That(GetHtml(@"==test=="), Is.EqualTo(expected), "normal");
        //     Assert.That(GetHtml(@"== test=="), Is.EqualTo(expected), "space in middle");
        //     Assert.That(GetHtml(@"==test == "), Is.EqualTo(expected), "trailing space");
        //     Assert.That(GetHtml(@" ==test=="), Is.EqualTo(expected), "leading space");
        // }

        // [Test]
        // public void NotReallyHeaders()
        // {
        //     Assert.That(GetHtml(@"foo == bar =="), Is.EqualTo("<p class=\"govuk-body\">foo == bar ==</p>"));
        // }

        [Test]
        public void PureList()
        {
            var markdown = @"
- one
* two

3. three";

            var expected = "<ul class=\"govuk-list\">\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ul>";
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
            var markdown = "[www.example.com    ]";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NamedLink()
        {
            var markdown = "[www.example.com   Go to www.example.com  ]";
            var expected = "<p class=\"govuk-body\"><a href=\"www.example.com\" class=\"govuk-link\">Go to www.example.com</a></p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void LinkInParagraph()
        {
            var markdown = "Go to [www.example.com our website].\nYou'll like it there.";
            var expected = "<p class=\"govuk-body\">Go to <a href=\"www.example.com\" class=\"govuk-link\">our website</a>.</p>\n<p class=\"govuk-body\">You'll like it there.</p>";
            Assert.That(GetHtml(markdown), Is.EqualTo(expected));
        }

        [Test]
        public void NotALink()
        {
            var markdown = "[ www.nosite.com]";
            var expected = "<p class=\"govuk-body\">[ www.nosite.com]</p>";
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

//         [Test]
//         public void Bold1()
//         {
//             var markdown = "**booyah**";
//             var expected = "<p class=\"govuk-body\"><span class=\"govuk-!-font-weight-bold\">booyah</span></p>";
//             Assert.That(GetHtml(markdown), Is.EqualTo(expected));
//         }

//         [Test]
//         public void Bold2()
//         {
//             var markdown = "- **booyah**";
//             var expected = "<ul class=\"govuk-list\">\n<li><span class=\"govuk-!-font-weight-bold\">booyah</span></li>\n</ul>";
//             Assert.That(GetHtml(markdown), Is.EqualTo(expected));
//         }

//         [Test]
//         public void Bold3()
//         {
//             var markdown = "*****";
//             var expected = "<p class=\"govuk-body\"><span class=\"govuk-!-font-weight-bold\">*</span></p>";
//             Assert.That(GetHtml(markdown), Is.EqualTo(expected));
//         }

//         [Test]
//         public void NotBold1()
//         {
//             var markdown = @"**boo
// yah**";
//             var expected = "<p class=\"govuk-body\">**boo</p>\n<p class=\"govuk-body\">yah**</p>";
//             Assert.That(GetHtml(markdown), Is.EqualTo(expected));
//         }

//         [Test]
//         public void NotBold2()
//         {
//             var markdown = @"****";
//             var expected = "<p class=\"govuk-body\">****</p>";
//             Assert.That(GetHtml(markdown), Is.EqualTo(expected));
//         }

        private static string GetHtml(string markdown)
        {
            return new MarkdownFormatter().ToHtml(markdown).Value;
        }
    }
}
