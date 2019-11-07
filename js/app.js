/*
  Import modules
*/
import Note from './modules/notes/note.js';
import {
  addNote,
  removeBasedOnIndex,
  removeFirstFoundBasedOnTitle,
  getNote
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
if (!localStorage.getItem("window-edit")) {
  localStorage.setItem("window-edit", "[]");
}
if (!localStorage.getItem("save-notes")) {
  localStorage.setItem("save-notes", "[]");
}
if (!localStorage.getItem("edit-id")) {
  localStorage.setItem("edit-id", "0");
}
if (!localStorage.getItem("user-settings")) {
  localStorage.setItem("user-settings", JSON.stringify(userSettings));
}

/**
 * HTML Element that keeps our notes
 */
const elementNoteList = document.getElementById("note-list");

/**
 * Event handler for mouse click to remove a Note
 * @param {MouseEvent} event
 */
function RemoveNoteEventHandler(event) {
  const noteIdToRemove = event.target.getAttribute("delete-value");
  const savedNotes = JSON.parse(localStorage.getItem("save-notes"));
  const indexToRemove = savedNotes.findIndex(data => data.id === Number(noteIdToRemove));

  //Remove the Note from our JSON object and from the DOM 
  savedNotes.splice(indexToRemove, 1);
  event.target.parentNode.remove();

  //Save our new content
  storeContent(savedNotes);
}

/**
 * 
 * @param {Array} value 
 */
function saveEditText(value) {
  localStorage.setItem("window-edit", JSON.stringify(value));
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
  const editText = JSON.parse(localStorage.getItem("save-notes"));
  let noteIdToEdit = event.target.getAttribute("edit-value");
  let windowContent;

  editText.forEach((note) => {
    if (note.id === Number(noteIdToEdit)) {
      editor.setContents(note.content);
      windowContent = note.content;
    }
  });

  saveEditID(noteIdToEdit);
  saveEditText(windowContent);
  storeContent(editText);
}

function numberOfNotes() {
  return JSON.parse(localStorage.getItem("save-notes")).length + 1
}
function titleNumb() {
  if (!JSON.parse(localStorage.getItem("save-notes"))) {
    return 1;
  } else {
    return JSON.parse(localStorage.getItem("save-notes")).length+1;
  }
}
function lastDate(oldDate) {
  const nowDate= new Date();
  var seconds = nowDate.getSeconds();
  var minutes = nowDate.getMinutes();
  var hours = nowDate.getHours();
  var days = nowDate.getDay();
  var months= nowDate.getMonth();
  var years = nowDate.getFullYear();
  const newSeconds = seconds-oldDate[5];
  const newMinutes = minutes-oldDate[4];
  const newHours = hours - oldDate[3];
  const newDays = days - oldDate[2];
  const newMonths = months - oldDate[1];
  const newYears = years - oldDate[0];
  if (newYears>0) {
    console.log(newYears+" years");
  }
  else if (newMonths> 0) {
    console.log(newMonths + " months");
  }
  else if (newDays> 0) {
    console.log(newDays + " days");
  }
  else if (newHours> 0) {
    console.log(newHours + " hours");
  }
  else if (newMinutes> 0) {
    console.log(newMinutes + " minutes");
  }else if (newSeconds>0) {
    console.log(newSeconds + " seconds");
  }
}
function DateSaved(){
  const nowDate = new Date();
  const seconds = nowDate.getSeconds();
  const minutes = nowDate.getMinutes();
  const hours = nowDate.getHours();
  const days = nowDate.getDay();
  const months = nowDate.getMonth();
  const years = nowDate.getFullYear();
  const date=[years,months,days,hours,minutes,seconds]
  return date;
}

function loadItems(attributeID,title) {
  var removeBtn = document.createElement("button");
  var editBtn = document.createElement("button");
  const h1 = document.createElement("h1");
  h1.innerText = "title" + title; //text that tells which to delete or edit 
  removeBtn.innerHTML = "delete";
  editBtn.innerHTML = "edit";
  var attributeRemoveID = document.createAttribute("delete-value");
  var attributeEditID = document.createAttribute("edit-value");
  attributeRemoveID.value = attributeID;
  attributeEditID.value = attributeID;
  const listDiv = document.createElement("div");
  console.log(attributeRemoveID)
  removeBtn.setAttributeNode(attributeRemoveID);
  editBtn.setAttributeNode(attributeEditID);
  listDiv.append(h1);
  navSideBut.append(listDiv);
  h1.parentNode.insertBefore(removeBtn, h1.nextSibling);
  removeBtn.parentNode.insertBefore(editBtn, removeBtn.nextSibling);
  removeBtn.onclick = RemoveItem;
  editBtn.onclick = EditItem;
}

function makeAndStoreContent() {
  const makeAndStoreContentLoad = JSON.parse(localStorage.getItem("save-notes"))
  var numbTitle = numberOfNotes();
  const loadID = Number(loadEditID());
  var numb = 0;
  for (let i = 0; i < makeAndStoreContentLoad.length; i++) {
    if (makeAndStoreContentLoad[i].id === loadID) {
      makeAndStoreContentLoad[i].content=editor.getContents();

      numb++;
    }
  }
  if (numb!==0) {
  }
  else{
    const saveItem = {
      content: editor.getContents(),
      id: Date.now()
    }
    newContentLoad.push(saveItem);
    loadItems(saveItem.id,numbTitle);
    
  }
  storeContent(newContentLoad);
}


document.getElementById("new-document").addEventListener("click", function () {

  localStorage.setItem("edit-id", JSON.stringify(0));
  var noID = JSON.parse(localStorage.getItem("edit-id"));
  clearContents();
});

function renderItems() {
  const renderList = JSON.parse(localStorage.getItem("save-notes"))
  var title = 0;
  for (let i = 0; i < renderList.length; i++) {
    title++;
    var idNumb = newList[i].id;
    loadItems(idNumb,title)
  }
}

function newDIV(valueTitle, idNumberValue) {

  const removeBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const attributeRemoveID = document.createAttribute("delete-value");
  const attributeEditID = document.createAttribute("edit-value");
  attributeRemoveID.value = idNumberValue;
  attributeEditID.value = idNumberValue;
  const title = document.createElement("title");
  title.innerText = "title" + valueTitle;
  removeBtn.innerHTML = "delete";
  editBtn.innerHTML = "edit";
  const listDiv = document.createElement("div");
  removeBtn.setAttributeNode(attributeRemoveID);
  editBtn.setAttributeNode(attributeEditID);
  listDiv.append(title);
  elementNoteList.insertBefore(listDiv, elementNoteList.firstChild);
  title.parentNode.insertBefore(removeBtn, title.nextSibling);
  removeBtn.parentNode.insertBefore(editBtn, removeBtn.nextSibling);
  removeBtn.onclick = RemoveNoteEventHandler;
  editBtn.onclick = editItem;
}

//save button
document.getElementById("save-btn").addEventListener("click", saveFunction);
/*document.getElementById("new-document").addEventListener("click",function () {
  localStorage.setItem("edit-id",JSON.stringify([]))
  makeAndStoreContent();
  clearContents();
})

function saveFunction() {
  makeAndStoreContent();
  clearContents();
}

document.getElementById("save-btn").addEventListener("click", saveFunction)

function editorLoad() {
  const loadFromStorage = JSON.parse(localStorage.getItem("window-edit"))
  editor.setContents(loadFromStorage);
}

function clearContents() {
  editor.setContents(); //clear all text;
  var clearWindow = [];
  saveEditText(clearWindow);

}

function storeContent(value) {
  localStorage.setItem("save-notes", JSON.stringify(value))
}

const navbarSlide = () => {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav__link-group');
  const navLinks = document.querySelectorAll('.nav__link-group li');

  burger.addEventListener('click', function() {
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
  navbarSlide();
  renderItems();
  editorLoad();
}

window.addEventListener("DOMContentLoaded", main);