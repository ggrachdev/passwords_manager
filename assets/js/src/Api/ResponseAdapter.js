export default class ResponseAdapter {
        
    constructor(responseObject)
    {
        this.is_success = responseObject['is_success'] == true;
        this.data = responseObject['data'];
        this.errors = responseObject['errors'];
    }
        
    isSuccess()
    {
        return this.is_success;
    }
        
    isFailed()
    {
        return this.is_success === false;
    }
        
    getData()
    {
        return this.data;
    }
        
    getErrors()
    {
        return this.errors;
    }
}