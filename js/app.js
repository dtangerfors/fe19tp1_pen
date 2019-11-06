/**
 * Options to apply for Quill
 */
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean']
];

const options = {
  modules: {
    toolbar: toolbarOptions
  },
  readOnly: false,
  theme: 'snow'
};


/**
 * End user settings
 */
const settings = {
	autoSave: true,
	activeTheme: null
};

/**
 * Load settings from localstorage if it's saved.
 */
const localSettings = JSON.parse(localStorage.getItem("user-settings"));
if(localSettings) {	
	settings.autoSave = localSettings.autoSave;
	settings.activeTheme = localSettings.activeTheme;
}

/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', options);

/*
editor.on('text-change', function(delta, source) {
  if(auto_save) {
    //saveDocument();
  }
});
*/
/*
class Note{
  constructor(text){
    this.text = text;
    this.date= new Date().now;
  }
}
*/

/**
 * Save Button Element

const save_btn = document.getElementById('save-btn');
save_btn.addEventListener('click', (event) => {
  //saveDocument();
});
 */
/**
 * Localstorage content example
 */
/*
const content = localStorage.getItem('notes');
if(content) {
  editor.setContents(JSON.parse(content));
}
*/
var navSideBut = document.getElementById("note-list"); //set items
function RemoveItem(e) {
  //Remove button function
  let clickIDRemove = e.target.getAttribute("delete-value");
  const loadDeleteList = JSON.parse(localStorage.getItem("save-notes"));
  console.log(Number(clickIDRemove));
  var val = loadDeleteList.findIndex(function (data, index) { return data.id === Number(clickIDRemove) })//get index to remover
  console.log(val);
  loadDeleteList.splice(val, 1);
  console.log(loadDeleteList)
  storeContent(loadDeleteList); //deleted from localstorage
  e.target.parentNode.remove(); //delete from div
  
}
function saveEditText(value) {
  localStorage.setItem("window-edit",JSON.stringify(value));
}
function saveEditID(idValue) {
  localStorage.setItem("edit-id",JSON.stringify(idValue))
}
function loadEditID() {
  const idValue = JSON.parse(localStorage.getItem("edit-id"));
  if (idValue==null) {
    return [];
  } else{
    return idValue;
  }
}

function EditItem(e){
  let clickIDEdit = e.target.getAttribute("edit-value");
  var windowContent;
 var editText = JSON.parse(localStorage.getItem("save-notes"));
  console.log(Number(clickIDEdit));
  for (let i = 0; i <editText.length; i++){
    if (editText[i].id === Number(clickIDEdit)) {
      editor.setContents(editText[i].content);
      windowContent= editText[i].content;
     // e.target.parentNode.remove();
     // editText.splice(i,1);
    }
  }
  saveEditID(clickIDEdit)
  saveEditText(windowContent);
  storeContent(editText);
}
function newContent(value) {
  if (value ===null) {
    return []
  }else{
    return value;
  }

}
function titleNumb() {
  return JSON.parse(localStorage.getItem("save-notes")).length+1
}
function makeAndStoreContent() {
  const makeAndStoreContentLoad = JSON.parse(localStorage.getItem("save-notes"))
  var newContentLoad = newContent(makeAndStoreContentLoad);
  var numbTitle = titleNumb();
  const loadID = Number(loadEditID());
  var numb = 0;
  for (let i = 0; i < newContentLoad.length; i++) {
    if (newContentLoad[i].id === loadID) {
      console.log(newContentLoad[i].id + " " + loadID) 
      newContentLoad[i].content=editor.getContents();

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
    
    var removeBtn = document.createElement("button");
    var editBtn = document.createElement("button");
    const h1 = document.createElement("h1");
    h1.innerText = "title"+numbTitle; //text that tells which to delete or edit 
    removeBtn.innerHTML = "delete";
    editBtn.innerHTML = "edit";
    var attributeRemoveID = document.createAttribute("delete-value");
    var attributeEditID = document.createAttribute("edit-value");
    attributeRemoveID.value = saveItem.id;
    attributeEditID.value = saveItem.id;
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
  storeContent(newContentLoad);
  
}
window.addEventListener("DOMContentLoaded", function () {
  renderItems();
   editorLoad();
})
function renderItems(){
  const renderList = JSON.parse(localStorage.getItem("save-notes"))
  const newList  = newContent(renderList);
  var title = 0;
  for (let i = 0; i < newList.length; i++) {
    title++;
    var idNumb = newList[i].id;
    var removeBtn = document.createElement("button");
    var editBtn = document.createElement("button");
    var attributeRemoveID = document.createAttribute("delete-value");
    var attributeEditID = document.createAttribute("edit-value");
    attributeRemoveID.value=idNumb;
    attributeEditID.value=idNumb;
    const h1 = document.createElement("h1");
    h1.innerText = "title"+title;
    removeBtn.innerHTML = "delete";
    editBtn.innerHTML = "edit";
    var listDiv = document.createElement("div");
    removeBtn.setAttributeNode(attributeRemoveID);
    editBtn.setAttributeNode(attributeEditID);
    listDiv.append(h1);
    navSideBut.append(listDiv);
    h1.parentNode.insertBefore(removeBtn, h1.nextSibling);
    removeBtn.parentNode.insertBefore(editBtn, removeBtn.nextSibling);
    removeBtn.onclick = RemoveItem;
    editBtn.onclick = EditItem;
  }
}

//save button
document.getElementById("save-btn").addEventListener("click", saveFunction);


function saveFunction() {
  makeAndStoreContent();
  clearContents();
}

document.getElementById("save-btn").addEventListener("click",saveFunction)
function editorLoad() {
  const loadFromStorage = JSON.parse(localStorage.getItem("window-edit"))
      editor.setContents(loadFromStorage);
   
}
function clearContents() {
  editor.setContents(); //clear all text;
  var clearWindow =[];
  saveEditText(clearWindow);

}
function storeContent(value) {
  localStorage.setItem("save-notes", JSON.stringify(value))
}



// ------------- Navbar -------------
/**
 * Navbar slide functionality
 */
const navSlide = () => {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav__link-group');
  const navLinks = document.querySelectorAll('.nav__link-group li');
 
  burger.addEventListener('click', () => {
  //Toggle nav
  nav.classList.toggle('nav-active');
         
  //Animate Links
  navLinks.forEach((link, index) => {
      if (link.style.animation){
          link.style.animation = ''
      } else {
          link.style.animation = `navLinkFade 0.5s ease backwards ${index / 7 + 0.2}s`;
      }
  });
  //burger animation
  burger.classList.toggle('hamburger-toggle')
  });
}


navSlide();

// ------------- Navbar ends -------------

/**
 * Save Checkbox Element in the DOM
 */
const save_checkbox = document.querySelector("input[name=auto-save]");
save_checkbox.checked = settings.autoSave

save_checkbox.addEventListener( 'change', function() {
	settings.autoSave = this.checked;
	localStorage.setItem("user-settings", JSON.stringify(settings));
});

const settingsModal = document.getElementById("settings-modal");
const settingsButton = document.getElementById("settings");
const closeElement = document.querySelector(".close");

settingsButton.addEventListener('click', function() {
  settingsModal.style.display = "block";
});

closeElement.addEventListener('click', function() {
	settingsModal.style.display = "none";
});

window.onclick = function(event) {
  if (event.target == settingsModal) {
	settingsModal.style.display = "none";	
  }
};