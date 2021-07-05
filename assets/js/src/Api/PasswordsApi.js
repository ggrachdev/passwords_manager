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
    
    static async add(folderId, data) {
        
        data['add_password_form[_csrf_token]'] = GlobalData.csrf['add_password_form'];
        
        const response = await fetch(`/passwords/add/${folderId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
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