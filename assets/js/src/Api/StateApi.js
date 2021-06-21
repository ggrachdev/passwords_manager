export default class StateApi {
    static async get() {
        const response = await fetch('/api/global_state/get/');
        const responseObj = await response.json();

        return responseObj;
    }
}