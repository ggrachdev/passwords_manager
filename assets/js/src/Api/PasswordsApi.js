import ResponseAdapter from './ResponseAdapter';

export default class PasswordsApi {
    
    static async getForFolder(projectId) {
        
        const response = await fetch(`/passwords/get/folder/${projectId}/`, {
            method: 'GET'
        });

        const responseObj = await response.json();

        return new Promise((resolve, reject) => {
            
            const response = new ResponseAdapter(responseObj);
            
            if (response.isSuccess()) {
                resolve(response);
            } else {
                reject(response);
            }
        })
    }
}