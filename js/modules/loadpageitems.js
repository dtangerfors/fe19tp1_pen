const buttonList = document.querySelector(".landing-page__button-list")

const editButton = document.querySelector("#edit-opened-note-button")

export function showEditButton(func) {
    // Display "edit last note"-button if edit id is not 0
    if (JSON.parse(localStorage.getItem("edit-id")) !== 0) {
        editButton.style.display = "flex"
        editButton.addEventListener("click", func)
    } else {
        editButton.style.display = "none"
    }
}

let landingPage = document.querySelector(".landing-page")

let editorSection = document.querySelector(".editor-section")

export function showEditor() {
    // Add animation to slide landing page away
    // Add display none to landingpage section
    // Show the editor 
    landingPage.classList.add("slideDown")
    setTimeout(function () {
        landingPage.style.display = "none";
        landingPage.classList.remove("slideDown")
        editorSection.style.display = "flex"
        editorSection.classList.add("fadeIn")
        setTimeout(function () { editorSection.classList.remove("fadeIn") }, 1000)
    }, 1000);
}

export function showLandingPage() {
    editorSection.classList.add("slideDown")
    setTimeout(function () {
        editorSection.style.display = "none";
        editorSection.classList.remove("slideDown")
        landingPage.style.display = "flex"
        landingPage.classList.add("fadeIn")
        setTimeout(function () { landingPage.classList.remove("fadeIn") }, 1000)
    }, 1000);
    showEditButton();
    document.querySelector("#landing-page__note-list").innerHTML = " ";
}
