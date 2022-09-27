export default class Searchable {
  constructor() {
    if (this.constructor === Searchable)
      throw new Error("Searchable class cannot be instantiated");
  }
}
