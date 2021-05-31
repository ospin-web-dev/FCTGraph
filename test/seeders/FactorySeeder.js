function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

class FactorySeeder {

  static set Factory(targetFactory) { this.Factory = targetFactory }

  static get Factory() {
    if (!this.Factory) {
      throw new Error('please set a valid Factory first. On:', this.name)
    }

    return this.Factory
  }

  static seedOne(data = {}) {
    if (typeof this.generateOne !== 'function') {
      throw new Error('Seeder must have a valid \'_generateOne\' method. On:', this.name)
    }

    return this.Factory.new({
      ...this._generateOne(),
      ...data,
    })
  }

  static seedMany(dataArray) {
    return dataArray.map(this.seedOne)
  }

  static seedN(data = {}, times = getRandomArbitrary(2, 5)) {
    // unecessary double iteration, but ensures it travels through
    // this.seedMany, which may receive special implementation later
    const dataArray = Array.from(Array(times)).map(() => ({
      ...data,
    }))

    return this.seedMany(dataArray)
  }

}

module.exports = FactorySeeder
