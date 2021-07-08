import ResponseAdapter from './ResponseAdapter';

export default class PermissionsApi {
        
    static async getForProject(project_id) {
        
        const response = await fetch(`/permissions/project/get/${project_id}/`, {
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
        
    static async getForFolder(folder_id) {
        
        const response = await fetch(`/permissions/folder/get/${folder_id}/`, {
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
        
    static async toggleForProject(project_id, user_id, permission) {

        const data = {
          permission  
        };

        const response = await fetch(`/permissions/project/toggle/${project_id}/${user_id}/`, {
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
        
    static async toggleForFolder(folder_id, user_id, permission) {

        const data = {
          permission  
        };
        
        const response = await fetch(`/permissions/folder/toggle/${folder_id}/${user_id}/`, {
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