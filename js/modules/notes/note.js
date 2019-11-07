export default class Note {

    constructor(title = "Untitled Document", content = {}, dateOfCreation = Date.now(), lastChanged = dateOfCreation) {
        this.content = content;
        this.title = title;
        this.dateOfCreation = Date.now();
        this.lastChanged = this.dateOfCreation;
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