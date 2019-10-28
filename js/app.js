/**
 * Options to apply for Quill
 */
const options = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ]
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