class Node {
    #value;
    #children;

    constructor(value) {
        this.#value = value;
        this.#children = new Array();
    }

    get value() {
        return this.#value;
    }

    get children() {
        return this.#children;
    }

    set value(value) {
        this.#value = value;
    }

    addChildren(value) {
        this.#children.push(new Node(value));
        return this;
    }
}

export default Node;