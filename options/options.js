let infoMessageTimeout;

const defaults = {
  rewindSec: 1,
  seekForwardSec: 5
};

function saveOptions(e, reset = false) {
  if (!reset) e.preventDefault();

  browser.storage.sync.set({
    rewindSec: !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec,
    seekForwardSec: !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec
  });

  document.querySelector('[data-rewind-sec]').innerText = !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec;
  document.querySelector('[data-forward-sec]').innerText = !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec;

  let btn = document.querySelector(reset ? "#reset" : "#save");
  btn.textContent = `✓ ${reset ? 'Defaults saved' : 'Saved'}!`;
  clearTimeout(infoMessageTimeout);
  infoMessageTimeout = setTimeout(() => {
    btn.textContent = reset ? "Reset to defaults" : "Save";
  }, 750);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#rewind-seconds").value = result.rewindSec || defaults.rewindSec;
    document.querySelector("#forward-seconds").value = result.seekForwardSec || defaults.seekForwardSec;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", (e) => saveOptions(e, true));
