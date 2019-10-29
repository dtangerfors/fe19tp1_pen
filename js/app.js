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
 * Localstorage content
 */
const content = localStorage.getItem('notes');
if(content) {
  editor.setContents(JSON.parse(content));
}

function saveDocument() {
  const content = JSON.stringify(editor.getContents());
  localStorage.setItem('notes', content);
}