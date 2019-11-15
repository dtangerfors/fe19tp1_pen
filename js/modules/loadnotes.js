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

function notesTemplate(note) {
    // 360
    let preview = getTextFromContent(note.content.ops);
    if (preview.length > 350) {
        preview = preview.substring(0, 347) + "..."
    }
    return `
        <div class="notes">
            <h3 class="notes__title">${note.title}</h3>
            <p class="notes__lastChanged">${convertDate(note.lastChanged)}</p>
            <p class="notes__content">${preview}</p>
        </div>
    `
}

function displayNotes(note) {
    return document.querySelector("#landing-page__note-list").innerHTML = note.map(notesTemplate).join("");
}

function convertDate(date) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let getYear = new Date(date).getFullYear()
    let getMonth = new Date(date).getMonth()
    let getDate = new Date(date).getDate()
    return "Last edited " + months[getMonth] + " " + getDate + ", " + getYear
}

function main() {
    displayNotes(savedNotes);
}

window.addEventListener("DOMContentLoaded", main);