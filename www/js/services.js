angular.module('starter.services', [])

.factory('CalculatorService', function() {

  var topesEscalas = [10000, 20000, 30000, 60000, 90000, 120000,99999999];
  var porcentajesEscalas = [0.09, 0.14, 0.19, 0.23, 0.27, 0.31, 0.35]; //Alicuota del impuesto
  var fijosEscalas = [900, 1400, 1900, 6900, 8100, 9300];

  var MINIMO_NO_IMPONIBLE = 42318;
  var ADICIONAL_4TA_CATEGORIA = 203126; //Deduccion especial
  var CONYUGE = 39778;
  var HIJO = 19889;
  var FAMILIAR_A_CARGO = 19889;

  //conyuge 0 o 1;
  function calcular(input) {

    var sueldoNeto = input.sueldoBruto * 0.83;
    var sueldoNetoAnual = sueldoNeto * 13;

    var MNI_anual = MINIMO_NO_IMPONIBLE+ADICIONAL_4TA_CATEGORIA+CONYUGE*input.tieneConyuge+HIJO*input.cantidadHijos+FAMILIAR_A_CARGO*input.familiaresACargo;


    //MNI_anual + Sepelio o 83.02 *12 + seg vida 83.02 *12 + inte cred  o 1.667 * 12 + serv domestico o 3526.5 * 12
    var valSuma = (input.creditosHipotecarios < 1667) ? (input.creditosHipotecarios * 12) : (1667 * 12);
    MNI_anual = MNI_anual + valSuma;

    valSuma = (input.servicioDomestico < 3526.5) ? input.servicioDomestico * 12 : (3526.5 * 12);
    MNI_anual = MNI_anual + valSuma;

    valSuma = (input.segVida < 83.02) ? input.segVida * 12 : (83.02 * 12);
    MNI_anual = MNI_anual + valSuma;

    valSuma = (input.sepelio < 83.02) ? input.sepelio * 12 : (83.02 * 12);
    MNI_anual = MNI_anual + valSuma;

    var MontoImponibleAnual =  0;
    if(MNI_anual < sueldoNetoAnual)
    {
      MontoImponibleAnual = sueldoNetoAnual - MNI_anual;
    }

    var MontoImponibleMensual = MontoImponibleAnual / 13;

    var totalEscalas = [0, 0, 0, 0, 0, 0,0];

    //Calculo Escalas
    for (var i=0; i<totalEscalas.length; i++)
    {
      totalEscalas[i] = calcularValorEscala(i,MontoImponibleAnual);
      if(totalEscalas[i] != fijosEscalas[i])
      {
        break;
      }
    }

    //Calculo Resultados
    var impuestoAnual = 0;
    for (var i=0; i<totalEscalas.length; i++)
    {
      impuestoAnual =  impuestoAnual + totalEscalas[i];
    }

    var impuestoMensual = impuestoAnual / 13;

    var alicuota = (impuestoMensual / sueldoNeto)*100;

    var sueldoEnMano = sueldoNeto - impuestoMensual;

    var resultado = {sueldoEnMano: sueldoEnMano,
                     impuestoMensual: impuestoMensual,
                     descuentosComunes: input.sueldoBruto - sueldoNeto}
    return resultado;
  }


  function calcularValorEscala(numeroEscala,montoImponibleAnual) {
    var resultado = 0;
    var montoEscala = 0;
    if(numeroEscala > 0)
    {
      montoEscala = topesEscalas[numeroEscala - 1];
    }

    if(montoImponibleAnual < topesEscalas[numeroEscala])
    {
        resultado = (montoImponibleAnual - montoEscala) * porcentajesEscalas[numeroEscala];
    }
    else
    {
        resultado = fijosEscalas[numeroEscala];
    }

    return resultado;
  }

  return {
    calcular: function(sueldoBruto, tieneConyuge, cantidadHijos, familiaresACargo) {
        return calcular(sueldoBruto, tieneConyuge, cantidadHijos, familiaresACargo);
    }
  };
});
