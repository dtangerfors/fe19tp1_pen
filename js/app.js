/**
 * Options to apply for Quill
 */
const options = {
  modules: {
    toolbar: '#toolbar'
  },
  placeholder: 'Compose an epic...',
  readOnly: false,
  theme: 'snow'
};
/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', options);

/**
 * Save Button Element
 */
const save_btn = document.getElementById('save-btn');
save_btn.addEventListener('click', (event) => {
  const content = JSON.stringify(editor.getContents());
  localStorage.setItem('notes', content);
});

/**
 * Localstorage content
 */
const content = localStorage.getItem('notes');
if(content) {
  editor.setContents(JSON.parse(content));
}