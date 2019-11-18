import Note from './note.js';

/**
 * A list to store our notes in
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
 * Removes the first note it finds with a given title
 * @param {string} title 
 */
export function removeFirstFoundBasedOnTitle(title) {
    const index = Notes.findIndex(t => t === title);
    if (index !== -1) {
        removeBasedOnIndex(index);
    }
}

/**
 * Retrieve a note based on a given index
 * @param {number} index 
 */
export function getNote(index) {
    return Notes[index]
}

/**
 * Retrieve all notes
 */
export function getAllNotes() {
    return Notes
}

export function setPredefinedNotes(notes) {
    notes.forEach((note) => {
        Notes.push(new Note(note));
    });
}


export function dateHowLongAgo(milliseconds) {
    const timeNow = Date.now();
    const dateReturn = new Date(milliseconds);
    const howOld = timeNow - milliseconds;

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

    if (days > 0 || months > 0 || years < 0) {
        return monthsArr[dateReturn.getMonth()] + " " + dateReturn.getDate() + ", " + dateReturn.getFullYear()
    } else if (hours > 0) {
        if (hours == 1) {
            return hours + " hour ago";
        } else {
            return hours + " hours ago";
        }
    }
    else if (minutes > 0) {
        if (minutes == 1) {
            return minutes + " minute ago";
        } else {
            return minutes + " minutes ago";
        }
    } else {
        return seconds + " seconds ago";
    }
}
/**
 * Separate the text from content key
 */
export function getTextFromContent(content) {
    let str = '';
    for (let v of content) {
        if (typeof v.insert === "string")
            str += v.insert;
    }
    return str;
}