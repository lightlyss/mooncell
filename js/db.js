const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

class Database {
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

  get4thAscFilename(svtId) {
    let imgId = svtId.replace('.', 'p');
    while (imgId.split('p')[0].length < 3) imgId = '0' + imgId;
    return `${imgId}4.png`;
  }
}

module.exports = Database;
