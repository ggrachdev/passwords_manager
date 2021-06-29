import ResponseAdapter from './ResponseAdapter';

export default class ProjectsApi {
    
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