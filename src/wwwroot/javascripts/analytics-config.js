window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-112932657-1', {
    'anonymize_ip': true,
    'send_page_view': true,
    'custom_map': {
        'dimension1': 'location',
        'dimension2': 'radius',
        'dimension3': 'subjects',
        'dimension4': 'provider',
        'dimension5': 'funding'
    }
});

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

gtag('event', 'sac_page_view', {
    'event_category': 'engagement',
    'event_label': location.pathname,
    'location': getParameterByName('loc') || "(none)",
    'radius': getParameterByName('rad') || "(none)",
    'subjects': getParameterByName('subjects') || "(none)",
    'provider': getParameterByName('query') || "(none)",
    'funding': getParameterByName('funding') || "(none)"
});
