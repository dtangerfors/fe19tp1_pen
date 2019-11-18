export function showLandingPage() {
    let template = document.querySelector("#landing-page-template");
    let landingPage = template.content.cloneNode(true);

    document.querySelector("#main-page-content").appendChild(landingPage)
}

export function showEditor() {
    let template = document.querySelector("#editor-template");
    let editorContent = template.content.cloneNode(true);

    document.querySelector("#main-page-content").appendChild(editorContent)
}