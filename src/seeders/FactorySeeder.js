function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

class FactorySeeder {

  static get SEED_METHOD() {
    // Virtual
    throw new Error('please set a valid SEED_METHOD first. On:', this.name)
  }

  static generate() {
    // Virtual
    throw new Error('Seeder must have a valid \'generate\' method. On:', this.name)
  }

  static seedOne(data = {}) {
    return this.SEED_METHOD({
      ...this.generate(data),
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
