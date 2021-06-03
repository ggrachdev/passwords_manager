export default class StateApi {
    static async update() {
        let response = await fetch('/api/global_state/get');
        return await response.json();
    }
}