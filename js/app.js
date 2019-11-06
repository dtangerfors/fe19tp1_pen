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
  options
} from './modules/settings/quill-settings.js';
import {
  settings as userSettings,
  saveUserSettings
} from './modules/settings/user-settings.js';

/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', options);

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

const test = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit sunt dolor ut tempore autem incidunt earum nulla accusamus. Voluptatem nulla architecto eligendi deleniti voluptas, dolore vero assumenda dolores vitae porro consectetur reprehenderit accusamus nam? Optio repellat consectetur, sed dolorem labore odit tempore odio? Temporibus officiis rerum repudiandae, exercitationem quos vel ipsum nemo, in perferendis omnis, maiores libero commodi! Amet, delectus ad tempora voluptas tempore incidunt deserunt earum ea libero quis possimus et sapiente qui exercitationem, explicabo, praesentium laboriosam repellat quam quasi dignissimos? Labore facere, a iusto quia at quisquam impedit et qui possimus, aliquid obcaecati omnis ratione ullam hic voluptatem praesentium amet perspiciatis reprehenderit libero illo, quis nobis doloremque! Repellendus, totam fugit provident quod laudantium sunt odit laboriosam ad soluta unde illum porro illo officiis, dolore eligendi facilis, repudiandae voluptatum excepturi consequuntur deleniti tenetur dolores aliquid obcaecati aut. Et officiis nobis possimus tempore eligendi praesentium quas quibusdam, earum fugiat sed quidem aspernatur sapiente fugit explicabo maiores ipsum labore eum? Laudantium est possimus, quos deserunt autem voluptatibus commodi rerum inventore ipsam corporis maxime consectetur in cum rem culpa libero. Vel deleniti excepturi accusamus tenetur mollitia temporibus nobis delectus necessitatibus quis nam vero ipsum voluptates veniam quibusdam nisi, itaque ex molestias! Iure neque obcaecati non aliquam rerum atque, aliquid exercitationem qui architecto corrupti porro temporibus consequatur distinctio iste laboriosam laborum dignissimos? Quisquam consectetur, dolore eum quaerat corrupti cumque deleniti laborum impedit modi similique tenetur esse itaque possimus enim ad consequuntur repellat debitis porro laboriosam! Voluptas, omnis odio deleniti cumque laudantium nam dolorem mollitia quod facilis amet quisquam illum fugiat dolores accusantium! Doloremque quae eligendi hic? Doloribus suscipit ducimus nihil, recusandae dolore ratione cum sunt excepturi totam libero soluta veniam assumenda. Culpa incidunt nobis dolor cupiditate corporis molestias ipsum, alias inventore quo vel suscipit sapiente voluptatem, maxime doloribus molestiae quibusdam maiores blanditiis harum ad mollitia illo eum! Neque consequatur, porro possimus dolore est nobis enim? Ducimus, illum itaque? Accusamus accusantium ducimus, in quaerat veniam placeat architecto, ipsum suscipit atque et error voluptate quod, adipisci laudantium. Eos qui quo, esse voluptatem perspiciatis perferendis, iste cumque ipsa obcaecati sapiente repellendus accusantium delectus natus non neque animi sint? Tempore velit quaerat vero obcaecati et distinctio debitis perferendis, ad a vitae odio quas omnis pariatur repellat, amet consectetur doloribus voluptates laboriosam magni rem. Quisquam perspiciatis neque ut libero praesentium consequatur est esse explicabo ea ipsam nulla fugiat, nobis eveniet commodi, quos cum totam facilis natus iusto aperiam.";

function addNewNoteToDOMList(note) {
  const newNote = document.createElement('li');
  const noteTitle = document.createElement('h3');
  const description = document.createElement('p');
  noteTitle.innerHTML = note.title;
  description.innerHTML = test.substr(0,35) + "...";
  newNote.appendChild(noteTitle);
  newNote.appendChild(description);

  newNote.addEventListener('click', () => {
    editor.setContents(note.content);
  });

  document.querySelector('.note-list').appendChild(newNote);
}

for (let index = 0; index < 50; index++) {
  addNewNoteToDOMList(new Note("Untitled Document", {"ops":[{"insert":"Hello WOrld!\n"}]}));
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

function lengthOfNotes() {
  return JSON.parse(localStorage.getItem("save-notes")).length + 1
}

function makeAndStoreContent() {
  const savedNotes = JSON.parse(localStorage.getItem("save-notes"));
  const indexToStoreAt = savedNotes.findIndex(note => note.id === loadEditID());

  if (indexToStoreAt != -1) {
    savedNotes[indexToStoreAt].content = editor.getContents();
    const saveItem = {
      content: editor.getContents(),
      id: Date.now()
    };
    newDIV(lengthOfNotes(), saveItem.id);
    savedNotes.push(saveItem);
    storeContent(savedNotes);
  }
}

document.getElementById("new-document").addEventListener("click", function () {

  // localStorage.setItem("edit-id", JSON.stringify(0));
  // var noID = JSON.parse(localStorage.getItem("edit-id"));
  // clearContents();
});


let shown = false;
document.getElementById('open-notes').addEventListener('click', function() {
  const notesList = document.querySelector('.note-list');
  notesList.classList.toggle('flex');

  if(shown) {
    notesList.classList.toggle('slide-in');
    notesList.classList.toggle('slide-out');
  } else {
    notesList.classList.toggle('slide-in');
    notesList.classList.toggle('slide-out');
    shown = true;
  }


});

function renderItems() {
  const renderList = JSON.parse(localStorage.getItem("save-notes"))
  var title = 0;
  for (let i = 0; i < renderList.length; i++) {
    title++;
    var idNumb = renderList[i].id;
    newDIV(title, idNumb);
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
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

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


window.addEventListener("DOMContentLoaded", function () {
  main();
});