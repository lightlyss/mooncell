const random = require('math-random');

class Fate {
  constructor(db) {
    this.db = db;
    this.rates = [0.0001, 0.27995, 0.27995, 0.40, 0.03, 0.01];
  }

  summon() {
    let rn = random();
    let pivot = 0;
    let pool = [];
    for (let r = 0; r < this.rates.length; r++) {
      pivot += this.rates[r];
      if (rn < pivot) {
        pool = this.db.findByRarity(r.toString());
        break;
      }
    }
    return pool[Math.floor(random()*pool.length)];
  }
}

module.exports = Fate;
