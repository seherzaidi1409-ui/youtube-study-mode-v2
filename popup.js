const DEFAULTS = {
  studyMode: false,
  hideShorts: true,
  hideHomeFeed: false,
  hideSidebar: true,
  hideEndScreen: true
};

const keys = Object.keys(DEFAULTS);
const controls = Object.fromEntries(keys.map(key => [key, document.getElementById(key)]));
const masterStatus = document.getElementById("masterStatus");
const statusDescription = document.getElementById("statusDescription");
const notice = document.getElementById("notice");

function render(settings) {
  controls.studyMode.checked = settings.studyMode;
  controls.hideShorts.checked = settings.hideShorts;
  controls.hideHomeFeed.checked = settings.hideHomeFeed;
  controls.hideSidebar.checked = settings.hideSidebar;
  controls.hideEndScreen.checked = settings.hideEndScreen;

  masterStatus.textContent = settings.studyMode ? "Study Mode is ON" : "Study Mode is OFF";
  statusDescription.textContent = settings.studyMode
    ? "Your selected filters are active on YouTube."
    : "Turn it on when you're ready to study.";
  document.body.classList.toggle("is-active", settings.studyMode);
}

function readSettings() {
  chrome.storage.local.get(DEFAULTS, stored => render({ ...DEFAULTS, ...stored }));
}

async function saveSetting(key, value) {
  await chrome.storage.local.set({ [key]: value });
  notice.textContent = "✓ Settings saved automatically";
  notice.classList.add("saved");
}

for (const key of keys) {
  controls[key].addEventListener("change", () => {
    saveSetting(key, controls[key].checked);
    chrome.storage.local.get(DEFAULTS, stored => render({ ...DEFAULTS, ...stored, [key]: controls[key].checked }));
  });
}

readSettings();