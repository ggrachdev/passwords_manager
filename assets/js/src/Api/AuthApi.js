export default class AuthApi {
    static async login(data) {
        data['_csrf_token'] = GlobalData.csrf.authenticate;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        });

        const responseObj = await response.json();

        return new Promise((resolve, reject) => {
            if ('error' in responseObj) {
                reject(responseObj);
            } else {
                resolve(responseObj);
            }
        })
    }
}