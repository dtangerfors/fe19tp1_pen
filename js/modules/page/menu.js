export function noteListSlide() {
    const note = document.getElementById('nav-note');
    const noteList = document.querySelector('#sidebar-notes');
    const settings = document.getElementById('nav-settings');
    const settingsList = document.querySelector('#sidebar-settings');

    note.addEventListener('click', function () {
        if (settingsList.classList.contains('sidebar-show')) {
            settingsList.classList.toggle('sidebar-show');
        }

        noteList.classList.toggle('sidebar-show');
    });

    settings.addEventListener('click', function () {
        if (noteList.classList.contains('sidebar-show')) {
            noteList.classList.toggle('sidebar-show');
        }
        settingsList.classList.toggle('sidebar-show');
    });
}