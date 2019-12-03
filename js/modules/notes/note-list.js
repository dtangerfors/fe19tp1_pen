import Note from './note.js';

/**
 * A list to store our notes in
 * @type Note[]
 */
const Notes = [];

/**
 * Add a note to the Notes list
 * @param {Note} note - accepts a Note object
 */
export function addNote(note) {
  //If the input note is not a Note object, we don't add it
  if (typeof note !== 'object') return;
  if (note.length) return;
  if (!note.title || !note.content) return;
  Notes.push(note);
}

/**
 * Remove a note from a given index
 * @param {number} index 
 */
export function removeBasedOnIndex(index) {
  if (Notes[index]) {
      Notes.splice(index, 1);
  }
}

/**
 * Retrieve a note based on a given index
 * @param {number} index
 * @returns Note
 */
export function getNote(index) {
  return Notes[index]
}

/**
 * Returns favorite notes
 * @returns Note[]
 */
export function getFavorites() {
  return getAllNotes().filter(v => v.isFavorite);
}

/**
 * Returns sorted note array by newest
 * @returns Note[]
 */
export function getNotesFromNewestToOldest(notes = getAllNotes()) {
  return notes.sort((noteA, noteB) => noteB.lastChanged - noteA.lastChanged);
}

/**
 * Returns sorted note array by oldest
 * @returns Note[]
 */
export function getNotesFromOldestToNewest(notes = getAllNotes()) {
  return notes.sort((noteA, noteB) => noteA.lastChanged - noteB.lastChanged);
}

/**
 * Returns preview text from a note
 * @param {Note} note
 * @param {number} from
 * @param {number} to
 * @returns String
 */
export function getPreviewTextFromNote(note, from, to) {
  let previewText = getTextFromContent(note.content.ops).split('\n').join(' ').substr(from, to);
  if (previewText.length > to) {
    return `${previewText}...`;
  }
  return previewText;
}

/**
 * Retrieve all notes
 * @returns Note[]
 */
export function getAllNotes() {
  return Notes
}

/**
 * Setting predefined notes
 * @param {Note[]} notes 
 */
export function setPredefinedNotes(notes) {
  notes.forEach((note) => {
    Notes.push(new Note(note));
  });
}

/**
 * Translates date into a readable time format
 * @param {number} created
 * @param {number} edited
 * @returns String
 */
export function dateHowLongAgo(created, edited) {
  const timeNow = Date.now();
  const dateReturn = new Date(edited);
  const howOld = timeNow - edited;

  const secondsDecimal = howOld / 1000;
  const seconds = secondsDecimal.toFixed(0);

  const minutesDecimal = secondsDecimal / 60;
  const minutes = minutesDecimal.toFixed(0);

  const hoursDecimal = minutesDecimal / 60;
  const hours = hoursDecimal.toFixed(0);

  const daysDecimal = hoursDecimal / 24;
  const days = daysDecimal.toFixed(0);

  const monthsDecimal = daysDecimal / 30;
  const months = monthsDecimal.toFixed(0);

  const yearsDecimal = monthsDecimal / 12;
  const years = yearsDecimal.toFixed(0);

  const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let dateMsg;

  if (created === edited) {
    dateMsg = "Created "
  } else {
    dateMsg = "Last edited "
  }

  if (days > 0 || months > 0 || years < 0) {
    return dateMsg + monthsArr[dateReturn.getMonth()] + " " + dateReturn.getDate() + ", " + dateReturn.getFullYear()
  } else if (hours > 0) {
    if (hours == 1) {
      return dateMsg + "about " + hours + " hour ago";
    } else {
      return dateMsg + "about " + hours + " hours ago";
    }
  }
  else if (minutes > 0) {
    if (minutes == 1) {
      return dateMsg + minutes + " minute ago";
    } else {
      return dateMsg + minutes + " minutes ago";
    }
  } else {
    return dateMsg + seconds + " seconds ago";
  }
}

/**
 * Separate the text from Note content
 * @param {Object} content
 * @returns String 
 */
export function getTextFromContent(content) {
  let str = '';
  for (let v of content) {
    if (typeof v.insert === "string")
      str += v.insert;
  }
  return str;
}

/**
 * Search a given word in a text
 * @param {string} text
 * @param {string} word
 */
export function searchText(text, word) {
  let searchPreviewLength = 20;

  text = text.toLowerCase();
  word = word.toLowerCase().replace(/([()[{*+.$^\\|?])/g, '\\$1');

  const index = text.search(word);

  if (index !== -1) {
    let start = index - searchPreviewLength < 0 ? 0 : index - searchPreviewLength;
    let end = start === 0 ? index : searchPreviewLength;
    return { start, end, index };
  }
}