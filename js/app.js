/*
  Import modules
*/
import Note from './modules/notes/note.js';
import {
  addNote,
  removeBasedOnIndex,
  getNotesFromNewestToOldest,
  getNotesFromOldestToNewest,
  getPreviewTextFromNote,
  getNote,
  getFavorites,
  getAllNotes,
  setPredefinedNotes,
  getTextFromContent
} from './modules/notes/note-list.js';
import {
  options as quillSettings
} from './modules/settings/quill-settings.js';

import {
  settings as userSettings,
  getCurrentState,
  setState,
  STATES
} from './modules/settings/user-settings.js';

import {
  displayNotes,
  displayListNotes
} from './modules/page/loadnotes.js';

import {
  showEditButton,
  showEditor,
  showLandingPage
} from './modules/page/loadpageitems.js';

import {
  noteListSlide
} from './modules/page/menu.js';

import { showEditorOptions, hideEditorOptions } from './modules/notes/edit.js';

/**
 * Quill Editor
 */


const editor = new Quill('#editor-code', quillSettings);

editor.on('text-change', (_1, _2, source) => {
  if (source === 'user') {
    if (userSettings.autoSave && +loadEditID() !== 0) {
      makeAndStoreContent();
    }
  }
});

let searchPreviewLength = 20;

/*
  Initialize localStorage keys before usage.
*/
function initializeLocalStorage() {
  if (!localStorage.getItem('save-notes')) {
    localStorage.setItem('save-notes', '[]');
  } else {
    setPredefinedNotes(JSON.parse(localStorage.getItem('save-notes')));
  }
  if (!localStorage.getItem('edit-id')) {
    localStorage.setItem('edit-id', '0');
  }
  if (!localStorage.getItem('user-settings')) {
    localStorage.setItem('user-settings', JSON.stringify(userSettings));
  }
}
/**
 * 
 * @param {number} id 
 */
function saveEditID(id) {
  localStorage.setItem('edit-id', JSON.stringify(id));
}

/**
 * Load the editID from LocalStorage
 */
function loadEditID() {
  const id = JSON.parse(localStorage.getItem('edit-id'));
  if (!id) {
    return 0;
  }
  return parseInt(id);
}

function makeAndStoreContent() {
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
    if(noteExists) return;
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


/////////////////// EVENT HANDLERS ///////////////////

/**
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 */
function removeNoteEventHandler(event) {
  const noteIdToRemove = event.target.parentNode.getAttribute('note-id');
  const indexToRemove = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteIdToRemove));

  const message = window.confirm("Do you want to delete?")

  if (message === true) {
    localStorage.setItem('edit-id', '0');
    clearContents();
    document.getElementById('editorTitle').value = '';
    removeBasedOnIndex(indexToRemove);
    event.target.parentNode.parentNode.parentNode.remove();
    //Save our new content
    storeContent();
  }
}

/**
 * Event handler to favorit selected note
 * @param {MouseEvent} event
 */
function setFavoriteNoteEventHandler(event) {
  const favoriteNote = event.target.parentNode.getAttribute('note-id');
  const index = getAllNotes().findIndex(note => note.dateOfCreation === Number(favoriteNote));
  const note = getNote(index);
  const isFavorited = note.setFavorite();
  event.target.src = isFavorited ? './assets/icons/star-filled.svg' : './assets/icons/star-outlined.svg';
  storeContent();
}

/**
 * Event handler for showing and hiding list member buttons
 * @param {MouseEvent} event 
 */
function button3DotEventHandler(event) {
  if (!(event.target.getAttribute('class'))) {
    const classID = event.target.parentNode.parentNode.getAttribute('note-id');
    
    const textContent = document.querySelector(`.note-class_${classID} .note-container__text-content`);
    const indicator = document.querySelector(`.note-class_${classID} .note-container__drag-indicator`);
    const indicatorChildren = document.querySelector(`.note-container__menue.note-class_${classID}`);

    textContent.classList.toggle('group-button-show-inner');
    indicator.classList.toggle('group-button-show-inner');
    indicatorChildren.classList.toggle('group-button-menue');
  }
}

function populateEditor(noteId) {
  const index = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteId));
  if(index !== -1) {
    const note = getNote(index);
    const editorTitle = document.getElementById('editorTitle');
    editor.setContents(note.content);
    editorTitle.value = note.title;
    hideEditorOptions();
    setTimeout(() => document.querySelector("#sidebar-notes").classList.remove("sidebar-show"), 1000);
    saveEditID(noteId);
    storeContent();
  }
}

/**
 * Event handler for editing selected note
 * @param {MouseEvent} event 
 */
function noteOnClickEventHandler(event) {
  let filterTarget = event.target.getAttribute('class');
  let buttonGroup = event.target.nodeName;
  if (filterTarget !== 'note-button-group group-button-show' && filterTarget !== 'note-button-group' && buttonGroup.toLowerCase() !== 'img') {
    const noteIdToEdit = event.target.getAttribute('note-id');
    populateEditor(noteIdToEdit);
    showEditor();
    setState(STATES.EDITOR);
  } else if(event.target.classList.contains('note-container__drag-indicator') || event.target.parentNode.classList.contains('note-container__drag-indicator')) {
    button3DotEventHandler(event);
  } else if(event.target.classList.contains('note-favorite')) {
    setFavoriteNoteEventHandler(event);
  } else if(event.target.classList.contains('note-delete')){
    removeNoteEventHandler(event);
  }
}

/////////////////// END EVENT HANDLERS ///////////////////

/**
 * Opens last opened note from the landing page
 */
function editOpenedNoteButton() {
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
}

function clearAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

//save button
document.querySelector('#save-btn').addEventListener('click', saveFunction);

//Create a new document button
document.querySelector('#new-document').addEventListener('click', createNewDocument);

function saveEventAnimation() {
  const saveNotification = document.querySelector("#saved-notification");

  setTimeout(() => {
    saveNotification.classList.add("saved-notification--show");
  }, 1000);

  setTimeout(() => {
    saveNotification.classList.remove("saved-notification--show");
  }, 6000);
}


function saveFunction() {
  saveEventAnimation();
  makeAndStoreContent();
}

function createNewDocument() {
    //Reset edit id, clear editor content and its title
    saveEditID(0);
    clearContents();
    document.getElementById('editorTitle').value = '';
}

function editorLoad() {
  const allNotes = getAllNotes();
  const noteIdToLoad = allNotes.findIndex(data => data.dateOfCreation === Number(localStorage.getItem('edit-id')));
  if (noteIdToLoad !== -1) {
    editor.setContents(getNote(noteIdToLoad).content);
  }

}

function clearContents() {
  editor.setContents(); //clear all text;
}

function storeContent() {
  localStorage.setItem('save-notes', JSON.stringify(getAllNotes()));
}


document.getElementById('main-page-content').addEventListener("click", (event) => {
  const settingsList = document.querySelector('#sidebar-settings');
  const navLinkSettings = document.querySelector("#nav-link-settings");
  const noteList = document.querySelector('#sidebar-notes');
  const navLinkNote = document.querySelector("#nav-link-note");

  const targetName = event.target.id;

  if ((targetName !== "sidebar-notes") && (targetName !== "nav-note")) {
    noteList.classList.remove("sidebar-show");
    navLinkNote.classList.remove('nav__link--active');
    navLinkSettings.classList.remove('nav__link--active');
  }
  if ((targetName !== "sidebar-settings") && (targetName !== "nav-settings")) {
    settingsList.classList.remove("sidebar-show");
    navLinkNote.classList.remove('nav__link--active');
    navLinkSettings.classList.remove('nav__link--active');
  }
});

/**
 * Sort saved notes by latest edited note
 */
let sortedNotesByLastEdit;

function noNotes() {
  return `
    <p class="no-notes">No notes, why not write your first note?</p>
  `;
}

/**
 * Decides what to display if there is any notes in LocalStorage
 */
function displayLatestNoteList() {
  const notes = getAllNotes();
  if (notes.length === 0) {
    document.querySelector("#landing-page__note-list").innerHTML = noNotes();
  } else {
    sortedNotesByLastEdit = getNotesFromNewestToOldest(notes);
    displayNotes(sortedNotesByLastEdit.slice(0, 3));
  }
}

document.querySelector("#add-new-note-button").addEventListener("click", () => {
  createNewDocument();
  showEditor();
});

document.querySelector("#quire-logo").addEventListener("click", () => {
  showLandingPage(editOpenedNoteButton);
  displayLatestNoteList();
  setState(STATES.LANDING_PAGE);
});

function addEventhandler() {
  const latestNotes = document.querySelector("#landing-page__note-list");
  const editTextList = document.querySelector("#note-list-sidebar");
  
  latestNotes.addEventListener('click', noteOnClickEventHandler);
  editTextList.addEventListener('click', noteOnClickEventHandler);
}

function main() {
  initializeLocalStorage();
  noteListSlide();
  editorLoad();
  displayLatestNoteList();
  displayListNotes(getAllNotes());
  showEditButton(editOpenedNoteButton);
  addEventhandler();

  switch(getCurrentState()) {

    case STATES.LANDING_PAGE:

    break;

    case STATES.EDITOR:
        populateEditor(loadEditID());
        showEditor(false);
        showEditorOptions();
    break;
  }
}


function searchText(text, word) {
  text = text.toLowerCase();
  word = word.toLowerCase().replace(/([()[{*+.$^\\|?])/g, '\\$1');

  const index = text.search(word);

  if (index !== -1) {
    let start = index - searchPreviewLength < 0 ? 0 : index - searchPreviewLength;
    let end = start === 0 ? index : searchPreviewLength;
    return { start, end, index };
  }

  return false;
}

document.querySelector('#search-icon').addEventListener('click', function () {
  const searchBar = document.querySelector('#note-search-list');
  const classConditon = searchBar.classList.contains('hide-search');
  if (classConditon) {
    searchBar.classList.remove('hide-search');
    searchBar.classList.add('show-search');
  } else {
    searchBar.classList.remove('show-search');
    searchBar.classList.add('hide-search');
  }
});

let sortByFavoriteActive = false;
let sortFromNewest = false; 

document.querySelector('#sort-icon').addEventListener('click', function() {
  sortFromNewest = !sortFromNewest;

  let notes = getAllNotes();
  if (sortByFavoriteActive) {
    notes = getFavorites();
  }

  if (sortFromNewest) {
    notes = getNotesFromNewestToOldest(notes);
  } else {
    notes = getNotesFromOldestToNewest(notes);
  }

  displayListNotes(notes);

});

document.querySelector('#favorite-icon').addEventListener('click', function () {
  const getFavoriteIcon = document.querySelector('#favorite-icon');
  sortByFavoriteActive = !sortByFavoriteActive;
  if(sortByFavoriteActive) {
    displayListNotes(getFavorites());
  } else {
    displayListNotes(getAllNotes());
  }
  getFavoriteIcon.setAttribute('src', `assets/icons/star-${sortByFavoriteActive ? 'filled' : 'outlined'}.svg`);
});

document.getElementById('search').addEventListener('input', function () {
  let notes = getAllNotes();

  if (sortByFavoriteActive) {
    notes = getFavorites();
  }

  if (notes.length > 0) {
    clearAllChildren(document.querySelector('#note-list-sidebar'));

    const foundNotes = notes.filter((note, index) => {
      return searchText(getTextFromContent(note.content.ops), this.value) || searchText(note.title, this.value);
    });

    displayListNotes(foundNotes);
  }
});

document.querySelector("#button-editNote").addEventListener("click", showEditorOptions);

/**
 * Print button
 */
document.getElementById('printerButton').addEventListener('click', function () {
  window.print();
});

document.querySelector('#editor-menu-item-show').addEventListener('click', () => {
  const editorOptions = document.querySelector('#editor-menu-item-options');
  editorOptions.classList.toggle('editor-options-menu-show');

  document.querySelector('.editor-section__menu').classList.toggle('editor-section__menu-opened');
})

window.addEventListener("load", main);