const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

class Database {
  constructor(path) {
    this.adapter = new FileSync(path);
    this.db = low(this.adapter);
  }

  queryByName(terms) {
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
}

module.exports = Database;
