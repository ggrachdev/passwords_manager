export default class StateApi {
    static async update() {
        return new Promise(function(resolve, reject) {
            resolve({
                user_is_auth: true
            });
        });
    }
}