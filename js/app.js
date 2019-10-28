/**
 * Options to apply for Quill
 */
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean']
];
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