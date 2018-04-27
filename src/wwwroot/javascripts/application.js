if (!!$) {
    $(document).ready(function () {
        // Turn off jQuery animation
        jQuery.fx.off = true

        // Where .multiple-choice uses the data-target attribute
        // to toggle hidden content
        var showHideContent = new GOVUK.ShowHideContent()
        showHideContent.init()

        // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
        // with role="button" when the space key is pressed.
        if (GOVUK.shimLinksWithButtonRole) {
            GOVUK.shimLinksWithButtonRole.init();
        }

        // Details/summary polyfill from frontend toolkit
        GOVUK.details.init()

        $('.typeahead').each(function() {
            var $this = $(this);
            var url = $this.data("url");
            $this.typeahead({
                minLength: 3,
                highlight: true
                },
                {
                    name: url.replace(/\//g,"-"),
                    source: function(query, cbSync, cbAsync){
                        $.get(url, {query: query}, function(res){
                            cbAsync(res);
                        });
                    },
                    limit:10
                });
        });
    })
}
