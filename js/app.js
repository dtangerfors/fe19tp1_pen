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
  isCurrentState,
  STATES
} from './modules/settings/user-settings.js';

import {
  displayNotes,
  displayListNoteItem
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
      storeAndDisplayContent();
    }
  }
});

let searchPreviewLength = 20;
let sortByFavoriteActive = false;
let sortFromNewest = false;

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
  //saving id from saved content
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
/**
 * This function stores content from editor and if it is not edited stores
 * a new content and display in note-list
 */
function storeAndDisplayContent() {
  const allNotes = getAllNotes();
  const loadID = Number(loadEditID()); //loading editor note id
  let noteExists = false;

  allNotes.forEach(function (note) {
    if (note.dateOfCreation === loadID) { 
      //saving current edited content if id are same
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
    //saves a new content in local storage
    const newNote = new Note({
      title: document.getElementById('editorTitle').value,
      content: editor.getContents()
    });
    addNote(newNote);
    saveEditID(newNote.dateOfCreation);
  }
  storeContent();
  displayListNoteItem(getAllNotes());
}

function populateEditor(noteId) {
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

function saveEventAnimation() {
  const saveNotification = document.querySelector("#saved-notification");

  setTimeout(() => {
    saveNotification.classList.add("saved-notification--show");
  }, 1000);

  setTimeout(() => {
    saveNotification.classList.remove("saved-notification--show");
  }, 6000);
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

/////////////////// EVENT HANDLERS ///////////////////

/**
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 */
function removeNoteEventHandler(event) {
/**
* This function removes item from localstorage and displaying from notelist based on id
*/
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
/**
* This function sets favorite or remove favorite on notes and sets it top local storage
*/
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
    const indicatorChildren = document.querySelector(`.note-container__menu.note-class_${classID}`);

    textContent.classList.toggle('group-button-show-inner');
    indicator.classList.toggle('group-button-show-inner');
    indicatorChildren.classList.toggle('group-button-menu');
  }
}

function sortEventHandler() {
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

  displayListNoteItem(notes);
}

function favoriteEventHandler() {
  const getFavoriteIcon = document.querySelector('#favorite-icon');
  sortByFavoriteActive = !sortByFavoriteActive;
  if (sortByFavoriteActive) {
    displayListNoteItem(getFavorites());
  } else {
    displayListNoteItem(getAllNotes());
  }
  getFavoriteIcon.setAttribute('src', `assets/icons/star-${sortByFavoriteActive ? 'filled' : 'outlined'}.svg`);
}

function searchEventHandler() {
  let notes = getAllNotes();

  if (sortByFavoriteActive) {
    notes = getFavorites();
  }

  if (notes.length > 0) {
    clearAllChildren(document.querySelector('#note-list-sidebar'));

    const foundNotes = notes.filter((note, index) => {
      return searchText(getTextFromContent(note.content.ops), this.value) || searchText(note.title, this.value);
    });

    displayListNoteItem(foundNotes);
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
    const noteIdToEdit = Number(event.target.getAttribute('note-id'));
    let animate = true;
    if(isCurrentState(STATES.EDITOR)) {
      if(noteIdToEdit === loadEditID()) {
        document.querySelector("#sidebar-notes").classList.remove("sidebar-show");
        return
      }
      animate = false;
    }
    populateEditor(noteIdToEdit);
    showEditor(animate);
    setState(STATES.EDITOR);
  } else if (event.target.classList.contains('note-container__drag-indicator') || event.target.parentNode.classList.contains('note-container__drag-indicator')) {
    button3DotEventHandler(event);
  } else if (event.target.classList.contains('note-favorite')) {
    setFavoriteNoteEventHandler(event);
  } else if (event.target.classList.contains('note-delete')) {
    removeNoteEventHandler(event);
  }
}

function printEventHandler() {
  window.print();
}

function mobileToolbarExtensionEventHandler() {
  const editorOptions = document.querySelector('#editor-menu-item-options');
  editorOptions.classList.toggle('editor-options-menu-show');

  document.querySelector('.editor-section__menu').classList.toggle('editor-section__menu-opened');
}

function searchIconEventHandler() {
  const searchBar = document.querySelector('#note-search-list');
  const classConditon = searchBar.classList.contains('hide-search');
  if (classConditon) {
    searchBar.classList.remove('hide-search');
    searchBar.classList.add('show-search');
  } else {
    searchBar.classList.remove('show-search');
    searchBar.classList.add('hide-search');
  }
}

function newNoteButtonEventHandler() {
  createNewNote();
  showEditor();
}

function quireLogoEventHandler() {
  if(!isCurrentState(STATES.LANDING_PAGE)) {
    showLandingPage(editOpenedNoteButton);
    displayLatestNoteList();
    setState(STATES.LANDING_PAGE);
  }
}

function mainPageClickEventHandler(event) {
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
}

function saveButtonEventHandler() {
  saveEventAnimation();
  storeAndDisplayContent();
}

/**
 * Adds all necessary event listeners
 */
function addEventListeners() {
  //Latest Notes - On Click
  document.querySelector("#landing-page__note-list").addEventListener('click', noteOnClickEventHandler);
  //Notes list - On Click
  document.querySelector("#note-list-sidebar").addEventListener('click', noteOnClickEventHandler);
  //Note list - Search Icon - On Click
  document.querySelector('#search-icon').addEventListener('click', searchIconEventHandler);
  //Note list - Sorting Icon - On Click
  document.querySelector('#sort-icon').addEventListener('click', sortEventHandler);
  //Note list - Favorite icon - On Click
  document.querySelector('#favorite-icon').addEventListener('click', favoriteEventHandler);
  //Note list - Search Field - On Text Input 
  document.querySelector('#search').addEventListener('input', searchEventHandler);
  //Note - Edit Note - On Click
  document.querySelector("#button-editNote").addEventListener("click", showEditorOptions);
  //Note - Printer Icon - On Click
  document.querySelector('#printerButton').addEventListener('click', printEventHandler);
  //Note - Save Icon - On Click
  document.querySelector('#save-btn').addEventListener('click', saveButtonEventHandler);
  //Note - Expand Toolbar on mobile view - On Click
  document.querySelector('#editor-menu-item-show').addEventListener('click', mobileToolbarExtensionEventHandler);
  //Main Page - On Click
  document.querySelector('#main-page-content').addEventListener("click", mainPageClickEventHandler);
  //Note - New Document - On Click
  document.querySelector('#new-document').addEventListener('click', createNewNote);
  //Landing Page - New Note - On Click
  document.querySelector("#add-new-note-button").addEventListener("click", newNoteButtonEventHandler);
  //Navbar - Quire Logo - On Click
  document.querySelector("#quire-logo").addEventListener("click", quireLogoEventHandler);
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

function createNewNote() {
  //Reset edit id, clear editor content and its title
  saveEditID(0);
  clearContents();
  document.getElementById('editorTitle').value = '';
  setState(STATES.EDITOR);
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
/**
 * this fucntion load all content en window is loaded
 */
function main() {
  initializeLocalStorage();
  noteListSlide();
  editorLoad();
  displayLatestNoteList();
  displayListNoteItem(getAllNotes());
  showEditButton(editOpenedNoteButton);
  addEventListeners();

  switch (getCurrentState()) {

    case STATES.LANDING_PAGE:
      break;
    case STATES.EDITOR:
      populateEditor(loadEditID());
      showEditor(false);
      showEditorOptions();
      break;
  }
}

window.addEventListener("load", main);