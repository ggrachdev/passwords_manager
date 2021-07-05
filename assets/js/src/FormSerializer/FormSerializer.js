export default class FormSerializer {
    constructor(formNode)
    {
        this.formNode = formNode;
    }

    getFormData() {
        return new FormData(this.formNode);
    }

    getObject() {
        var object = {};
        this.getFormData().forEach((value, key) => {
            object[key] = value;
        });
        return object;
    }

    getJson() {
        return JSON.stringify(this.getObject());
    }
}