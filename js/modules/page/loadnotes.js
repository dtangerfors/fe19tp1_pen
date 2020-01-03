import {
  notesTemplate,
  listNoteTemplate
} from './templates.js';

/**
 * Displays notes in the landing page
 * @param {Note[]} notes
 */
export function displayNotes(notes) {
  document.querySelector("#landing-page__note-list").innerHTML = notes.map(notesTemplate).join("");
}

/**
 * Displays notes in the sidebar
 * @param {Note[]} notes
 */
export function displayListNotes(notes) {
  document.querySelector('#note-list-sidebar').innerHTML = notes.map(listNoteTemplate).join('');
}
