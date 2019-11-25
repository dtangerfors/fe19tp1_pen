let qlEditorToolbar, qlEditor, qlEditorInner, qlEditorMenubar;

window.addEventListener('DOMContentLoaded', () => {
    qlEditorToolbar = document.querySelector(".ql-toolbar");
    qlEditor = document.querySelector(".ql-container");
    qlEditorInner = document.querySelector(".ql-editor");
    qlEditorMenubar = document.querySelector(".editor-section__menu");

});


export function hideEditorOptions() {

    if (JSON.parse(localStorage.getItem("edit-id")) !== "0") {
        qlEditorToolbar.classList.add("ql-toolbar--hidden")
        qlEditor.classList.add("ql-container--hidden")
        qlEditorInner.setAttribute("contenteditable", "false")
        qlEditorMenubar.classList.add("editor-section__menu--hidden")
        console.log("event listiner click fired")
    } else {
        qlEditorToolbar.classList.remove("ql-toolbar--hidden")
        qlEditor.classList.remove("ql-container--hidden")
        qlEditorInner.setAttribute("contenteditable", "true")
        qlEditorMenubar.classList.remove("editor-section__menu--hidden")
        console.log("else statement fired")
    }
}

export function showEditorOptions() {

    qlEditorToolbar.classList.remove("ql-toolbar--hidden")
    qlEditor.classList.remove("ql-container--hidden")
    qlEditorInner.setAttribute("contenteditable", "true")
    qlEditorMenubar.classList.remove("editor-section__menu--hidden")

    console.log("showEditorOptions fired")
}