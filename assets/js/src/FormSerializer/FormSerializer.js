export default class FormSerializer {
    constructor(formNode)
    {
        this.formNode = formNode;
    }

    getFormData() {
        return new FormData(this.formNode);
    }

    getJson() {
        var object = {};
        this.getFormData().forEach((value, key) => {
            object[key] = value;
        });
        return JSON.stringify(object);
    }
}