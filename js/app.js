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
  theme: 'snow'
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

var loadVal=[];
function loadNew(){
  loadVal = localStorage.getItem("storage") ? JSON.parse(localStorage.getItem("storage")) : [];
}
function makeLi() {
  for (let i = 0; i < loadVal.length; i++) {
    console.log(i);
    navSideBut.insertAdjacentHTML("beforeend", `<div><h1>text</h1><button class="delete-btn">X</button>
  <button class="edit-btn">Edit</button></div>`)
  }
  //delete1
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

//save knappen
document.getElementById("save-btn").addEventListener("click",saveFunction);
var edidtorText = editor.getContents();

function saveFunction(){
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
  localStorage.setItem("storage", JSON.stringify(loadVal));
}

window.addEventListener("DOMContentLoaded",function () {
  loadNew();
  makeLi();
});


function saveDocument() {
  const content = JSON.stringify(editor.getContents());
  localStorage.setItem('notes', content);
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
