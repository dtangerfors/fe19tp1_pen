/*
  Import modules
*/
import Note from './modules/notes/note.js';
import {
  addNote,
  removeBasedOnIndex,
  removeFirstFoundBasedOnTitle,
  getNote,
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
  const noteIdToRemove = event.target.getAttribute("delete-value");
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
function editItem(event) {
  const allNotes = getAllNotes();
  let noteIdToEdit = event.target.getAttribute("edit-value");
  let index = allNotes.findIndex(data => {
    return data.dateOfCreation === Number(noteIdToEdit);
  });

  if (index !== -1) {
    editor.setContents(getNote(index).content);
  }
  saveEditID(noteIdToEdit);
  storeContent();
}

function numberOfNotes() {
  return JSON.parse(localStorage.getItem("save-notes")).length + 1
}

function loadItems(attributeID, title) {

  const removeBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const noteTitle = document.createElement("h3");

  const attributeRemoveID = document.createAttribute("delete-value");
  const attributeEditID = document.createAttribute("edit-value");
  const listDiv = document.createElement("div");

  //text that tells which to delete or edit 
  noteTitle.innerText = "title" + title;

  removeBtn.innerHTML = "delete";
  editBtn.innerHTML = "edit";

  attributeRemoveID.value = attributeID;
  attributeEditID.value = attributeID;
  removeBtn.setAttributeNode(attributeRemoveID);

  editBtn.setAttributeNode(attributeEditID);
  listDiv.append(noteTitle);
  elementNoteList.append(listDiv);

  noteTitle.parentNode.insertBefore(removeBtn, noteTitle.nextSibling);
  removeBtn.parentNode.insertBefore(editBtn, removeBtn.nextSibling);
  removeBtn.onclick = removeNoteEventHandler;

  editBtn.onclick = editItem;
}

function makeAndStoreContent() {
  const allNotes = getAllNotes();
  var numbTitle = numberOfNotes();
  const loadID = Number(loadEditID());
  var numb = 0;

  allNotes.forEach(function (note) {
    if (note.dateOfCreation === loadID) {
      note.content = editor.getContents();
      numb++;
    }
  });

  if (numb === 0) {
    const saveItem = new Note('Test Title', editor.getContents());
    addNote(saveItem)
    loadItems(saveItem.dateOfCreation, numbTitle);
  }
  storeContent();
}


document.getElementById("new-document").addEventListener("click", function () {

  localStorage.setItem("edit-id", JSON.stringify(0));
  var noID = JSON.parse(localStorage.getItem("edit-id"));
  clearContents();
});

function renderItems() {
  const renderList = getAllNotes()
  var title = 0;
  for (let i = 0; i < renderList.length; i++) {
    title++;
    var idNumb = renderList[i].dateOfCreation;
    loadItems(idNumb, title)
  }
}

//save button
document.getElementById("save-btn").addEventListener("click", saveFunction);

function saveFunction() {
  makeAndStoreContent();
  clearContents();
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
    this.classList.toggle('burgertoggle')
  });
};

function main() {
  initializeLocalStorage();
  navbarSlide();
  renderItems();
  editorLoad();
}

window.addEventListener("DOMContentLoaded", main);