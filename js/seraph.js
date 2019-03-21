const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Engine = require('minisearch');

/**
* Serial Phantasm: SE.RA.PH
*/
class Seraph {
  constructor(path) {
    this.adapter = new FileSync(path);
    this.db = low(this.adapter);
    this.engine = new Engine({
      fields: ['name', 'className'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.1,
        combineWith: 'AND'
      }
    });
    this.engine.addAll(this.db.get('servants').value());
  }

  query(terms) {
    let results = this.engine.search(terms.join(' '));
    if (!results || !results.length) return null;
    let ids = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].score != results[0].score) break;
      ids.push(results[i].id);
    }
    ids.sort((a, b) => parseFloat(a) - parseFloat(b));
    return this.findById(ids[0]);
  }

  findById(id) {
    return this.db
      .get('servants')
      .find({id: id})
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
