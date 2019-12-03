/**
 * @class Note
 * Skeleton structure for each defined note
 */
export default class Note {
  /**
   * Note constructor
   * @param {Object} param0
   * @param {String} param0.title
   * @param {Object} param0.content
   * @param {Number} param0.dateOfCreation
   * @param {Number} param0.lastChanged
   * @param {Boolean} param0.isFavorite
   */
  constructor({title, content, dateOfCreation, lastChanged, isFavorite} = {}) {
    this.title = title || 'Untitled'
    this.content = content || {};
    this.dateOfCreation = dateOfCreation || Date.now();
    this.lastChanged = lastChanged || this.dateOfCreation;
    this.isFavorite = isFavorite || false;
  }
  /**
   * Toggles a note as favorite
   * @returns Boolean
   */
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    return this.isFavorite;
  }
  /**
   * 
   * @param {Object|String} Object
   */
  setContent(content) {
    if(typeof content === 'string') {
      this.content = JSON.parse(content);
    }else if(typeof content === 'object') {
      this.content = content;
    }else {
      throw Error('The content must either be a string or an object');
    }
  }
}