/**
 * Animation for the sidebar
 */
export function noteListSlide() {
  const note = document.getElementById('nav-note');
  const noteList = document.querySelector('#sidebar-notes');
  const navLinkNote = document.querySelector("#nav-link-note");
  const settings = document.getElementById('nav-settings');
  const settingsList = document.querySelector('#sidebar-settings');
  const navLinkSettings = document.querySelector("#nav-link-settings");

  note.addEventListener('click', function () {
    if (settingsList.classList.contains('sidebar-show')) {
      settingsList.classList.toggle('sidebar-show');
      navLinkSettings.classList.toggle('nav__link--active');
    }
    noteList.classList.toggle('sidebar-show');
    navLinkNote.classList.toggle('nav__link--active');
  });

  settings.addEventListener('click', function () {
    if (noteList.classList.contains('sidebar-show')) {
      noteList.classList.toggle('sidebar-show');
      navLinkNote.classList.toggle('nav__link--active');
    }
    settingsList.classList.toggle('sidebar-show');
    navLinkSettings.classList.toggle('nav__link--active');
  });
}
