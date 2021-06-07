export default class StateApi {
    static async get() {
        const response = await fetch('/api/global_state/get');
        return await response.json();
    }
}