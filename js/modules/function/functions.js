import Note from '../notes/note.js';
import { noNotesTemplate } from '../page/templates.js';
import { showEditor } from '../page/loadpageitems.js';
import { hideEditorOptions } from '../notes/edit.js'

import {
  displayNotes,
  displayListNotes
} from '../page/loadnotes.js';

import {
  STATES,
  setState,
  saveUserSettings
} from '../settings/user-settings.js';

import {
  addNote,
  getNote,
  getAllNotes,
  setPredefinedNotes,
  getPreviewTextFromNote,
  getNotesFromNewestToOldest
} from '../notes/note-list.js';


/**
 * Initialize localStorage keys before usage.
 */
export function initializeLocalStorage() {
  if (!localStorage.getItem('save-notes')) {
    localStorage.setItem('save-notes', '[]');
  } else {
    setPredefinedNotes(JSON.parse(localStorage.getItem('save-notes')));
  }
  if (!localStorage.getItem('edit-id')) {
    localStorage.setItem('edit-id', '0');
  }
  if (!localStorage.getItem('user-settings')) {
    saveUserSettings();
  }
}

/**
 * Save edit-id key to localStorage
 * @param {Number} id 
 */
export function saveEditID(id) {
  localStorage.setItem('edit-id', JSON.stringify(id));
}

/**
 * Load the edit-id key from localStorage
 * @returns Number
 */
export function loadEditID() {
  const id = JSON.parse(localStorage.getItem('edit-id'));
  if (!id) {
    return 0;
  }
  return parseInt(id);
}

/**
 * Save animation
 */
export function saveEventAnimation() {
  const saveNotification = document.querySelector("#saved-notification");

  setTimeout(() => {
    saveNotification.classList.add("saved-notification--show");
  }, 1000);

  setTimeout(() => {
    saveNotification.classList.remove("saved-notification--show");
  }, 6000);
}

/**
 * Removes all children nodes from a given HTML Node
 * @param {Node} node 
 */
export function clearAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Load content into the Quill editor 
 * @param {Quill} editor
 */
export function editorLoad(editor) {
  const allNotes = getAllNotes();
  const noteIdToLoad = allNotes.findIndex(data => data.dateOfCreation === Number(localStorage.getItem('edit-id')));
  if (noteIdToLoad !== -1) {
    editor.setContents(getNote(noteIdToLoad).content);
  }
}

/**
 * Clears Quill editor content
 * @param {Quill} editor
 */
export function clearContents(editor) {
  editor.setContents();
}

/**
 * Store available notes to localStorage
 */
export function storeContent() {
  localStorage.setItem('save-notes', JSON.stringify(getAllNotes()));
}

/**
 * Reset edit id, clear editor content, and its title
 * @param {Quill} editor
 */
export function resetEditor(editor) {
  saveEditID(0);
  clearContents(editor);
  document.getElementById('editorTitle').value = '';
}

/**
 * Setting content into editor from a selected Note
 * @param {Quill} editor
 * @param {Number} noteId
 */
export function populateEditor(editor, noteId) {
  const index = getAllNotes().findIndex(data => data.dateOfCreation === noteId);
  if (index !== -1) {
    const note = getNote(index);
    const editorTitle = document.getElementById('editorTitle');
    editor.setContents(note.content);
    editorTitle.value = note.title;
    hideEditorOptions();
    document.querySelector("#sidebar-notes").classList.remove("sidebar-show")
    saveEditID(noteId);
    storeContent();
  }
}

/**
 * Display maximum of 3 of the last changed notes
 */
export function displayLatestNoteList() {
  const notes = getAllNotes();
  if (notes.length === 0) {
    document.querySelector("#landing-page__note-list").innerHTML = noNotesTemplate();
  } else {
    let sortedNotesByLastEdit = getNotesFromNewestToOldest(notes);
    displayNotes(sortedNotesByLastEdit.slice(0, 3));
  }
}

/**
 * Opens last opened note from the landing page
 * @param {Quill} editor
 */
export function editOpenedNoteButton(editor) {
  const noteIdToEdit = loadEditID();
  const index = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteIdToEdit));

  showEditor();

  setTimeout(() => {
    document.querySelector("#sidebar-notes").classList.remove("sidebar-show")
  }, 1000);

  if (index !== -1) {
    const note = getNote(index);
    const editorTitle = document.getElementById('editorTitle');
    editor.setContents(note.content);
    editorTitle.value = note.title;
  }
  saveEditID(noteIdToEdit);
  storeContent();
  setState(STATES.EDITOR);
}

/**
 * Creates a note if it doesn't exist otherwise updates the current Note, and finally displays
 * @param {Quill} editor
 */
export function makeAndStoreContent(editor) {
  const allNotes = getAllNotes();
  const loadID = Number(loadEditID());
  let noteExists = false;

  allNotes.forEach(function (note) {
    if (note.dateOfCreation === loadID) {
      note.content = editor.getContents();
      noteExists = true;
      note.lastChanged = Date.now();
      note.title = document.getElementById('editorTitle').value;
      const h3TitleElement = document.querySelector(`h3[note-id='${loadID}']`);
      const previewTextElement = document.querySelector(`p[note-id='${loadID}']`);
      h3TitleElement.innerHTML = note.title;
      previewTextElement.innerHTML = getPreviewTextFromNote(note, 0, 50);
    }
    if (noteExists) return;
  });

  if (!noteExists) {
    const newNote = new Note({
      title: document.getElementById('editorTitle').value,
      content: editor.getContents()
    });
    addNote(newNote);
    saveEditID(newNote.dateOfCreation);
  }
  storeContent();
  displayListNotes(getAllNotes());
}
