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
        <div class="notes" note-id="${note.dateOfCreation}">
            <h3 class="notes__title" note-id="${note.dateOfCreation}">${note.title}</h3>
            <p class="notes__lastChanged" note-id="${note.dateOfCreation}">Last edited ${dateHowLongAgo(note.lastChanged)}</p>
            <p class="notes__content" note-id="${note.dateOfCreation}">${preview}</p>
        </div>
    `
}

export function displayNotes(note) {
    return document.querySelector("#landing-page__note-list").innerHTML = note.map(notesTemplate).join("");
}
