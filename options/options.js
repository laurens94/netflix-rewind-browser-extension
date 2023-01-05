let infoMessageTimeout;

function saveOptions(e, reset = false) {
  if (!reset) e.preventDefault();

  browser.storage.sync.set({
    rewindSec: !reset ? document.querySelector("#rewind-seconds").value : 1,
    seekForwardSec: !reset ? document.querySelector("#forward-seconds").value : 5
  });

  let btn = document.querySelector(reset ? "#reset" : "#save");
  btn.textContent = `✓ ${reset ? 'Defaults saved' : 'Saved'}!`;
  clearTimeout(infoMessageTimeout);
  infoMessageTimeout = setTimeout(() => {
    btn.textContent = reset ? "Reset to defaults" : "Save";
  }, 750);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#rewind-seconds").value = result.rewindSec || 1;
    document.querySelector("#forward-seconds").value = result.seekForwardSec || 5;
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