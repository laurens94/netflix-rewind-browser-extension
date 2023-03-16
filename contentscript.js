;
(function () {
  const settings = {
    rewindSec: 1,
    seekForwardSec: 5
  }

  function onError(error) {
    console.warn(`Could not load settings for Netflix Rewind 1 Sec, falling back to defaults...`, error);
    inject();
  }

  function onGot(item) {
    if (item.rewindSec > 0) {
      settings.rewindSec = item.rewindSec;
    }
    if (item.seekForwardSec > 0) {
      settings.seekForwardSec = item.seekForwardSec;
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
