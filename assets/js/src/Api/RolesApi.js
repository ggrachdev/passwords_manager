import ResponseAdapter from './ResponseAdapter';

export default class RolesApi {
    static async add(data) {
        
        data['add_role_form[_csrf_token]'] = GlobalData.csrf['add_role_form'];

        const response = await fetch(`/api/roles/add/`, {
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
    
    static async get(key) {

        const response = await fetch(`/api/roles/get/${key}/`, {
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
    
    static async getList() {

        const response = await fetch('/api/roles/get/all/', {
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
    
    /**
     * Удалить роль
     */
    static async remove(keyRole) {
        
        const response = await fetch(`/api/roles/remove/${keyRole}/`, {
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
    
    /**
     * Изменить роль
     */
    static async update(data, keyRole) {
        
        const response = await fetch(`/api/roles/update/${keyRole}/`, {
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