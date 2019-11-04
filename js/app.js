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

let auto_save = false;

const options = {
  modules: {
    toolbar: toolbarOptions
  },
  readOnly: false,
  theme: 'snow',
  
};
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
var navSideBut = document.getElementById("set-storage"); //set items
function RemoveItem(e) {
  //Remove button function
  let clickIDRemove = e.target.getAttribute("delete-value");
  const loadDeleteList = JSON.parse(localStorage.getItem("save-notes"));
  console.log(Number(clickIDRemove));
  for (let i = 0; i < loadDeleteList.length; i++) {
    if(loadDeleteList[i].id===Number(clickIDRemove)){
      console.log(loadDeleteList[i].id+" must go")
      console.log(loadDeleteList[i].content.ops[0]);
      loadDeleteList.splice(i,1);
    }
  }
  console.log(loadDeleteList)
  storeContent(loadDeleteList); //deleted from localstorage
  e.target.parentNode.remove(); //delete from div
  
}
function saveEditText(value) {
  localStorage.setItem("window-edit",JSON.stringify(value));
}

function EditItem(e){
  let clickIDRemoveEdit = e.target.getAttribute("edit-value");
  var windowContent;
 var editText = JSON.parse(localStorage.getItem("save-notes"));
  console.log(Number(clickIDRemoveEdit));
  for (let i = 0; i <editText.length; i++){
    if (editText[i].id === Number(clickIDRemoveEdit)) {
      editor.setContents(editText[i].content);
      windowContent= editText[i].content;
      e.target.parentNode.remove();
      editText.splice(i,1);
    }
  }
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
  const h1 = document.createElement("h1");
  h1.innerText=saveItem.content.ops[0].insert; //text that tells which to delete or edit 
  removeBtn.innerHTML="delete";
  editBtn.innerHTML="edit";
  var attributeRemoveID = document.createAttribute("delete-value");
  var attributeEditID = document.createAttribute("edit-value");
  attributeRemoveID.value= saveItem.id;
  attributeEditID.value= saveItem.id;
  const listDiv = document.createElement("div"); 
  console.log(attributeRemoveID)
  removeBtn.setAttributeNode(attributeRemoveID);
  editBtn.setAttributeNode(attributeEditID);
  listDiv.append(h1);
  navSideBut.append(listDiv);
  h1.parentNode.insertBefore(removeBtn,h1.nextSibling);
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
    h1.innerText = renderList[i].content.ops[0].insert;
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
