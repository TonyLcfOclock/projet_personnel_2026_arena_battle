class Game {
    constructor(state) {
        this.state = $state(state);
    }
}

export default new Game('register');