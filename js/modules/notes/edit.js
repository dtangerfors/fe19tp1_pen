export function hideEditorOptions(event) {
    const qlEditorToolbar = document.querySelector(".ql-toolbar");
    const qlEditor = document.querySelector(".ql-container");
    const qlEditorInner = document.querySelector(".ql-editor");
    const qlEditorMenubar = document.querySelector(".editor-section__menu");

    const target = event.target

    console.log(target.nodeName)

    document.body.addEventListener("click", ()=> {
        if (JSON.parse(localStorage.getItem("edit-id")) !== 0) {
            qlEditorToolbar.classList.add("ql-toolbar--hidden")
            qlEditor.classList.add("ql-container--hidden")
            qlEditorInner.setAttribute("contenteditable", "false")
            qlEditorMenubar.classList.add("editor-section__menu--hidden")
        } else {
            qlEditorToolbar.classList.remove("ql-toolbar--hidden")
            qlEditor.classList.remove("ql-container--hidden")
            qlEditorInner.setAttribute("contenteditable", "true")
            qlEditorMenubar.classList.remove("editor-section__menu--hidden")
            console.log("else statement fired")
        }
    });
}

export function showEditorOptions() {
    const qlEditorToolbar = document.querySelector(".ql-toolbar");
    const qlEditor = document.querySelector(".ql-container");
    const qlEditorInner = document.querySelector(".ql-editor");
    const qlEditorMenubar = document.querySelector(".editor-section__menu");

    qlEditorToolbar.classList.remove("ql-toolbar--hidden")
    qlEditor.classList.remove("ql-container--hidden")
    qlEditorInner.setAttribute("contenteditable", "true")
    qlEditorMenubar.classList.remove("editor-section__menu--hidden")

    console.log("showEditorOptions fired")
}