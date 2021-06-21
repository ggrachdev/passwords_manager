export default class AuthApi {
    static async getList() {
        
        const response = await fetch('/api/users/get/all', {
            method: 'GET'
        });

        const responseObj = await response.json();

        return new Promise((resolve, reject) => {
            if (responseObj['is_success'] == true) {
                resolve(responseObj);
            } else {
                reject(responseObj);
            }
        })
    }
}