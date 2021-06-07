function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

class FactorySeeder {

  // Make use of ._SEED_METHOD internally for friendlier warnings
  static get _SEED_METHOD() {
    if (typeof this.SEED_METHOD !== 'function') {
      throw new Error('please set a valid SEED_METHOD first. On:', this.name)
    }

    return this.SEED_METHOD
  }

  // Make use of ._generate internally for friendlier warnings
  static _generate(data) {
    if (typeof this.generate !== 'function') {
      throw new Error('Seeder must have a valid \'generate\' method. On:', this.name)
    }

    return this.generate(data)
  }

  static seedOne(data = {}) {
    return this._SEED_METHOD({
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
