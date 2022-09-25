;
(function () {
    function script() {
        console.debug("'Netflix Rewind 1 sec' plugin loaded")
        window.netflixRewindPlugin = {};
        
        window.netflixRewindPlugin.seek = function (e) {
            if (window.netflixRewindPlugin.player) {
                let currentTime = window.netflixRewindPlugin.player.getCurrentTime();
                switch (e.key) {
                    case '<':
                    case ',':
                        console.debug('Seeking backwards by 1 second');
                        window.netflixRewindPlugin.player.seek(currentTime - 1000)
                        break;
                    case '>':
                    case '.':
                        console.debug('Seeking forwards by 5 seconds');
                        window.netflixRewindPlugin.player.seek(currentTime + 5000)
                        break;
                }
            } else {
                window.netflixRewindPlugin.initPluginLogic();
            }
        }

        window.netflixRewindPlugin.initPluginLogic = function () {
            // Clear variables:
            window.netflixRewindPlugin.videoPlayer = undefined;
            window.netflixRewindPlugin.playerSessionId = undefined;
            window.netflixRewindPlugin.player = undefined;

            // Set variables:
            if (netflix && netflix.appContext && netflix.appContext.state && netflix
                .appContext
                .state
                .playerApp && netflix
                .appContext
                .state
                .playerApp
                .getAPI() && netflix
                .appContext
                .state
                .playerApp
                .getAPI()
                .videoPlayer) {

                window.netflixRewindPlugin.videoPlayer = netflix
                    .appContext
                    .state
                    .playerApp
                    .getAPI()
                    .videoPlayer;

                if (window.netflixRewindPlugin.videoPlayer
                    .getAllPlayerSessionIds() && window.netflixRewindPlugin.videoPlayer
                    .getAllPlayerSessionIds()[0]) {

                    window.netflixRewindPlugin.playerSessionId = window.netflixRewindPlugin.videoPlayer
                        .getAllPlayerSessionIds()[0];

                    window.netflixRewindPlugin.player = window.netflixRewindPlugin.videoPlayer
                        .getVideoPlayerBySessionId(window.netflixRewindPlugin.playerSessionId);
                }
            }
        }

        // Check for URL changes to make sure the plugin is reinitiated after navigation:
        let previousUrl = "";
        function watchUrlChange() {
            if (window.location.href != previousUrl) {
                window.netflixRewindPlugin.initPluginLogic();
                previousUrl = window.location.href;
            }

            previousUrl = window.location.href;
            setTimeout(function () {
                watchUrlChange(window.location.href);
            }, 1000);
        }
        watchUrlChange();

        // Listen to keydown events:
        document.addEventListener('keydown', window.netflixRewindPlugin.seek);
    }

    // Inject the script to the page:
    function inject(fn) {
        const script = document.createElement('script')
        script.text = `(${fn.toString()})();`
        document.documentElement.appendChild(script)
    }
    inject(script)
})()