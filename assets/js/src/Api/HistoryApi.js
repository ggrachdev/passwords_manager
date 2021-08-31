import ResponseAdapter from './ResponseAdapter';

export default class HistoryApi {
    
    /**
     * Получить проект
     */
    static async getOnPage(page) {
        
        const response = await fetch(`/api/history/get/page-${page}`, {
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