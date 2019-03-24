const app = angular.module('mooncell', []);

app.service('automaton', class {
  constructor($http) {
    this.http = $http;
    this.Adapter = class {
      constructor(src) { this.source = src; }
      read() { return this.source; }
      write() {}
    };
  }

  async getAdapter() {
    return this.http
      .get('json/akasha.json')
      .then(res => new this.Adapter(res.data));
  }
});

app.controller('mooncellCtrl', async ($scope, $window, automaton) => {
  const seraph = new $window.Seraph(await automaton.getAdapter());
  const sheba = new $window.Sheba('img/');
  $scope.search = query => {
    if (!query) return;
    const svt = seraph.query(query.trim().split(/ +/));
    if (!svt || !svt.id) return;
    $scope.imgPath = sheba.getImgPath(svt.id);
    $scope.svt = svt;
  };

  $scope.search('BB');
  return $scope.$digest();
});
