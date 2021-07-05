import ResponseAdapter from './ResponseAdapter';

export default class UsersApi {
    
    /**
     * Получить данные всех пользователей
     */
    static async getList() {
        
        const response = await fetch('/api/users/get/all/', {
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
     * Получить данные пользователя
     */
    static async get(id) {
        
        const response = await fetch(`/api/users/get/${id}/`, {
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
     * Измениить данные пользователя
     */
    static async set(id, data) {
        
        data['change_user_form[_csrf_token]'] = GlobalData.csrf['change_user_form'];
        
        const response = await fetch(`/api/users/set/${id}/`, {
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
    
    
    /**
     * Удалить пользователя
     */
    static async remove(id) {
        
        const response = await fetch(`/api/users/remove/${id}/`, {
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