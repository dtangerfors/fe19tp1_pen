import {
    dateHowLongAgo,
    getTextFromContent
} from './notes/note-list.js';

function notesTemplate(note) {
    // 360
    let preview = getTextFromContent(note.content.ops);
    if (preview.length > 350) {
        preview = preview.substring(0, 347) + "..."
    }
    return `
        <div class="notes">
            <h3 class="notes__title">${note.title}</h3>
            <p class="notes__lastChanged">Last edited ${dateHowLongAgo(note.lastChanged)}</p>
            <p class="notes__content">${preview}</p>
        </div>
    `
}

export function displayNotes(note) {
    return document.querySelector("#landing-page__note-list").innerHTML = note.map(notesTemplate).join("");
}

export function sortNotesByLatestEdited(a, b) {
    const dateA = new Date(a.lastChanged).getTime();
    const dateB = new Date(b.lastChanged).getTime();
    return dateA > dateB ? 1 : -1;
}; 
