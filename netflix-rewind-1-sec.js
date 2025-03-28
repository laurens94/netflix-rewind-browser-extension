(async () => {
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const extensionName = await getI18nMessage('extensionName');
  const debugPluginLoadedMessage = await getI18nMessage('debugPluginLoaded', extensionName);

  console.debug(`💾 ${debugPluginLoadedMessage}`);

  const config = {
    rewindSec: params.get('rewindSec'),
    seekForwardSec: params.get('seekForwardSec'),
    rewindSecondarySec: params.get('rewindSecondarySec'),
    seekForwardSecondarySec: params.get('seekForwardSecondarySec'),
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
      let isPaused = playerElement.isPaused();
      let playbackRate = playerElement.getPlaybackRate();

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
      } else if (e.code === config.keyObjects.forwardSecondary.code &&
        e.shiftKey === config.keyObjects.forwardSecondary.shiftKey &&
        e.ctrlKey === config.keyObjects.forwardSecondary.ctrlKey &&
        e.altKey === config.keyObjects.forwardSecondary.altKey &&
        e.metaKey === config.keyObjects.forwardSecondary.metaKey) {

        console.debug(`⏩ Seeking forwards by ${config.seekForwardSecondarySec} second${config.seekForwardSecondarySec > 1 ? 's' : ''}`);
        playerElement.seek(currentTime + config.seekForwardSecondarySec * 1000)
      } else if (e.code === config.keyObjects.rewindSecondary.code &&
        e.shiftKey === config.keyObjects.rewindSecondary.shiftKey &&
        e.ctrlKey === config.keyObjects.rewindSecondary.ctrlKey &&
        e.altKey === config.keyObjects.rewindSecondary.altKey &&
        e.metaKey === config.keyObjects.rewindSecondary.metaKey) {

        console.debug(`⏪ Seeking backwards by ${config.rewindSecondarySec} second${config.rewindSecondarySec > 1 ? 's' : ''}`);
        playerElement.seek(currentTime - config.rewindSecondarySec * 1000)
      } else if (e.code === config.keyObjects.togglePause.code &&
        e.shiftKey === config.keyObjects.togglePause.shiftKey &&
        e.ctrlKey === config.keyObjects.togglePause.ctrlKey &&
        e.altKey === config.keyObjects.togglePause.altKey &&
        e.metaKey === config.keyObjects.togglePause.metaKey) {

        console.debug(`⏸️ Toggling play/pause`);
        if (isPaused) {
          playerElement.play();
        } else {
          playerElement.pause();
        }
      } else if (e.code === config.keyObjects.speedUp.code &&
        e.shiftKey === config.keyObjects.speedUp.shiftKey &&
        e.ctrlKey === config.keyObjects.speedUp.ctrlKey &&
        e.altKey === config.keyObjects.speedUp.altKey &&
        e.metaKey === config.keyObjects.speedUp.metaKey) {

        let updatedRate = Math.min(playbackRate + 0.25, 1.5);
        console.debug(`⏩ Increasing playback speed to ${updatedRate}x`);
        playerElement.setPlaybackRate(updatedRate);
      } else if (e.code === config.keyObjects.speedDown.code &&
        e.shiftKey === config.keyObjects.speedDown.shiftKey &&
        e.ctrlKey === config.keyObjects.speedDown.ctrlKey &&
        e.altKey === config.keyObjects.speedDown.altKey &&
        e.metaKey === config.keyObjects.speedDown.metaKey) {

        let updatedRate = Math.max(playbackRate - 0.25, 0.25);
        console.debug(`⏪ Decreasing playback speed to ${updatedRate}x`);
        playerElement.setPlaybackRate(updatedRate);
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
