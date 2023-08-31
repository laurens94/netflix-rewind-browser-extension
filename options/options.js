const i18nData = {
  optionsTitle: browser.i18n.getMessage("optionsTitle", browser.i18n.getMessage("extensionName")),
  optionsKeyboardControlsRewind: browser.i18n.getMessage("optionsKeyboardControlsRewind"),
  optionsKeyboardControlsForward: browser.i18n.getMessage("optionsKeyboardControlsForward"),
  optionsCustomizationIntroduction: browser.i18n.getMessage("optionsCustomizationIntroduction"),
  optionsNoteNetflixDefaults: browser.i18n.getMessage("optionsNoteNetflixDefaults"),
  optionsForwardSeconds: browser.i18n.getMessage("optionsForwardSeconds"),
  optionsRewindSeconds: browser.i18n.getMessage("optionsRewindSeconds"),
  optionsResetToDefaults: browser.i18n.getMessage("optionsResetToDefaults"),
  optionsDefaultsSaved: browser.i18n.getMessage("optionsDefaultsSaved"),
  optionsSave: browser.i18n.getMessage("optionsSave"),
  optionsSaved: browser.i18n.getMessage("optionsSaved"),
  optionsSourceCode: browser.i18n.getMessage("optionsSourceCode"),
  optionsReportIssue: browser.i18n.getMessage("optionsReportIssue"),
  optionsRequestFeature: browser.i18n.getMessage("optionsRequestFeature"),
  optionsDonate: browser.i18n.getMessage("optionsDonate"),
}
document.title = i18nData.optionsTitle;

let infoMessageTimeout;

const defaults = {
  rewindSec: 1,
  seekForwardSec: 5
};

function replaceTemplate(id, data) {
  if (document.getElementById(id) === null) return;
  document.getElementById(id).innerHTML = document.getElementById(id).innerHTML
    .replace(
      /%(\w*)%/g, // replaces %key% with property from data object
      function (_, key) {
        console.log(_, key, data, data[key]);
        return data.hasOwnProperty(key) ? data[key] : "";
      }
    );
}

replaceTemplate("wrapper", i18nData);

function saveOptions(e, reset = false) {
  if (!reset) e.preventDefault();

  browser.storage.sync.set({
    rewindSec: !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec,
    seekForwardSec: !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec
  });

  document.querySelector('[data-rewind-sec]').innerText = !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec;
  document.querySelector('[data-forward-sec]').innerText = !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec;

  let btn = document.querySelector(reset ? "#reset" : "#save");
  btn.textContent = `✓ ${reset ? i18nData.optionsDefaultsSaved : i18nData.optionsSaved}`;
  clearTimeout(infoMessageTimeout);
  infoMessageTimeout = setTimeout(() => {
    btn.textContent = reset ? i18nData.optionsResetToDefaults : i18nData.optionsSave;
  }, 750);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#rewind-seconds").value = result.rewindSec || defaults.rewindSec;
    document.querySelector("#forward-seconds").value = result.seekForwardSec || defaults.seekForwardSec;
  }

  function onError(error) {
    console.warn(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", (e) => saveOptions(e, true));
