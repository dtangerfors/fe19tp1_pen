/**
 * End user settings
 */
export const settings = {
	autoSave: false,
	activeTheme: 'light'
};

/**
 * Load settings from localstorage if it's saved.
 */
const localSettings = JSON.parse(localStorage.getItem('user-settings'));
if(localSettings) {
	settings.autoSave = localSettings.autoSave;
	settings.activeTheme = localSettings.activeTheme;
}

export function saveUserSettings() {
  localStorage.setItem('user-settings', JSON.stringify(settings));
}

/**
 * 
 * @param {String} theme 
 */
export function setTheme(theme) {
  settings.activeTheme = theme;
  document.documentElement.className = `theme-${settings.activeTheme}`;
}

/**
 * 
 */
(function () {
 if (settings.activeTheme === 'dark') {
     setTheme('dark');
 } else {
     setTheme('light');
 }
})();

/**
 * Save Checkbox Element in the DOM
 */
const save_checkbox = document.querySelector('input[name=auto-save]');
save_checkbox.checked = settings.autoSave;

save_checkbox.addEventListener('change', function () {
  settings.autoSave = this.checked;
  saveUserSettings();
});

const theme_checkbox = document.querySelector('input[name=theme]');
theme_checkbox.checked = settings.activeTheme === 'dark';

theme_checkbox.addEventListener('change', function () {
  if(this.checked) {
    setTheme('dark');
  }else {
    setTheme('light');
  }
  saveUserSettings();
});

const settingsModal = document.getElementById('settings-modal');
const settingsButton = document.getElementById('nav-settings');
const closeElement = document.querySelector('.close');

settingsButton.addEventListener('click', function () {
  settingsModal.style.display = 'block';
});

closeElement.addEventListener('click', function () {
  settingsModal.style.display = 'none';
});

window.onclick = function (event) {
  if (event.target == settingsModal) {
    settingsModal.style.display = 'none';
  }
};