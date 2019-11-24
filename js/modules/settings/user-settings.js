/**
 * End user settings
 */
export const settings = {
	autoSave: false,
  activeTheme: 'light',
  activeFont: 'noto-switch'
};

const fontStatus = {
  'noto-switch' : {
    status: false, 
    fontFamily: {
      header: `'Noto Sans', sans-serif`,
      body: `'Noto Serif', serif`
    }
  },
  'poppin-switch' : {
    status: false,
    fontFamily: {
      header: `'Poppins', sans-serif`,
      body: `'Noto Sans', sans-serif`
    }
  },
  'quire-switch' : {
    status: false,
    fontFamily: {
      header: `'Playfair Display', serif`,
      body: `'Roboto', sans-serif`
    }
  }
}

/**
 * Load settings from localstorage if it's saved.
 */
const localSettings = JSON.parse(localStorage.getItem('user-settings'));
if(localSettings) {
	settings.autoSave = localSettings.autoSave || settings.autoSave;
	settings.activeTheme = localSettings.activeTheme || settings.activeTheme;
  settings.activeFont = localSettings.activeFont || settings.activeFont;
  saveUserSettings();
}
resetFontStatus();
setFont(settings.activeFont);

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
function toggleTheme() {
  if (settings.activeTheme === 'dark'){
    setTheme('light');
    return 'light';
  }
  setTheme('dark');
  return 'dark';
}

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

/**
 * Font change
 */

function resetFontStatus() {
  const root = document.documentElement;
  root.style.setProperty('--current-header-font', '');
  root.style.setProperty('--current-body-font', '');
  for(let key in fontStatus) {
    const elem = document.getElementById(key);
    elem.innerHTML = 'Not in use';
    fontStatus[key].status = false;
    elem.style.setProperty('color', 'gray');
  }
}

function setFont(font) {
  const root = document.documentElement;
  const elem = document.getElementById(font)
  elem.innerHTML = 'In use'
  fontStatus[font].status = true
  root.style.setProperty('--current-header-font', fontStatus[font].fontFamily.header);
  root.style.setProperty('--current-body-font', fontStatus[font].fontFamily.body);
  elem.style.setProperty('color', 'lime');
}

let fontList = document.getElementById('font-list');

/**
 * Font toggler
 */
fontList.addEventListener('click', function (e) {
  let target = e.target.id;
  if(!fontStatus[target]) return;

  resetFontStatus();
  setFont(target);

  settings.activeFont = target;
  saveUserSettings();
});