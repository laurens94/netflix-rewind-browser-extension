;
(function () {
    function script() {
        console.log("Netflix Player Settings Plugin loaded")
        window.netflixPlayerSettingsPlugin = {};

        window.netflixPlayerSettingsPlugin.initPluginLogic = function () {
            window.netflixPlayerSettingsPlugin.videoPlayer = undefined;
            window.netflixPlayerSettingsPlugin.playerSessionId = undefined;
            window.netflixPlayerSettingsPlugin.player = undefined;

            window.netflixPlayerSettingsPlugin.seek = function (evt) {
                if (window.netflixPlayerSettingsPlugin.player) {
                    let currentTime = window.netflixPlayerSettingsPlugin.player.getCurrentTime();
                    switch (evt.key) {
                        case '1':
                            console.log('Seeking backwards');
                            window.netflixPlayerSettingsPlugin.player.seek(currentTime - 1000)
                            break;
                        case '3':
                            console.log('Seeking forwards');
                            window.netflixPlayerSettingsPlugin.player.seek(currentTime + 5000)
                            break;
                    }
                } else {
                    window.netflixPlayerSettingsPlugin.initPluginLogic();
                }
            }

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

                window.netflixPlayerSettingsPlugin.videoPlayer = netflix
                    .appContext
                    .state
                    .playerApp
                    .getAPI()
                    .videoPlayer;

                if (window.netflixPlayerSettingsPlugin.videoPlayer
                    .getAllPlayerSessionIds() && window.netflixPlayerSettingsPlugin.videoPlayer
                    .getAllPlayerSessionIds()[0]) {

                    window.netflixPlayerSettingsPlugin.playerSessionId = window.netflixPlayerSettingsPlugin.videoPlayer
                        .getAllPlayerSessionIds()[0];

                    window.netflixPlayerSettingsPlugin.player = window.netflixPlayerSettingsPlugin.videoPlayer
                        .getVideoPlayerBySessionId(window.netflixPlayerSettingsPlugin.playerSessionId);

                    if (window.netflixPlayerSettingsPlugin.player) {
                        console.log(window.netflixPlayerSettingsPlugin.player);
                    }

                }
            }
        }

        var lastUrl = "";
        var currentUrl = window.location.href;

        function watchUrlChange(currentUrl) {
            if (currentUrl != lastUrl) {
                window.netflixPlayerSettingsPlugin.initPluginLogic();
                lastUrl = currentUrl;
            }

            lastUrl = window.location.href;
            setTimeout(function () {
                watchUrlChange(window.location.href);
            }, 1000);
        }

        watchUrlChange();

        // add eventlisteners for hotkeys
        document.addEventListener('keydown', window.netflixPlayerSettingsPlugin.seek);
    }

    function inject(fn) {
        const script = document.createElement('script')
        script.text = `(${fn.toString()})();`
        document.documentElement.appendChild(script)
    }

    inject(script)
})()