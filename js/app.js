//Import modules
import { noteListSlide } from './modules/page/menu.js';
import { getAllNotes } from './modules/notes/note-list.js';
import { showEditorOptions } from './modules/notes/edit.js';
import { addEventListeners } from './modules/page/events.js';
import { displayListNotes } from './modules/page/loadnotes.js';
import { options as quillSettings } from './modules/settings/quill-settings.js';

import {
  showEditButton,
  showEditor
} from './modules/page/loadpageitems.js';

import {
  settings as userSettings,
  getCurrentState,
  STATES
} from './modules/settings/user-settings.js';

import {
  initializeLocalStorage,
  editorLoad,
  displayLatestNoteList,
  populateEditor,
  loadEditID,
  editOpenedNoteButton,
  makeAndStoreContent
} from './modules/function/functions.js';

/**
 * Quill Editor
 */
const editor = new Quill('#editor-code', quillSettings);

/**
 * Auto save component
 */
editor.on('text-change', (_1, _2, source) => {
  if (source === 'user') {
    if (userSettings.autoSave && +loadEditID() !== 0) {
      makeAndStoreContent(editor);
    }
  }
});

/**
 * The main function that loads all available components
 */
function main() {
  initializeLocalStorage();
  noteListSlide();
  editorLoad(editor);
  displayLatestNoteList();
  displayListNotes(getAllNotes());
  showEditButton(() => editOpenedNoteButton(editor));
  addEventListeners(editor);

  switch (getCurrentState()) {
    case STATES.LANDING_PAGE:
      break;
    case STATES.EDITOR:
      populateEditor(editor, loadEditID());
      showEditor(false);
      showEditorOptions();
      break;
  }
}

//Load main upon page load
window.addEventListener("load", main);