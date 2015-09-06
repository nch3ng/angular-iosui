var demoApp = angular.module("demoapp", ["angular-iosui"]);

demoApp.controller("mainCtrl", ["$scope", function($scope){
  console.log("controller...");
  console.log($scope.val);
  $scope.$watch('val', function(){
    //console.log($scope.val);
  })
  
  $scope.checkboxModel = {
    value: true
  };
  
}]);