export const navbarSlide = () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav__link-group');
    const navLinks = document.querySelectorAll('.nav__link-group li');

    burger.addEventListener('click', function () {
        //Toggle nav
        nav.classList.toggle('nav-active');

        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease backwards ${index / 7 + 0.2}s`;
            }
        });
        //burger animation
        this.classList.toggle('hamburger-toggle')
    });
};

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