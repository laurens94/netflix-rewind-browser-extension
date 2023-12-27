(async () => {
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const extensionName = await getI18nMessage('extensionName');
  const debugPluginLoadedMessage = await getI18nMessage('debugPluginLoaded', extensionName);

  console.debug(`💾 ${debugPluginLoadedMessage}`);

  const config = {
    rewindSec: params.get('rewindSec'),
    seekForwardSec: params.get('seekForwardSec')
  };

  let playerElement = undefined;

  function getVideoPlayer() {
    const videoPlayer = netflix?.appContext?.state?.playerApp?.getAPI()?.videoPlayer;
    const playerSessionId = videoPlayer?.getAllPlayerSessionIds()?.[0];
    playerElement = playerSessionId ? videoPlayer.getVideoPlayerBySessionId(playerSessionId) : undefined;
  }

  function onSeek(e) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      return;
    }

    getVideoPlayer();

    if (playerElement) {
      let currentTime = playerElement.getCurrentTime();
      switch (e.key) {
        case '<':
        case ',':
          console.debug(`⏪ Seeking backwards by ${config.rewindSec} second${config.rewindSec > 1 ? 's' : ''}`);
          playerElement.seek(currentTime - config.rewindSec * 1000)
          break;
        case '>':
        case '.':
          console.debug(`⏩ Seeking forwards by ${config.seekForwardSec} second${config.seekForwardSec > 1 ? 's' : ''}`);
          playerElement.seek(currentTime + config.seekForwardSec * 1000)
          break;
      }
    } else {
      console.debug(`No active player element found`);
    }
  }

  document.addEventListener('keydown', onSeek);

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
})();
