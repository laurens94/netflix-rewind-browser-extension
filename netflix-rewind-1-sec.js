!async function () {
  const extensionName = await getI18nMessage('extensionName'),
    debugPluginLoadedMessage = await getI18nMessage('debugPluginLoaded', extensionName);
  console.debug(`💾 ${debugPluginLoadedMessage}`);
}();

const params = new URLSearchParams(document.currentScript.src.split('?')[1]);

window.netflixRewindPlugin = {};
window.netflixRewindPlugin.config = {
  rewindSec: params.get('rewindSec'),
  seekForwardSec: params.get('seekForwardSec')
};

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
        window.netflixRewindPlugin.player.seek(currentTime + window.netflixRewindPlugin.config.seekForwardSec * 1000)
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

function getI18nMessage(key, ...params) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.result);
      }
    };

    window.postMessage({ type: 'getI18nMessage', key: key, params }, window.location.origin, [channel.port2]);
  })
};
