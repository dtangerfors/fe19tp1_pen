import Note from './note.js';

/**
 * A list to store our notes in
 */
const Notes = [];

/**
 * Add a note to the Notes list
 * @param {Note} note - accepts a Note object
 */
export function addNote(note) {
    //If the input note is not a Note object, we don't add it
    if (typeof note !== "object") return;
    if (note.length) return;
    if (!note.title || !note.content) return;
    Notes.push(note);

}

/**
 * Remove a note from a given index
 * @param {number} index 
 */
export function removeBasedOnIndex(index) {
    if (Notes[index]) {
        Notes.splice(index, 1);
    }
}

/**
 * Removes the first note it finds with a given title
 * @param {string} title 
 */
export function removeFirstFoundBasedOnTitle(title) {
    const index = Notes.findIndex(t => t === title);
    if (index !== -1) {
        removeBasedOnIndex(index);
    }
}

/**
 * Retrieve a note based on a given index
 * @param {number} index 
 */
export function getNote(index) {
    return Notes[index]
}

/**
 * Retrieve all notes
 */
export function getAllNotes() {
    return Notes
}

export function setPredefinedNotes(notes) {
    notes.forEach((note) => {
        Notes.push(new Note(note.title, note.content, note.dateOfCreation, note.lastChanged));
    });
}