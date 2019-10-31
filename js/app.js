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


editor.on('text-change', function(delta, source) {
  if(auto_save) {
    saveDocument();
  }
});

/**
 * Save Button Element
 */
const save_btn = document.getElementById('save-btn');
save_btn.addEventListener('click', (event) => {
  saveDocument();
});

/**
 * Localstorage content example
 */
const content = localStorage.getItem('notes');
if(content) {
  editor.setContents(JSON.parse(content));
}


var navSideBut = document.getElementById("set-storage");

//var loadItems = JSON.parse(localStorage.getItem("storage")); 
/*
*/
var loadVal=[];
function loadNew(){
  loadVal = localStorage.getItem("storage") ? JSON.parse(localStorage.getItem("storage")) : [];
}
function makeLi() {
  for (let i = 0; i < loadVal.length; i++) {
    console.log(i);
    navSideBut.insertAdjacentHTML("beforeend", `<div><h1>${loadVal[i].title}</h1><button class="delete-btn">X</button>
  <button class="edit">Edit</button></div>`)
  }
  //delete1
  var deletebtns;
  if (document.querySelectorAll(".delete-btn").length !== 0) {
    deletebtns = document.querySelectorAll(".delete-btn")
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
}


var titleOfText;
var examlpeStore = [];
var saveText = [];
var saveTags = [];
//save knappen
document.getElementById("save-btn").addEventListener("click",saveFunction);
var ggt = document.querySelector(".ql-editor");
function saveFunction(){
  loadVal;
 
  var arr = [];
  var titleOfText;
  var saveText=[];
  var saveTags=[];
  for (let index = 0; index < ggt.children.length; index++) {
    arr.push(ggt.children[index].textContent);
    saveTags.push(ggt.children[index].tagName);
    saveText.push(ggt.children[index].textContent)
  }
  if (arr.some(IfsomeHaveText)=== false) {
    return console.log("no text");
    
  }
    loadVal.push({ title: titleOfText, text: saveText, tags: saveTags })
  navSideBut.insertAdjacentHTML("beforeend", `<div><h1>${loadVal[loadVal.length-1].title}</h1><button class="delete-btn">X</button>
  <button class="edit">Edit</button></div>`);
  saveTextValue();
  //Delete 
  var deletebtns;
  if (document.querySelectorAll(".delete-btn").length !== 0) {
    deletebtns = document.querySelectorAll(".delete-btn")
    for (let i = 0; i < deletebtns.length; i++) {
      deletebtns[i].addEventListener("click", function () {
        console.log("delete me!!");
        loadVal.splice(i, 1);
        saveTextValue();
        deletebtns[i].parentNode.remove();

      })
    }
  }
}


function saveTextValue(){
  localStorage.setItem("storage", JSON.stringify(loadVal));
}

window.addEventListener("DOMContentLoaded",function () {
  loadNew();
  makeLi();
})


function IfsomeHaveText(params) {
  return params != "";
}

function saveDocument() {
  const content = JSON.stringify(editor.getContents());
  localStorage.setItem('notes', content);
}
