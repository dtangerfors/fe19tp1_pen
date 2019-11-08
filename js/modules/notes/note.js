export default class Note {

    constructor({title, content, dateOfCreation, lastChanged, isFavorite} = {}) {
        this.title = title || 'Untitled'
        this.content = content || {};
        this.dateOfCreation = dateOfCreation || Date.now();
        this.lastChanged = lastChanged || this.dateOfCreation;
        this.isFavorite = isFavorite || false;
    }
    setFavorite() {
        this.isFavorite = !this.isFavorite;
        return this.isFavorite;
    }
    setContent(content) {
        if(typeof content === "string") {
            this.content = JSON.parse(content);
        }else if(typeof content === "object") {
            this.content = content;
        }else {
            throw Error("The content must either be a string or an object");
        }
    }
}