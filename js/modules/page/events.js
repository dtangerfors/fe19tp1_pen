import { displayListNotes } from '../page/loadnotes.js';
import { showEditorOptions } from '../notes/edit.js';

import {
  showEditor,
  showLandingPage
} from '../page/loadpageitems.js';

import {
  setState,
  isCurrentState,
  STATES
} from '../settings/user-settings.js';

import {
  removeBasedOnIndex,
  getNotesFromNewestToOldest,
  getNotesFromOldestToNewest,
  getNote,
  getFavorites,
  getAllNotes,
  getTextFromContent,
  searchText
} from '../notes/note-list.js';

import {
  storeContent,
  clearAllChildren,
  loadEditID,
  populateEditor,
  displayLatestNoteList,
  saveEventAnimation,
  makeAndStoreContent,
  clearContents,
  editOpenedNoteButton,
  resetEditor
} from '../function/functions.js';


/**
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 * @param {Quill} editor
 */
export function removeNoteEventHandler(event, editor) {
  const noteIdToRemove = event.target.parentNode.getAttribute('note-id');
  const indexToRemove = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteIdToRemove));

  const message = window.confirm("Do you want to delete?")

  if (message === true) {
    localStorage.setItem('edit-id', '0');
    clearContents(editor);
    document.getElementById('editorTitle').value = '';
    removeBasedOnIndex(indexToRemove);
    event.target.parentNode.parentNode.parentNode.remove();
    //Save our new content
    storeContent();
  }
}

/**
 * Event handler to favorite selected note
 * @param {MouseEvent} event
 */
export function setFavoriteNoteEventHandler(event) {
  const favoriteNote = event.target.parentNode.getAttribute('note-id');
  const index = getAllNotes().findIndex(note => note.dateOfCreation === Number(favoriteNote));
  const note = getNote(index);
  const isFavorited = note.toggleFavorite();
  event.target.src = isFavorited ? './assets/icons/star-filled.svg' : './assets/icons/star-outlined.svg';
  storeContent();
}

/**
 * Event handler for showing and hiding list member buttons
 * @param {MouseEvent} event 
 */
export function button3DotEventHandler(event) {
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

/**
 * @type Boolean
 */
let sortFromNewest = false;
/**
 * @type Boolean
 */
let sortByFavoriteActive = false;

/**
 * Event handler for sorting a list of Notes
 */
export function sortEventHandler() {
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
}

/**
 * Event handler for toggling list of favorite Notes
 */
export function favoriteEventHandler() {
  const getFavoriteIcon = document.querySelector('#favorite-icon');
  sortByFavoriteActive = !sortByFavoriteActive;
  if (sortByFavoriteActive) {
    displayListNotes(getFavorites());
  } else {
    displayListNotes(getAllNotes());
  }
  getFavoriteIcon.setAttribute('src', `assets/icons/star-${sortByFavoriteActive ? 'filled' : 'outlined'}.svg`);
}

/**
 * Event handler for search input
 */
export function searchEventHandler() {
  let notes = getAllNotes();
  
  if (sortByFavoriteActive) {
    notes = getFavorites();
  }
  if (notes.length > 0) {
    clearAllChildren(document.querySelector('#note-list-sidebar'));
    const foundNotes = notes.filter(note => searchText(getTextFromContent(note.content.ops), this.value) || searchText(note.title, this.value));
    displayListNotes(foundNotes);
  }
}

/**
 * Event handler for print
 */
export function printEventHandler() {
  window.print();
}

/**
 * Event handler for editing selected note
 * @param {MouseEvent} event 
 * @param {Quill} editor 
 */
export function noteOnClickEventHandler(event, editor) {
  let filterTarget = event.target.getAttribute('class');
  let buttonGroup = event.target.nodeName;
  if (filterTarget !== 'note-button-group group-button-show' && filterTarget !== 'note-button-group' && buttonGroup.toLowerCase() !== 'img') {
    const noteIdToEdit = Number(event.target.getAttribute('note-id'));
    let animate = true;
    if(isCurrentState(STATES.EDITOR)) {
      if(noteIdToEdit === loadEditID()) {
        document.querySelector("#sidebar-notes").classList.remove("sidebar-show");
        return;
      }
      animate = false;
    }
    populateEditor(editor, noteIdToEdit);
    showEditor(animate);
    setState(STATES.EDITOR);
  } else if (event.target.classList.contains('note-container__drag-indicator') || event.target.parentNode.classList.contains('note-container__drag-indicator')) {
    button3DotEventHandler(event);
  } else if (event.target.classList.contains('note-favorite')) {
    setFavoriteNoteEventHandler(event);
  } else if (event.target.classList.contains('note-delete')) {
    removeNoteEventHandler(event, editor);
  }
}

/**
 * Event handler for toggling the collapse of the toolbar on mobile view
 */
export function mobileToolbarExtensionEventHandler() {
  const editorOptions = document.querySelector('#editor-menu-item-options');
  editorOptions.classList.toggle('editor-options-menu-show');
  document.querySelector('.editor-section__menu').classList.toggle('editor-section__menu-opened');
}

/**
 * Event handler for clicking the search image on note list view
 */
export function searchIconEventHandler() {
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

/**
 * Event handler to create and show a fresh editor
 * @param {MouseEvent} event 
 * @param {Quill} editor 
 */
export function newNoteButtonEventHandler(event, editor) {
  createNewNote(event, editor);
  showEditor();
}

/**
 * Event handler to switch to landing page upon clicking Q symbol
 * @param {MouseEvent} event 
 * @param {Quill} editor 
 */
export function quireLogoEventHandler(event, editor) {
  if(!isCurrentState(STATES.LANDING_PAGE)) {
    showLandingPage(() => editOpenedNoteButton(editor));
    displayLatestNoteList();
    setState(STATES.LANDING_PAGE);
  }
}

/**
 * Event handler to close the sidebar upon clicking outside the sidebar
 * @param {MouseEvent} event 
 */
export function mainPageClickEventHandler(event) {
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

/**
 * Event handler to animate save, and save content from the editor
 * @param {MouseEvent} event 
 * @param {Quill} editor 
 */
export function saveButtonEventHandler(event, editor) {
  saveEventAnimation();
  makeAndStoreContent(editor);
}

/**
 * Resets the editor and points the current state to 'EDITOR'
 * @param {MouseEvent} event 
 * @param {Quill} editor 
 */
export function createNewNote(event, editor) {
  resetEditor(editor);
  setState(STATES.EDITOR);
}

/**
 * Attaches available event listeners
 * @param {Quill} editor 
 */
export function addEventListeners(editor) {
  //Latest Notes - On Click
  document.querySelector("#landing-page__note-list").addEventListener('click', (e) => noteOnClickEventHandler(e, editor));
  //Notes list - On Click
  document.querySelector("#note-list-sidebar").addEventListener('click', (e) => noteOnClickEventHandler(e, editor));
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
  document.querySelector('#save-btn').addEventListener('click', (e) => saveButtonEventHandler(e, editor));
  //Note - Expand Toolbar on mobile view - On Click
  document.querySelector('#editor-menu-item-show').addEventListener('click', mobileToolbarExtensionEventHandler);
  //Main Page - On Click
  document.querySelector('#main-page-content').addEventListener("click", mainPageClickEventHandler);
  //Note - New Document - On Click
  document.querySelector('#new-document').addEventListener('click', (e) => createNewNote(e, editor));
  //Landing Page - New Note - On Click
  document.querySelector("#add-new-note-button").addEventListener("click", (e) => newNoteButtonEventHandler(e, editor));
  //Navbar - Quire Logo - On Click
  document.querySelector("#quire-logo").addEventListener("click", (e) => quireLogoEventHandler(e, editor));
}
