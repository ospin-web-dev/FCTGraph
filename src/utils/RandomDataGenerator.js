const { v4: uuidv4 } = require('uuid')

class RandomDataGenerator {

  static uuid() {
    return uuidv4()
  }

  static boolean() {
    return Math.random() <= 0.5
  }

  static integer(options = {}) {
    const min = options.min || 0
    const max = Number.isInteger(options.max) ? options.max : 1000
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static float(options = {}) {
    const min = options.min || 0
    const max = options.max ? options.max : 1000
    const float = Math.random() * (max - min + 1) + min
    return float
  }

  static frog() {
    const frogList = ['Country frog', 'Northern red-legged frog', 'Iberian frog', 'Vermilion Frog', 'Yellow-legged Mountain Frog', 'Rana Goliat', 'Glass frog', 'Flying frog', 'South African black frog', 'Mossy frog', 'Red-eyed green frog']
    return RandomDataGenerator.arrayItem(frogList)
  }

  static jobDescriptor() {
    const descriptorList = ['Lead', 'Dynamic', 'Principal', 'Chief', 'Forward', 'Corporate', 'Senior', 'Global', 'Legacy', 'Direct', 'Future', 'District', 'Human', 'Customer', 'Regional', 'Internal', 'International', 'Investor', 'Central', 'Product', 'National' ]
    return RandomDataGenerator.arrayItem(descriptorList)
  }

  static hackerNoun() {
    const list = [ 'sensor', 'bandwidth', 'transmitter', 'circuit', 'card', 'pixel', 'hard drive', 'port', 'panel', 'application', 'interface', 'alarm', 'bus', 'system', 'matrix', 'array', 'protocol', 'microchip', 'monitor', 'capacitor', 'program', 'driver', 'firewall', 'feed' ]
    return RandomDataGenerator.arrayItem(list)

  }

  static arrayItem(array) {
    return array[RandomDataGenerator.integer({ max: (array.length - 1) })]
  }

}

module.exports = RandomDataGenerator
