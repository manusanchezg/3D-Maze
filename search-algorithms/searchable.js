class Searchable {
    static search() {
        throw new Error('Method search must be implemented');
    }

    constructor() {
        if (this.constructor === Searchable) {
            throw new Error('Abstract Searchable class cannot be instantiated');
        }
    }
}

export default Searchable;