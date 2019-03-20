const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

/**
* Serial Phantasm: SE.RA.PH
*/
class Seraph {
  constructor(path) {
    this.adapter = new FileSync(path);
    this.db = low(this.adapter);
  }

  query(terms) {
    return this.db
      .get('servants')
      .find(svt => {
        let normName = svt.name.toLowerCase();
        let normClass = svt.className.toLowerCase();
        for (let term of terms) {
          let t = term.toString().toLowerCase();
          if (normName.includes(t) || normClass.includes(t)) continue;
          return false;
        }
        return true;
      })
      .value();
  }

  findByRarity(rarity) {
    return this.db
      .get('servants')
      .filter({rarity: rarity})
      .value();
  }
}

module.exports = Seraph;
