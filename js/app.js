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

const settings = {
	autoSave: true,
	activeTheme: null
};

const localSettings = JSON.parse(localStorage.getItem("user-settings"));
if(localSettings) {	
	settings.autoSave = localSettings.autoSave;
	settings.activeTheme = localSettings.activeTheme;
}

/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', options);

// 
editor.on('text-change', function(delta, source) {
  if(settings.autoSave) {
	//   saveDocument();
  }
});

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
var navSideBut = document.getElementById("set-storage"); //set items
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
function makeAndStoreContent() {
  var makeAndStoreContentLoad = JSON.parse(localStorage.getItem("save-notes"));
  const saveItem = {
    content: editor.getContents(),
    id: Date.now()
  }
  makeAndStoreContentLoad.push(saveItem);
  storeContent(makeAndStoreContentLoad);
  var removeBtn = document.createElement("button");
  var editBtn = document.createElement("button");
  h1.innerText = saveItem.content.ops[0].insert; //text that tells which to delete or edit 
  removeBtn.innerHTML = "delete";
  editBtn.innerHTML = "edit";
  var attributeRemoveID = document.createAttribute("delete-value");
  var attributeEditID = document.createAttribute("edit-value");
  attributeRemoveID.value = saveItem.id;
  attributeEditID.value = saveItem.id;
  console.log(attributeRemoveID)
  removeBtn.setAttributeNode(attributeRemoveID);
  editBtn.setAttributeNode(attributeEditID);
  h1.parentNode.insertBefore(removeBtn, h1.nextSibling);
  removeBtn.parentNode.insertBefore(editBtn, removeBtn.nextSibling);
  removeBtn.onclick = RemoveItem;
  editBtn.onclick = EditItem;
}
window.addEventListener("DOMContentLoaded", function () {
  renderItems();
   editorLoad();
})
function renderItems(){
  const renderList = JSON.parse(localStorage.getItem("save-notes"))
  for (let i = 0; i < renderList.length; i++) {
    var idNumb= renderList[i].id;
    var removeBtn = document.createElement("button");
    var editBtn = document.createElement("button");
    var attributeRemoveID = document.createAttribute("delete-value");
    var attributeEditID = document.createAttribute("edit-value");
    attributeRemoveID.value=idNumb;
    attributeEditID.value=idNumb;
    const h1 = document.createElement("h1");
    h1.innerText = renderList[i].ops[0].insert;
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
//save knappen
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
var navSideBut = document.getElementById("note-list");

var loadVal=[];
function loadNew(){
  loadVal = localStorage.getItem("save-notes") ? JSON.parse(localStorage.getItem("save-notes")) : [];
}
function makeLi() {
  for (let i = 0; i < loadVal.length; i++) {
    console.log(i);
    navSideBut.insertAdjacentHTML("beforeend", `<div><h1>text</h1><button class="delete-btn">X</button>
  <button class="edit-btn">Edit</button></div>`)
  }
  //delete
  var deletebtns; 
  if (document.querySelectorAll(".delete-btn").length !== 0) {
    deletebtns = document.querySelectorAll(".delete-btn"); //Alla Delete knappar 
    for (let i = 0; i < deletebtns.length; i++) {
      deletebtns[i].addEventListener("click", function () {
        console.log("delete me!!");
        loadVal.splice(i, 1);
        saveTextValue();
        deletebtns[i].parentNode.remove();

        console.log(i);
      })
    }
  }
  if (document.querySelectorAll(".edit-btn").length!==0) {
    var editBtn = document.querySelectorAll(".edit-btn");
    for (let j = 0; j < editBtn.length; j++) {
      editBtn[j].addEventListener("click", function () {
        //editor
        console.log("Edit" + loadVal[j]);
        editor.setContents(loadVal[j]);
      });
    }
  }
    
}

//save button
document.getElementById("save-btn").addEventListener("click",saveFunction);

function saveFunction(){
  var edidtorText = editor.getContents();
  titleOfText="text";
  loadVal.push(edidtorText);
  console.log(loadVal);

  navSideBut.insertAdjacentHTML("beforeend", `<div><h1>${titleOfText}</h1><button class="delete-btn">X</button><button class="edit-btn">Edit</button></div>`);
  saveTextValue();
  //Delete 
  if (document.querySelectorAll(".edit-btn")!==0){
    var editBtn = document.querySelectorAll(".edit-btn");
    for (let j = 0; j < editBtn.length; j++) {
      //editor
      editBtn[j].addEventListener("click", function () {
        console.log("Edit"+j);
        editor.setContents(loadVal[j])
      });
    }
  }
  if (document.querySelectorAll(".delete-btn").length !== 0) {
    var deletebtns = document.querySelectorAll(".delete-btn")
    for (let i = 0; i < deletebtns.length; i++) {
      deletebtns[i].addEventListener("click", function () {
        console.log("delete me!!");
        loadVal.splice(i, 1);
        saveTextValue();
        deletebtns[i].parentNode.remove();
      });
    }
  }
}

function saveTextValue(){
  localStorage.setItem("save-notes", JSON.stringify(loadVal));
}

window.addEventListener("DOMContentLoaded",function () {
  loadNew();
  makeLi();
});


// Navbar
const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
 
  burger.addEventListener('click',()=>{
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
  burger.classList.toggle('burgertoggle')
  });
}


navSlide();

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