;
(function () {
    const settings = {
        rewindSec: 1,
        seekForwardSec: 5
    }

    function onError (error) {
        console.warn(`Could not load settings for Netflix Rewind 1 Sec, falling back to defaults...`, error);
        inject(script);
    }

    function onGot (item) {
        if (item.rewindSec > 0) {
            settings.rewindSec = item.rewindSec;
        }
        if (item.seekForwardSec > 0) {
            settings.seekForwardSec = item.seekForwardSec;
        }
        inject(script)
    }

    let getting = browser.storage.sync.get();
    getting.then(onGot, onError);

    // Script to be injected:
    function script() {
        console.debug("💾 'Netflix Rewind 1 sec' plugin loaded.");
        window.netflixRewindPlugin = {};
        window.netflixRewindPlugin.config = $CONFIG;

        window.netflixRewindPlugin.seek = function (e) {
            if (window.netflixRewindPlugin.player) {
                let currentTime = window.netflixRewindPlugin.player.getCurrentTime();
                switch (e.key) {
                    case '<':
                    case ',':
                        console.debug(`⏪ Seeking backwards by ${window.netflixRewindPlugin.config.rewindSec} second${window.netflixRewindPlugin.config.rewindSec > 1 ? 's' : ''}`);
                        window.netflixRewindPlugin.player.seek(currentTime - window.netflixRewindPlugin.config.rewindSec * 1000)
                        break;
                    case '>':
                    case '.':
                        console.debug(`⏩ Seeking forwards by ${window.netflixRewindPlugin.config.seekForwardSec} second${window.netflixRewindPlugin.config.seekForwardSec > 1 ? 's' : ''}`);
                        window.netflixRewindPlugin.player.seek(currentTime +window.netflixRewindPlugin.config.seekForwardSec * 1000)
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

        // Get current player every 3 seconds:
        setInterval(window.netflixRewindPlugin.initPluginLogic, 3000);

        // Listen to keydown events:
        document.addEventListener('keydown', window.netflixRewindPlugin.seek);
    }

    // Inject the script to the page:
    function inject(fn) {
        const script = document.createElement('script')
        const parsedScript = fn.toString().replace('$CONFIG', JSON.stringify(settings));
        script.text = `(${parsedScript})();`
        document.documentElement.appendChild(script)
    }
})()