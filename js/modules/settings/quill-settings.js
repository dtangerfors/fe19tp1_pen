const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['clean']
];

/**
 * Options to apply for Quill
 */
export const options = {
    modules: {
        toolbar: toolbarOptions
    },
    readOnly: false,
    theme: 'snow'
};