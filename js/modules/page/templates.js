import {
  dateHowLongAgo,
  getTextFromContent
} from '../notes/note-list.js';

/**
 * Template when there are no notes to be loaded
 * @returns String
 */
export function noNotesTemplate() {
  return '<p class="no-notes">No notes, why not write your first note?</p>';
}

/**
 * Template for a note in the landing page
 * @param {Object} param0
 * @param {String} param0.title
 * @param {Object} param0.content
 * @param {Number} param0.lastChanged
 * @param {Number} param0.dateOfCreation
 * @returns String
 */
export function notesTemplate({title, content, lastChanged, dateOfCreation} = {}) {
  let preview = getTextFromContent(content.ops);
  if (preview.length > 350) {
      preview = preview.substring(0, 347) + "..."
  }
  return `
      <div class="notes" note-id="${dateOfCreation}">
          <h3 class="heading-tertiary notes__title" note-id="${dateOfCreation}">${title}</h3>
          <p class="notes__lastChanged" note-id="${dateOfCreation}">${dateHowLongAgo(dateOfCreation, lastChanged)}</p>
          <p class="notes__content" note-id="${dateOfCreation}">${preview}</p>
      </div>
  `
}

/**
 * Template for a note in the sidebar
 * @param {Object} param0
 * @param {String} param0.title
 * @param {Object} param0.content
 * @param {Number} param0.lastChanged
 * @param {Number} param0.dateOfCreation
 * @param {Boolean} param0.isFavorite
 * @returns String
 */
export function listNoteTemplate({title, content, lastChanged, dateOfCreation, isFavorite} = {}) {
  let preview = getTextFromContent(content.ops);
  const imgSource = isFavorite ? './assets/icons/star-filled.svg' : './assets/icons/star-outlined.svg';
  if (preview.length > 50) {
      preview = preview.substring(0, 49) + "..."
  }
  return `
      <div class="note-container">
          <div class="note-container__inner note-class_${dateOfCreation}" note-id="${dateOfCreation}">
              <div class="note-container__text-content">
                  <h3 class="heading-tertiary notes__title" note-id="${dateOfCreation}">${title}</h3>
                  <p class="paragraph-date" note-id="${dateOfCreation}">${dateHowLongAgo(dateOfCreation, lastChanged)}</p>
                  <p class="paragraph" note-id="${dateOfCreation}">${preview}</p>
              </div>
          <div class="note-container__drag-indicator">
              <img src="assets/icons/drag-indicator.svg" alt="open sidemenu">
          </div>
      </div>
      <div class="note-container__menu note-class_${dateOfCreation}">
          <div note-id="${dateOfCreation}" class="note-container__menu-item"><img src="${imgSource}" alt="favorite note" class="note-container__icon note-favorite"></div>
          <div note-id="${dateOfCreation}" class="note-container__menu-item"><img src="assets/icons/delete.svg" alt="delete note" class="note-container__icon note-delete"></div>
      </div>
  </div>
  `
}
