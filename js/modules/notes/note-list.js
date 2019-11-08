import Note from './note.js';

/**
 * A list to store our notes in
 */
const Notes = [];


/**
 * flag : Sorting variable indicating Ascending - Descending
 */
let flag = false;

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

export function getFavorites() {
  return Notes.filter(note => note.isFavorite);
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

/**
 * Sort notes by title
 */
export function sortNotesByTitle() {
  flag = !flag;
  return flag ? Notes.sort((a,b) => {
    return a.title - b.title;
  }) : Notes.sort((a,b) => {
    return b.title - a.title;
  });
}
/**
 * Sort notes by date
 */
export function sortNotesByDate() {
  flag = !flag;
  return flag ? Notes.sort((a,b) => {
    return a.lastChanged - b.lastChanged;
  }) : Notes.sort((a,b) => {
    return b.lastChanged - a.lastChanged;
  });
}
/**
 * Taking predefined notes from external source
 * @param {Note} notes 
 */
export function setPredefinedNotes(notes) {
    notes.forEach((note) => {
        Notes.push(new Note(note));
    });
}
