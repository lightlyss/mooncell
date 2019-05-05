const low = require('lowdb');
const Engine = require('minisearch');

/**
* Serial Phantasm: SE.RA.PH
*/
class Seraph {
  constructor(adapter) {
    this.db = low(adapter);
    this.engine = new Engine({
      fields: ['name', 'className'],
      processTerm: term => term.toLowerCase(),
      searchOptions: {
        prefix: true,
        fuzzy: 0.1,
        combineWith: 'AND'
      }
    });
    this.engine.addAll(this.db.get('servants').value());
  }

  query(terms) {
    const results = this.engine.search(terms.join(' '));
    if (!results || results.length <= 0) {
      return null;
    }

    const ids = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].score !== results[0].score) {
        break;
      }

      ids.push(results[i].id);
    }

    ids.sort((a, b) => parseFloat(a) - parseFloat(b));
    return this.findById(ids[0]);
  }

  search(query) {
    return this.query(query.trim().split(/ +/));
  }

  findById(id) {
    return this.db
      .get('servants')
      .find({id})
      .value();
  }

  findByRarity(rarity) {
    return this.db
      .get('servants')
      .filter({rarity})
      .value();
  }

  findActiveById(id) {
    return this.db
      .get('actives')
      .find({id})
      .value();
  }

  findActivesBySvtId(id) {
    const actives = [];
    for (const aId of this.findById(id).actives) {
      const active = this.findActiveById(aId);
      if (!active && aId.includes(',')) {
        actives.push(
          ...aId.split(/ *, */).map(this.findActiveById.bind(this))
        );
        continue;
      }

      actives.push(active);
    }

    return actives.filter(a => a);
  }

  findPassiveById(id) {
    return this.db
      .get('passives')
      .find({id})
      .value();
  }

  findPassivesBySvtId(id) {
    return this.findById(id).passives
      .map(this.findPassiveById.bind(this))
      .filter(p => p);
  }

  findNoblePhantasmById(id) {
    return this.db
      .get('nps')
      .find({id})
      .value();
  }
}

module.exports = Seraph;
