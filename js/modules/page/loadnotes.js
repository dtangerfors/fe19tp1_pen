import {
    dateHowLongAgo,
    getTextFromContent
} from '../notes/note-list.js';

function notesTemplate(note) {
    // 360
    let preview = getTextFromContent(note.content.ops);
    if (preview.length > 350) {
        preview = preview.substring(0, 347) + "..."
    }
    return `
        <div class="notes" note-id="${note.dateOfCreation}">
            <h3 class="heading-tertiary notes__title" note-id="${note.dateOfCreation}">${note.title}</h3>
            <p class="notes__lastChanged" note-id="${note.dateOfCreation}">${dateHowLongAgo(note.dateOfCreation, note.lastChanged)}</p>
            <p class="notes__content" note-id="${note.dateOfCreation}">${preview}</p>
        </div>
    `
}

export function displayNotes(note) {
    return document.querySelector("#landing-page__note-list").innerHTML = note.map(notesTemplate).join("");
}

function listNoteTemplate(note) {
    let preview = getTextFromContent(note.content.ops);
    const imgSource = note.isFavorite ? './assets/icons/star-filled.svg' : './assets/icons/star-outlined.svg';
    if (preview.length > 50) {
        preview = preview.substring(0, 49) + "..."
    }
    return `
        <div class="note-container">
            <div class="note-container__inner note-class_${note.dateOfCreation}" note-id="${note.dateOfCreation}">
                <div class="note-container__text-content">
                    <h3 class="heading-tertiary notes__title" note-id="${note.dateOfCreation}">${note.title}</h3>
                    <p class="paragraph-date" note-id="${note.dateOfCreation}">${dateHowLongAgo(note.dateOfCreation, note.lastChanged)}</p>
                    <p class="paragraph" note-id="${note.dateOfCreation}">${preview}</p>
                </div>
            <div class="note-container__drag-indicator">
                <img src="assets/icons/drag-indicator.svg" alt="open sidemenu">
            </div>
        </div>
        <div class="note-container__menu note-class_${note.dateOfCreation}">
            <div note-id="${note.dateOfCreation}" class="note-container__menu-item"><img src="${imgSource}" alt="favorite note" class="note-container__icon note-favorite"></div>
            <div note-id="${note.dateOfCreation}" class="note-container__menu-item"><img src="assets/icons/delete.svg" alt="delete note" class="note-container__icon note-delete"></div>
        </div>
    </div>
    `
}

export function displayListNotes(note) {
    return document.querySelector('#note-list-sidebar').innerHTML = note.map(listNoteTemplate).join('');
}
