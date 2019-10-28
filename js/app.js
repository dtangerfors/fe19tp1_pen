var options = {
  modules: {
    toolbar: '#toolbar'
  },
  placeholder: 'Compose an epic...',
  readOnly: false,
  theme: 'snow'
};

document.addEventListener('')

const editor = new Quill('#editor-code', options);
let item = localStorage.getItem('abc');
editor.setContents(JSON.parse(item));