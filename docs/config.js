/* eslint-disable quotes */
(function() {
    zuix.store("config", {
        "title": "HomeGenie web UI",
        "googleSiteId": "UA-123-456",
        "urlRoot": "https://genielabs.github.io/homegenie-web-ui/",
        "resourcePath": "/app/",
        "libraryPath": {
                "@lib": "https://zuixjs.github.io/zkit/lib/",
                "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
        },
        "genielabs.github.io": {
                "resourcePath": "https://genielabs.github.io/homegenie-web-ui/app/",
                "libraryPath": {
                        "@lib": "https://zuixjs.github.io/zkit/lib/",
                        "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
                }
        }
});

    // Check that service workers are registered
    if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js');
        });
    }
})();
