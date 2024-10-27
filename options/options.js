const i18nData = {
  optionsTitle: browser.i18n.getMessage("optionsTitle", browser.i18n.getMessage("extensionName")),
  optionsKeyboardControlsRewind: browser.i18n.getMessage("optionsKeyboardControlsRewind"),
  optionsKeyboardControlsForward: browser.i18n.getMessage("optionsKeyboardControlsForward"),
  optionsCustomizationIntroduction: browser.i18n.getMessage("optionsCustomizationIntroduction"),
  optionsNoteNetflixDefaults: browser.i18n.getMessage("optionsNoteNetflixDefaults"),
  optionsPermissionError: browser.i18n.getMessage("optionsPermissionError"),
  optionsForwardSeconds: browser.i18n.getMessage("optionsForwardSeconds"),
  optionsRewindSeconds: browser.i18n.getMessage("optionsRewindSeconds"),
  optionsRewindKey: browser.i18n.getMessage("optionsRewindKey"),
  optionsForwardKey: browser.i18n.getMessage("optionsForwardKey"),
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
  seekForwardSec: 5,
  keyObjects: {
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
  }
};

const keyObjects = {
  rewind: {},
  forward: {}
};

function setPermission(hasPermission) {
  document.getElementById('permission-error').style.display = hasPermission ? 'none' : 'block';
}

function checkPermission() {
  browser.permissions.contains({
    origins: ["*://www.netflix.com/*"]
  }, (_hasPermission) => {
    setPermission(_hasPermission);
    if (!_hasPermission) {
      browser.permissions.request({
        origins: ["*://www.netflix.com/*"]
      }, (granted) => {
        setPermission(granted);
      });
      setTimeout(checkPermission, 2000);
    }
  });
}

checkPermission();

function replaceTemplate(id, data) {
  if (document.getElementById(id) === null) return;
  document.getElementById(id).innerHTML = document.getElementById(id).innerHTML
    .replace(
      /%(\w*)%/g, // replaces %key% with property from data object
      function (_, key) {
        return data.hasOwnProperty(key) ? data[key] : "";
      }
    );
}

replaceTemplate("wrapper", i18nData);

function setKeyInputValue(keyObject, type) {
  const modifierShift = keyObject.shiftKey && keyObject.key !== "Shift";
  const modifierAlt = keyObject.altKey && keyObject.key !== "Alt";
  const modifierCtrl = keyObject.ctrlKey && keyObject.key !== "Control";
  const modifierMeta = keyObject.metaKey && keyObject.key !== "Meta";
  const allModifierStrings = `${modifierShift ? "Shift + " : ""}${modifierAlt ? "Alt + " : ""}${modifierCtrl ? "Ctrl + " : ""}${modifierMeta ? "Meta + " : ""}`;
  document.querySelector(`#${type}-key`).value = `${allModifierStrings}[${keyObject.code}]`;
  document.querySelector(`[data-${type}-btn]`).innerHTML = `${allModifierStrings}${keyObject.key} (${keyObject.code})`;
}

function modifyKey(e, type) {
  setKeyInputValue(e, type);
  keyObjects[type] = {
    key: e.key,
    code: e.code,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
  };
}

function saveOptions(e, reset = false) {
  if (!reset) {
    e.preventDefault();
  }

  browser.storage.sync.set({
    rewindSec: !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec,
    seekForwardSec: !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec,
    keyObjects: !reset ? keyObjects : defaults.keyObjects
  });

  document.querySelector('[data-rewind-sec]').innerText = !reset ? document.querySelector("#rewind-seconds").value : defaults.rewindSec;
  document.querySelector('[data-forward-sec]').innerText = !reset ? document.querySelector("#forward-seconds").value : defaults.seekForwardSec;
  modifyKey(!reset ? keyObjects.rewind : defaults.keyObjects.rewind, 'rewind');
  modifyKey(!reset ? keyObjects.forward : defaults.keyObjects.forward, 'forward');

  let btn = document.querySelector(reset ? "#reset" : "#save");
  btn.textContent = `✓ ${reset ? i18nData.optionsDefaultsSaved : i18nData.optionsSaved}`;
  clearTimeout(infoMessageTimeout);
  infoMessageTimeout = setTimeout(() => {
    btn.textContent = reset ? i18nData.optionsResetToDefaults : i18nData.optionsSave;
  }, 750);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    keyObjects.rewind = result.keyObjects?.rewind || defaults.keyObjects.rewind;
    keyObjects.forward = result.keyObjects?.forward || defaults.keyObjects.forward;
    document.querySelector("#rewind-seconds").value = result.rewindSec || defaults.rewindSec;
    document.querySelector("#forward-seconds").value = result.seekForwardSec || defaults.seekForwardSec;
    setKeyInputValue(keyObjects.rewind, 'rewind');
    setKeyInputValue(keyObjects.forward, 'forward');
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
document.querySelector("#rewind-key").addEventListener("keydown", (e) => {
  e.preventDefault();
  modifyKey(e, 'rewind');
});
document.querySelector("#forward-key").addEventListener("keydown", (e) => {
  e.preventDefault();
  modifyKey(e, 'forward');
});
