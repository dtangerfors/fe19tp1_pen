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
  if (!localStorage.getItem("save-notes")) {
    localStorage.setItem("save-notes", "[]");
  } else {
    setPredefinedNotes(JSON.parse(localStorage.getItem("save-notes")));
  }
  if (!localStorage.getItem("edit-id")) {
    localStorage.setItem("edit-id", "0");
  }
  if (!localStorage.getItem("user-settings")) {
    localStorage.setItem("user-settings", JSON.stringify(userSettings));
  }
}


/**
 * HTML Element that keeps our notes
 */
const elementNoteList = document.getElementById("note-list");

/**
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 */
 function removeNoteEventHandler(event) {
  const noteIdToRemove = event.target.getAttribute('data-note-id');
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
  localStorage.setItem("edit-id", JSON.stringify(id))
}

/**
 * 
 */
function loadEditID() {
  const id = JSON.parse(localStorage.getItem("edit-id"));
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

function loadItems(note) {
  //Creating div for a note list
  const divNoteList = document.createElement("div");

  //Create necessary buttons for a note
  const buttonRemove = document.createElement("button"),
        buttonEdit = document.createElement("button"),
        buttonFavorite = document.createElement("button");

  //Create title for a note
  const header3Title = document.createElement("h3");

  //Setting visual text for every created element
  buttonRemove.innerHTML = "Delete";
  buttonEdit.innerHTML = "Edit";
  buttonFavorite.innerHTML = note.isFavorite ? 'Unfavorite' : 'Favorite';
  header3Title.innerHTML = note.title;

  //Setting attribute for each button
  header3Title.setAttribute("data-note-id", note.dateOfCreation);
  buttonRemove.setAttribute("data-note-id", note.dateOfCreation);
  buttonEdit.setAttribute("data-note-id", note.dateOfCreation);
  buttonFavorite.setAttribute("data-note-id", note.dateOfCreation);

  divNoteList.append(header3Title);
  elementNoteList.append(divNoteList);

  header3Title.parentNode.insertBefore(buttonRemove, header3Title.nextSibling);
  buttonRemove.parentNode.insertBefore(buttonEdit, buttonRemove.nextSibling);
  buttonEdit.parentNode.insertBefore(buttonFavorite, buttonEdit.nextSibling);

  buttonRemove.onclick = removeNoteEventHandler;
  buttonEdit.onclick = editNoteEventHandler;
  buttonFavorite.onclick = setFavoriteNoteEventHandler;
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
      const h3TitleElement = document.querySelector(`h3[data-note-id="${loadID}"]`);
      h3TitleElement.innerHTML = note.title;
    }
  });

  if (counter === 0) {
    const newNote = new Note({
      title: document.getElementById("editorTitle").value,
      content: editor.getContents()
    });
    addNote(newNote);
    loadItems(newNote);
  }
  storeContent();
}

function setFavoriteNoteEventHandler(event) {
  const favoriteNote = event.target.getAttribute('data-note-id');
  const index = getAllNotes().findIndex(note => note.dateOfCreation === Number(favoriteNote));
  const note = getNote(index);
  const isFavorited = note.setFavorite();
  this.innerHTML = isFavorited ? 'Unfavorite' : 'Favorite';
  storeContent();
}

document.getElementById("new-document").addEventListener("click", function () {

  localStorage.setItem("edit-id", JSON.stringify(0));
  clearContents();
  document.getElementById('editorTitle').value = '';
});



function renderItems() {
  getAllNotes().forEach(note => loadItems(note));
}

//save button
document.getElementById("save-btn").addEventListener("click", saveFunction);

function saveFunction() {
  makeAndStoreContent();
}

document.getElementById("save-btn").addEventListener("click", saveFunction)

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
  localStorage.setItem("save-notes", JSON.stringify(getAllNotes()))
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

function main() {
  initializeLocalStorage();
  navbarSlide();
  renderItems();
  editorLoad();
}

window.addEventListener("DOMContentLoaded", main);

/**
 * Print button
 */
document.getElementById('printerButton').addEventListener('click', function() {
  window.print();
});
