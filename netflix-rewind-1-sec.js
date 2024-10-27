(async () => {
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const extensionName = await getI18nMessage('extensionName');
  const debugPluginLoadedMessage = await getI18nMessage('debugPluginLoaded', extensionName);

  console.debug(`💾 ${debugPluginLoadedMessage}`);

  const config = {
    rewindSec: params.get('rewindSec'),
    seekForwardSec: params.get('seekForwardSec'),
    keyObjects: JSON.parse(params.get('keyObjects'))
  };

  console.debug(`🔧 ${extensionName} config`, config);

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
      console.log(e.code, e.shiftKey, e.ctrlKey, e.altKey, e.metaKey, config.keyObjects.rewind);

      if (e.code === config.keyObjects.rewind.code &&
        e.shiftKey === config.keyObjects.rewind.shiftKey &&
        e.ctrlKey === config.keyObjects.rewind.ctrlKey &&
        e.altKey === config.keyObjects.rewind.altKey &&
        e.metaKey === config.keyObjects.rewind.metaKey) {

        console.debug(`⏪ Seeking backwards by ${config.rewindSec} second${config.rewindSec > 1 ? 's' : ''}`);
        playerElement.seek(currentTime - config.rewindSec * 1000)
      } else if (e.code === config.keyObjects.forward.code &&
        e.shiftKey === config.keyObjects.forward.shiftKey &&
        e.ctrlKey === config.keyObjects.forward.ctrlKey &&
        e.altKey === config.keyObjects.forward.altKey &&
        e.metaKey === config.keyObjects.forward.metaKey) {

        console.debug(`⏩ Seeking forwards by ${config.seekForwardSec} second${config.seekForwardSec > 1 ? 's' : ''}`);
        playerElement.seek(currentTime + config.seekForwardSec * 1000)
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
