/**
 * Saved notes from localStorage
 */
let savedNotes = localStorage.getItem("save-notes");

// Convert our JSON object to JS object
savedNotes = JSON.parse(savedNotes);

function getTextFromContent(content) {
    let str = '';
    for (let v of content) {
        str += v.insert;
    }
    return str;
}

function notesTemplate(note){
    return `
        <div class="notes">
            <h3 class="notes__title">${note.title}</h3>
            <p class="notes__lastChanged">${note.lastChanged}</p>
            <p class="notes__content">${getTextFromContent(note.content.ops)}</p>
        </div>
    `

}

function displayNotes(note){
    return document.querySelector("#landing-page__note-list").innerHTML = note.map(notesTemplate).join("");
}

function main() {
    displayNotes(savedNotes);
}
window.addEventListener("DOMContentLoaded", main);