let qlEditorToolbar, qlEditor, qlEditorInner, qlEditorMenubar, editButton;

//Loading the CSS selectors upon DOM loading
window.addEventListener('DOMContentLoaded', () => {
    qlEditorToolbar = document.querySelector(".ql-toolbar");
    qlEditor = document.querySelector(".ql-container");
    qlEditorInner = document.querySelector(".ql-editor");
    qlEditorMenubar = document.querySelector(".editor-section__menu");
    editButton = document.querySelector("#button-editNote");
});

/**
 * Upon calling, hides editor-related menu and displays the edit button
 */
export function hideEditorOptions() {

    if (JSON.parse(localStorage.getItem("edit-id")) !== "0") {
        qlEditorToolbar.classList.add("ql-toolbar--hidden")
        qlEditor.classList.add("ql-container--hidden")
        qlEditorInner.setAttribute("contenteditable", "false")
        qlEditorMenubar.classList.add("editor-section__menu--hidden")
        editButton.style.visibility = "visible";
        document.getElementById('editorTitle').readOnly = true;
    } else {
        showEditorOptions();
    }
}

/**
 * Upon calling, displays editor-related menu and hides the edit button
 */
export function showEditorOptions() {
    qlEditorToolbar.classList.remove("ql-toolbar--hidden")
    qlEditor.classList.remove("ql-container--hidden")
    qlEditorInner.setAttribute("contenteditable", "true")
    qlEditorMenubar.classList.remove("editor-section__menu--hidden")
    editButton.style.visibility = "hidden";
    document.getElementById('editorTitle').readOnly = false;
}