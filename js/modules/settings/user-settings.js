/**
 * User settings
 */

export const STATES = {
  "LANDING_PAGE": 0,
  "EDITOR": 1
}

const fontStatus = {
  'noto-switch': {
    status: false,
    fontFamily: {
      header: `'Noto Sans', sans-serif`,
      body: `'Noto Serif', serif`
    }
  },
  'poppin-switch': {
    status: false,
    fontFamily: {
      header: `'Poppins', sans-serif`,
      body: `'Noto Sans', sans-serif`
    }
  },
  'quire-switch': {
    status: false,
    fontFamily: {
      header: `'Playfair Display', serif`,
      body: `'Roboto', sans-serif`
    }
  }
}

export const settings = {
  autoSave: false,
  activeTheme: 'light',
  activeFont: 'noto-switch',
  state: STATES.LANDING_PAGE
};
/**
 * Load settings from localstorage if it's saved.
 */
const localSettings = JSON.parse(localStorage.getItem('user-settings'));
if (localSettings) {
  settings.autoSave = localSettings.autoSave || settings.autoSave;
  settings.activeTheme = localSettings.activeTheme || settings.activeTheme;
  settings.activeFont = localSettings.activeFont || settings.activeFont;
  settings.state = localSettings.state || settings.state;
  saveUserSettings();
}

resetFontStatus();
setFont(settings.activeFont);

/**
 * Saves user settings to localStorage
 */
export function saveUserSettings() {
  localStorage.setItem('user-settings', JSON.stringify(settings));
}

/**
 * Set the current theme
 * @param {String} theme 
 */
export function setTheme(theme) {
  settings.activeTheme = theme;
  document.documentElement.className = `theme-${settings.activeTheme}`;
}

if (settings.activeTheme === 'dark') {
  setTheme('dark');
} else {
  setTheme('light');
}

/**
 * Sets state
 * @param {STATES} state 
 */
export function setState(state) {
  settings.state = state;
  saveUserSettings();
}

/**
 * Check the current state
 * @param {STATES} state
 * @returns Boolean
 */
export function isCurrentState(state) {
  return getCurrentState() === state
}

/**
 * Get the current state
 * @returns STATES
 */
export function getCurrentState() {
  return settings.state;
}

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
  if (this.checked) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
  saveUserSettings();
});

/**
 * Resets the font status color and text in the sidebar
 */
function resetFontStatus() {
  const root = document.documentElement;
  root.style.setProperty('--current-header-font', '');
  root.style.setProperty('--current-body-font', '');
  for (let key in fontStatus) {
    const elem = document.querySelector(`#${key} .span-font-status`);
    elem.innerText = 'Not in use';
    fontStatus[key].status = false;
    elem.style.setProperty('color', 'var(--disabled)');
  }
}

/**
 * Set the current font
 * @param {String} font 
 */
function setFont(font) {
  const root = document.documentElement;
  const elem = document.querySelector(`#${font} .span-font-status`);
  elem.innerText = 'In use'
  fontStatus[font].status = true
  root.style.setProperty('--current-header-font', fontStatus[font].fontFamily.header);
  root.style.setProperty('--current-body-font', fontStatus[font].fontFamily.body);
  elem.style.setProperty('color', 'var(--font-color)');
}

let fontList = document.getElementById('font-list');

/**
 * Font toggler
 */
fontList.addEventListener('click', function (e) {
  let target = e.target.id;
  let parent = e.target.parentNode.id;
  if (!fontStatus[target]) {
    if (fontStatus[parent]) {
      target = parent;
    } else {
      return;
    }
  }
  resetFontStatus();
  setFont(target);
  settings.activeFont = target;
  saveUserSettings();
});