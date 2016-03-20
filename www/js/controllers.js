angular.module('starter.controllers', [])

.controller('CalculatorCtrl', function($scope, $location, CalculatorService, $cordovaSocialSharing, $ionicPopover, ionicMaterialInk) {

  //sueldoBruto, tieneConyuge, cantidadHijos, familiaresACargo
  $scope.masDeducciones = false;
  $scope.input = {
                    sueldoBruto: 0,
                    tieneConyuge: false,
                    cantidadHijos: 0,
                    familiaresACargo: 0,
                    creditosHipotecarios: 0,
                    servicioDomestico: 0,
                    segVida:0,
                    sepelio:0
                    };


    $scope.sueldoNeto ='0.00';
    $scope.impustoPorGanancias ='0.00';
    $scope.descuentos ='0.00';
    $scope.descuentosTotales ='0.00';


    ionicMaterialInk.displayEffect();

    $ionicPopover.fromTemplateUrl('templates/menu.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.goToHelp = function(){
      $scope.popover.hide();
      $location.path("info");

    };
    $scope.irAStore = function(){

      window.open('market://details?id=com.ionicframework.calculadoraganancias360412', '_system');
    };
    $scope.shareAnywhere = function() {
      $cordovaSocialSharing.share("Calculadora de Ganancias", "Calculadora de Ganancias", null, "https://play.google.com/store/apps/details?id=com.ionicframework.calculadoraganancias360412");
    };
  $scope.calcular = function() {
     var resultados = CalculatorService.calcular($scope.input);
     $scope.sueldoNeto = redondeo(resultados.sueldoEnMano,2);
     $scope.impustoPorGanancias = redondeo(resultados.impuestoMensual,2);
     $scope.descuentos = redondeo(resultados.descuentosComunes,2);
     $scope.descuentosTotales =redondeo(resultados.descuentosComunes+resultados.impuestoMensual,2);
  };

  $scope.modificarCantidadHijos = function (valor) {
    $scope.input.cantidadHijos += valor;
    if ($scope.input.cantidadHijos < 0) {
      $scope.input.cantidadHijos = 0;

    }
    $scope.calcular();

  };
  $scope.modificarFamiliaresACargo = function (valor) {
    $scope.input.familiaresACargo += valor;
    if ($scope.input.familiaresACargo < 0) {
      $scope.input.familiaresACargo = 0;
    }
  	$scope.calcular();

  };


  function redondeo(numero, decimales)
  {
    var flotante = parseFloat(numero);
    var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
    return resultado.toFixed(2);
  }

})



