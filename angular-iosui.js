var ROUND_SWITCH_TEMPLAGE = '<div class="switch"> \
                              <input id="switch-toggle-{{index}}" ng-model="ngModel" name="{{name}}" class="switch-toggle" type="checkbox"></input> \
                              <label for="switch-toggle-{{index}}" ng-attr-style="width: {{switchWidth}}px; height: {{switchHeight}}px; border-radius:{{switchHeight}}px; -webkit-border-radius: {{switchHeight}}px; -moz-border-radius: {{switchHeight}}px;-ms-border-radius:{{switchHeight}}px; -o-border-radius: {{switchHeight}}px;"> \
                              <span class="switch_base" ng-attr-style="top: {{borderWidth}}px; bottom: {{borderWidth}}px; left: {{borderWidth}}px; right:{{borderWidth}}px;border-radius:{{switchHeight}}px; -webkit-border-radius: {{switchHeight}}px; -moz-border-radius: {{switchHeight}}px;-ms-border-radius:{{switchHeight}}px; -o-border-radius: {{switchHeight}}px;"></span> \
                              <span class="switch_control" ng-style="ngModel==false && {\'margin-left\': 0} || {\'margin-left\': switchHeight}" ng-attr-style="width: {{ballSize}}px; border-radius: {{ballSize}}px; -webkit-border-radius: {{ballSize}}px; -moz-border-radius: {{ballSize}}px;-ms-border-radius:{{ballSize}}px; -o-border-radius: {{ballSize}}px; top: {{innerPadding}}px;left: {{innerPadding}}px;bottom: {{innerPadding}}px;"></span></label> \
                            </div>';

var SLIDER_TEMPLAGE = '<div class="slider"> \
                        <span class="angular-sliderbar"> \
                          <span class="angular-slider-ball" ng-attr-style="left: {{pos}}"></span> \
                          <span class="angular-slider-min">{{min}}</span> \
                          <span class="angular-slider-max">{{max}}</span> \
                          <span class="angular-slider-quantity" ng-attr-style="width:{{pos}}"></span> \
                        </span> \
                      </div>';

angular.module("angular-iosui", [])
.service()
.directive("iosSlider", ["$document", "$timeout", function($document, $timeout){
  return {
    restrict: 'AE',
    replace: true,
    require: "?ngModel",
    template: function(element, attrs) {
      return SLIDER_TEMPLAGE;
    },
    scope: {
      ngModel: '=',
      min: '@',
      max: '@',
      value: '@',
      width: '@',
    },
    link: function(scope, elem, attrs, ngModel){
      var sliderball = elem.find("span").children()[0];
      var sliderbluebar = elem.find("span").children()[3];
      var sliderbar = elem.children()[0];
      var min, max, quantity;
      var unit;
      
      elem.css("width", scope.width+'px');
      $timeout(function(){
        min = sliderbluebar.offsetLeft;
        max = sliderbar.clientWidth-sliderball.clientWidth;
        quantity = max-min;
        unit = (max-min)/(scope.max-scope.min)
        
        scope.pos=unit*(scope.value-scope.min) +"px";
        
        ngModel.$setViewValue(Math.round(scope.value));
      }, 300);
      
      var quantity = max - min;
      sliderball.addEventListener("mousedown", function(e){
        e.preventDefault();
        if (e.touches) e = e.touches[0];
        var beginX = e.clientX;
        var currentPos = this.offsetLeft;
         
        $document.on("mouseup", function(e){
          $document.off("mouseup");
          $document.off("mousemove");
          //console.log("mouseup");
        });
        
        $document.on("mousemove", function(e){

          position = currentPos + (e.clientX-beginX);
          if(position <= min){
            scope.pos = min;
            ngModel.$setViewValue(scope.min);
          }
          else if(position >= max){
            scope.pos = max;
            ngModel.$setViewValue(scope.max);
          }
          else if (position > min && position <max) {
            scope.pos = position;
            var value = (scope.pos/unit)+parseInt(scope.min);
            ngModel.$setViewValue(Math.round(value));
          }
        });
      });
    }
  }
}])
.directive("iosSwitch", ["$timeout", function($timeout){
  return {
    restrict: 'AE',
    replace: true,
    
    scope: {
      width: '@',
      name: '@',
      widthO: '=',
      borderO: '=',
      paddingO: '=',
      ngModel: '='
    },
    template: function(element, attrs) { 
      return ROUND_SWITCH_TEMPLAGE;
    },
    link: function(scope, elem, attrs){
      var bWidth=scope.width || 100;
      var bheight=bWidth/2 || 50;
      var borderWidth = scope.border || 2;
      var innerPadding = scope.padding || 4;
      var ballSize = bheight - (2*innerPadding); 
      console.log("Switch...");
      scope.index = Math.round(Math.random()*100000000);
      scope.switchWidth = bWidth;
      scope.switchHeight = bWidth/2;
      scope.ballSize = ballSize;
      scope.borderWidth = borderWidth;
      scope.innerPadding = innerPadding;
      
      scope.$watch('widthO', function(){
        scope.switchWidth = scope.widthO;
        scope.switchHeight=scope.switchWidth/2;
        ballSize = scope.switchHeight - (2*scope.innerPadding); 
        scope.ballSize = ballSize;
        //console.log("Change: " +);
      });
      
      scope.$watch('borderO', function(){
        //console.log(scope.borderO);
        scope.borderWidth = scope.borderO;
      });
      scope.$watch('paddingO', function(){
        //console.log(scope.borderO);
        ballSize = scope.switchHeight - (2*innerPadding); 
        scope.ballSize = ballSize;
        scope.innerPadding = scope.paddingO;
        ballSize = scope.switchHeight - (2*scope.innerPadding); 
        scope.ballSize = ballSize;
      });
    }
  }
}]);