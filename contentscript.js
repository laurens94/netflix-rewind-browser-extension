;
(function () {
  const settings = {
    rewindSec: 1,
    seekForwardSec: 5,
    keyObjects: JSON.stringify({
      rewind: {
        key: ",",
        code: "Comma",
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        metaKey: false
      },
      forward: {
        key: ".",
        code: "Period",
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        metaKey: false
      }
    })
  }

  function onError(error) {
    console.warn(browser.i18n.getMessage("debugCouldNotLoadSettings", browser.i18n.getMessage("extensionName")), error);
    inject();
  }

  window.addEventListener("message", (event) => {
    if (event.origin === window.origin) {
      if (event.data.type === 'getI18nMessage') {
        try {
          if (typeof event.data.key !== 'string') {
            throw new Error("key must be a string");
          }
          event.ports[0].postMessage({ result: browser.i18n.getMessage(event.data.key, ...event.data.params) });
        } catch (e) {
          if (!event.ports[0]) return;
          event.ports[0].postMessage({ error: e });
        }
      }
    }
  }, false)

  function onGot(item) {
    if (item.rewindSec > 0) {
      settings.rewindSec = item.rewindSec;
    }
    if (item.seekForwardSec > 0) {
      settings.seekForwardSec = item.seekForwardSec;
    }
    if (item.keyObjects) {
      settings.keyObjects = JSON.stringify(item.keyObjects);
    }
    inject()
  }

  let getting = browser.storage.sync.get();
  getting.then(onGot, onError);

  // Inject the script to the page:
  function inject() {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('netflix-rewind-1-sec.js?') + new URLSearchParams(settings);
    s.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  }
})()
