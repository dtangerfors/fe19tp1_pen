/*
  Import modules
*/
import Note from './modules/notes/note.js';
import {
  addNote,
  removeBasedOnIndex,
  removeFirstFoundBasedOnTitle,
  getNote,
  getFavorites,
  getAllNotes,
  setPredefinedNotes
} from './modules/notes/note-list.js';
import {
  options as quillSettings
} from './modules/settings/quill-settings.js';
import {
  settings as userSettings,
  saveUserSettings
} from './modules/settings/user-settings.js';

/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', quillSettings);

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
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 */
 function removeNoteEventHandler(event) {
  const noteIdToRemove = event.target.parentNode.getAttribute('data-note-id');
  const indexToRemove = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteIdToRemove));

  removeBasedOnIndex(indexToRemove);
  event.target.parentNode.remove();

  //Save our new content
  storeContent();
}

/**
 * 
 * @param {number} id 
 */
function saveEditID(id) {
  localStorage.setItem('edit-id', JSON.stringify(id))
}

/**
 * 
 */
function loadEditID() {
  const id = JSON.parse(localStorage.getItem('edit-id'));
  if (!id) {
    return 0;
  }
  return parseInt(id);
}

/**
 * 
 * @param {MouseEvent} event 
 */
function editNoteEventHandler(event) {
  const noteIdToEdit = event.target.getAttribute('data-note-id');
  const index = getAllNotes().findIndex(data => data.dateOfCreation === Number(noteIdToEdit));
  
  if (index !== -1) {
    const note = getNote(index);
    const editorTitle = document.getElementById('editorTitle');
    editor.setContents(note.content);
    editorTitle.value = note.title;
  }
  saveEditID(noteIdToEdit);
  storeContent();
}

function getTextFromContent(content) {
  let str = '';
  for(let v of content) {
    str += v.insert;
  }
  return str;
}

function getPreviewTextFromNote(note, from, to) {
  return `${getTextFromContent(note.content.ops).split('\n').join(' ').substr(from, to)}...`;
}

function loadItems(note) {
  /**
   * HTML Element that keeps our notes
   */
  const elementNoteList = document.querySelector('.aside__note-list');
  
  //Creating div for a note list
  const noteList = document.createElement('li');

  //Create necessary buttons for a note
  const buttonRemove = document.createElement('button'),
        buttonFavorite = document.createElement('button');
  
  const buttonGroup = document.createElement('button');
  buttonGroup.innerHTML = '&#8942;';
  buttonGroup.setAttribute('class', 'note-button-group');

  const previewText = document.createElement('p');
  //Create title for a note
  const header2Title = document.createElement('h2');

  //Setting visual text for every created element
  buttonRemove.innerHTML = 'Delete';
  buttonFavorite.innerHTML = note.isFavorite ? 'Unfavorite' : 'Favorite';
  header2Title.innerHTML = note.title;

  previewText.innerHTML = getPreviewTextFromNote(note, 0, 50);

  //Setting attribute for each button
  noteList.setAttribute('data-note-id', note.dateOfCreation);
  header2Title.setAttribute('data-note-id', note.dateOfCreation);
  previewText.setAttribute('data-note-id', note.dateOfCreation);

  buttonRemove.onclick = removeNoteEventHandler;
  noteList.onclick = editNoteEventHandler;
  buttonFavorite.onclick = setFavoriteNoteEventHandler;

  noteList.append(header2Title);
  noteList.append(previewText);
//  noteList.append(buttonRemove);
//  noteList.append(buttonFavorite);
  noteList.append(buttonGroup);
  elementNoteList.append(noteList);
}

function makeAndStoreContent() {
  const allNotes = getAllNotes();
  const loadID = Number(loadEditID());
  let counter = 0;

  allNotes.forEach(function (note) {
    if (note.dateOfCreation === loadID) {
      note.content = editor.getContents();
      counter++;
      note.title = document.getElementById('editorTitle').value;
      const h2TitleElement = document.querySelector(`h2[data-note-id='${loadID}']`);
      const previewTextElement = document.querySelector(`p[data-note-id='${loadID}']`);
      h2TitleElement.innerHTML = note.title;
      previewTextElement.innerHTML = getPreviewTextFromNote(note, 0, 50);
    }
  });

  if (counter === 0) {
    const newNote = new Note({
      title: document.getElementById('editorTitle').value,
      content: editor.getContents()
    });
    addNote(newNote);
    loadItems(newNote);
  }
  storeContent();
}

function setFavoriteNoteEventHandler(event) {
  const favoriteNote = event.target.parentNode.getAttribute('data-note-id');
  const index = getAllNotes().findIndex(note => note.dateOfCreation === Number(favoriteNote));
  const note = getNote(index);
  const isFavorited = note.setFavorite();
  this.innerHTML = isFavorited ? 'Unfavorite' : 'Favorite';
  storeContent();
}

document.getElementById('new-document').addEventListener('click', function () {

  localStorage.setItem('edit-id', JSON.stringify(0));
  clearContents();
  document.getElementById('editorTitle').value = '';
});

function clearAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function renderItems(notes = getAllNotes()) {
  clearAllChildren(document.querySelector('.aside__note-list'));
  notes.forEach(note => loadItems(note));
}

//save button
document.getElementById('save-btn').addEventListener('click', saveFunction);

function saveFunction() {
  makeAndStoreContent();
}

document.getElementById('save-btn').addEventListener('click', saveFunction)

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
  localStorage.setItem('save-notes', JSON.stringify(getAllNotes()))
}

const navbarSlide = () => {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav__link-group');
  const navLinks = document.querySelectorAll('.nav__link-group li');

  burger.addEventListener('click', function () {
    //Toggle nav
    nav.classList.toggle('nav-active');

    //Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ''
      } else {
        link.style.animation = `navLinkFade 0.5s ease backwards ${index / 7 + 0.2}s`;
      }
    });
    //burger animation
    this.classList.toggle('hamburger-toggle')
  });
};

function noteListSlide() {
  const note = document.getElementById('nav-note');
  const noteList = document.querySelector('.sidebar');

  note.addEventListener('click', function() {
      noteList.classList.toggle('sidebar-show');
  });
}

function main() {
  initializeLocalStorage();
  navbarSlide();
  noteListSlide();
  renderItems();
  editorLoad();
}

/**
 * Print button
 */
document.getElementById('printerButton').addEventListener('click', function() {
  window.print();
});

window.addEventListener("DOMContentLoaded", main);