let app = angular.module('mooncell', []);

app.controller('mooncellCtrl', async ($scope, $http, $window) => {
  class Adapter {
    constructor(src) { this.source = src; }
    read() { return this.source; }
    write() {}
  }
  let adapter = null;
  await $http.get('json/akasha.json')
    .then(res => adapter = new Adapter(res.data));

  let seraph = new $window.Seraph(adapter);
  let sheba = new $window.Sheba('img/');
  $scope.title = 'Moon Cell';
  $scope.search = query => {
    if (!query) return;
    let svt = seraph.query(query.trim().split(/ +/));
    if (!svt || !svt.id) return;
    $scope.svt = svt;
    $scope.imgPath = sheba.getImgPath($scope.svt.id);
  };
  $scope.search('BB');
  return $scope.$digest();
});
