import ResponseAdapter from './';

export default class UsersApi {
    static async getList() {
        
        const response = await fetch('/api/users/get/all', {
            method: 'GET'
        });

        const responseObj = await response.json();

        return new Promise((resolve, reject) => {
            
            const response = new ResponseAdapter(responseObj);
            
            if (responseObj.isSuccess()) {
                resolve(response);
            } else {
                reject(response);
            }
        })
    }
}