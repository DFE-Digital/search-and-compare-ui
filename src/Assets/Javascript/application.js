if (!!$) {
    $(document).ready(function () {
        // Turn off jQuery animation
        jQuery.fx.off = true

        $('.typeahead').each(function () {
            var $this = $(this);
            var url = $this.data("url");
            $this.typeahead({
                minLength: 3,
                highlight: true
            }, {
                name: url.replace(/\//g, "-"),
                source: function (query, cbSync, cbAsync) {
                    $.get(url, {
                        query: query
                    }, function (res) {
                        cbAsync(res);
                    });
                },
                limit: 10
            });
        });
    })
}
