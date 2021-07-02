import ResponseAdapter from './ResponseAdapter';

export default class ProjectsApi {
        
    static async addFolder(project_id, data) {
        
        data['add_folder_form[_csrf_token]'] = GlobalData.csrf['add_folder_form'];

        const response = await fetch(`/projects/add/folder/${project_id}/`, {
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
     * Обновить проект
     */
    static async update(project_id, data) {
        
        data['change_project_form[_csrf_token]'] = GlobalData.csrf['change_project_form'];

        const response = await fetch(`/projects/update/${project_id}/`, {
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
        
    static async add(data) {
        
        data['add_project_form[_csrf_token]'] = GlobalData.csrf['add_project_form'];

        const response = await fetch(`/projects/add/`, {
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
     * Удалить проект
     */
    static async remove(project_id) {
        
        const response = await fetch(`/projects/remove/${project_id}/`, {
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
     * Получить проект
     */
    static async get(project_id) {
        
        const response = await fetch(`/projects/get/${project_id}/`, {
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
     * Получить данные всех проектов
     */
    static async getList() {
        
        const response = await fetch('/projects/get/all/', {
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