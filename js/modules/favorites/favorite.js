/**
 * Container to store favorite notes
 */
export class Favorite {
  /**
   * Accepts Notes as default parameter
   * @param {Note} note 
   */
  constructor(note) {
    this.favorite = [];
    this.favorite.push(note);
    this.flag = false;
  }

  /**
   * Returns favorites
   */
  getAllFavorites() {
    return this.favorite;
  }

  /**
   * @param {Note} note
   * Add note into favorite
   */
  addToFavorite(note) {
    this.favorite.push(note);
  }

  /**
   * Remove item from array
   * @param {Number} index
   */
  removeFromFavorite(index) {
    this.favorite.splice(index, 1);
  }
}
