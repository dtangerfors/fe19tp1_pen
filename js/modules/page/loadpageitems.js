import { 
  hideEditorOptions,
  showEditorOptions
} from '../notes/edit.js'

let editButton, editDocumentButton, landingPage, editorSection;
//Load necessary HTML elements on DOMContentLoaded 
window.addEventListener('DOMContentLoaded', () => {
  editButton = document.querySelector("#edit-opened-note-button");
  editDocumentButton = document.getElementById('button-editNote');
  landingPage = document.querySelector(".landing-page");
  editorSection = document.querySelector(".editor-section");
});

/**
 * Shows edit button
 * @param {Function} eventHandler 
 */
export function showEditButton(eventHandler) {
  // Display "edit last note"-button if edit id is not 0
  if (JSON.parse(localStorage.getItem("edit-id")) !== 0) {
    editButton.style.display = "flex"
    editButton.addEventListener("click", eventHandler);
  } else {
    editButton.style.display = "none"
    editDocumentButton.style.visibility = 'visible';
  }
}

/**
 * Add animation to slide landing page away. Add display none to landingpage section and finally show the editor
 * @param {Boolean} animateDelay
 */
export function showEditor(animateDelay = true) {
  landingPage.classList.add("slideDown")
  const fadeEditor = () => {
    landingPage.style.display = "none";
    landingPage.classList.remove("slideDown")
    editorSection.style.display = "flex"
    if (JSON.parse(localStorage.getItem("edit-id")) === 0) {
      editDocumentButton.style.visibility = 'hidden';
      showEditorOptions();
    } else {
      editDocumentButton.style.visibility = 'visible';
      hideEditorOptions();
    }
    editorSection.classList.add("fadeIn")
    setTimeout(function () { editorSection.classList.remove("fadeIn") }, 1000)
  }

  if (animateDelay) {
    setTimeout(function () {
      fadeEditor();
    }, 1000);
  } else {
    fadeEditor();
  }
}

/**
 * Show landing page
 * @param {Function} eventHandler 
 */
export function showLandingPage(eventHandler) {
  editorSection.classList.add("slideDown")
  setTimeout(function () {
    editorSection.style.display = "none";
    editorSection.classList.remove("slideDown")
    landingPage.style.display = "flex"
    landingPage.classList.add("fadeIn")
    setTimeout(function () { landingPage.classList.remove("fadeIn") }, 1000)
  }, 1000);
  showEditButton(eventHandler);
  document.querySelector("#landing-page__note-list").innerHTML = " ";
  document.querySelector("#sidebar-notes").classList.remove("sidebar-show")
  document.querySelector("#sidebar-settings").classList.remove("sidebar-show")
}
