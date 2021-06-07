export default class AuthApi {
    static async login(data) {
        data['_csrf_token'] = MetaData.csrf.authenticate;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        });
        return await response.json();
    }
}