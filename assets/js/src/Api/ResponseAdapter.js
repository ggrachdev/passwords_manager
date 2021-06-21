export default class ResponseAdapter {
        
    constructor(response)
    {
        this.is_success = response['is_success'] == true;
        this.data = response['data'];
        this.errors = response['errors'];
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