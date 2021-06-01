function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

class FactorySeeder {

  static get _Factory() {
    // Make use of ._Factory internally for friendlier warnings
    if (!this.Factory) {
      throw new Error('please set a valid Factory first. On:', this.name)
    }

    return this.Factory
  }

  static _generate(data) {
    // Make use of ._generate internally for friendlier warnings
    if (typeof this.generate !== 'function') {
      throw new Error('Seeder must have a valid \'generate\' method. On:', this.name)
    }

    return this.generate(data)
  }

  // TODO: remove!
  //static generateOne(data) { return this._generate(data) }

  //static generateN(data = {}, times = getRandomArbitrary(2, 5)) {
  //  return Array.from(Array(times)).map(() => this._generate(data))
  //}

  static seedOne(data = {}) {
    return this._Factory.new({
      ...this._generate(),
      ...data,
    })
  }

  static seedMany(dataArray) {
    return dataArray.map(data => this.seedOne(data))
  }

  static seedN(data = {}, times = getRandomArbitrary(2, 5)) {
    // double iteration :(. Ensures execution travels through
    // this.seedMany, which may receive special implementation later
    const dataArray = Array.from(Array(times)).map(() => ({
      ...data,
    }))

    return this.seedMany(dataArray)
  }

}

module.exports = FactorySeeder
