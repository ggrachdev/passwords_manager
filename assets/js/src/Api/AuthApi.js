import ResponseAdapter from './ResponseAdapter';

export default class AuthApi {
    static async login(data) {
        data['_csrf_token'] = GlobalData.csrf.authenticate;

        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        });

        const responseObj = await response.json();

        // @todo add ResponseAdapter

        return new Promise((resolve, reject) => {
            if (responseObj['is_success'] == true) {
                resolve(responseObj);
            } else {
                reject(responseObj);
            }
        })
    }

    static async registration(data) {

        data['registration_user_form[_csrf_token]'] = GlobalData.csrf.registration_user_form;

        const responseRaw = await fetch('/api/auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        });

        const responseObj = await responseRaw.json();

        const response = new ResponseAdapter(responseObj);

        return new Promise((resolve, reject) => {
            if (response.isSuccess()) {
                resolve(response);
            } else {
                reject(response);
            }
        })
    }
}