"use strict";angular.module("questionaryApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngGrid","questionModule"]).run(["$http",function(){}]).config(["$routeProvider","$httpProvider",function(a,b){b.defaults.headers.common["X-CSRF-Token"]=$("meta[name=csrf-token]").attr("content"),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/profile",{templateUrl:"views/fund.html",controller:"FundCtrl"}).when("/profile/:category",{templateUrl:"views/fund.html",controller:"FundCtrl"}).when("/404",{templateUrl:"404.html"}).otherwise({redirectTo:"/404"})}]),angular.module("questionaryApp").controller("MainCtrl",["$scope","$location","$anchorScroll","Questionary","FondesoSpecialCase","FondesoFilter","FondesoProfile",function(a,b,c,d,e,f){function g(a){return console.log("/profile/"+a),"/profile/"+a}a.sections=d.sections,a.walkedPath=null,a.currentSection=null,a.showResults=function(){d.submit(a.walkedPath,f.filters).then(function(a){console.log(a);{var c=a.data.profile;a.data.filters}b.url(g(c.uri))},function(a){console.log("There was an error"+a)})},a.onSectionChange=function(){b.hash("top"),c()},a.$watch("walkedPath",function(c,d){c!==d&&(e.checkForNecessityProfile(a.sections,c)&&b.url(g("necesidad-startup")),e.checkForProfessionalProfile(a.sections,c)&&alert("Se detectó un perfil de profesionista"),f.checkAllFilters(a.sections,c))},!0)}]);var app=angular.module("questionModule",["ui.sortable"]);app.run(["$templateCache",function(a){a.put("questionary.html",'<form name="questionaryForm" novalidate><div class="questionary-container"><div ng-transclude></div><div class="navigation-container"><button class="navigation-control previous pull-left btn btn-default" ng-if="navigation.hasPrevious" ng-click="moveToPreviousSection()"><span class="glyphicon glyphicon-arrow-left"></span>&nbsp;regresar</button><button ng-disabled="questionaryForm.$invalid" class="navigation-control next pull-right btn btn-default" ng-click="moveToNextSection()">continuar&nbsp;<span class="glyphicon glyphicon-arrow-right"></span></button></div></div></form>'),a.put("section.html",'<div class="section-container"><h2 ng-if="title">{{title}}</h2><p class="text-muted" ng-if="description">{{description}}</p><div class="questions-container" ng-transclude></div></div>'),a.put("question.html",'<ng-form name="questionForm"><div class="question-container"><div class="question-header"><p class="question-title">{{ title }}</p><p class="question-description text-muted">{{ description }}</p><div ng-include="\'errors.html\'"></div></div><div class="question-body" ng-include="template[type]"></div><div ng-transclude></div><pre ng-if="debug">{{ codeData | json}}</pre></div></ng-form>'),a.put("text-input.html",'<input class="form-control" type="text" ng-model="body.value">'),a.put("number-input.html",'<div ng-class="{ \'has-error\': questionForm.question.$invalid }"><input name="question" class="form-control" ng-required="true" type="number" min="{{body.minimumValue}}" ng-model="body.value"></div>'),a.put("radio-input.html",'<div class="radio" ng-repeat="opt in body.options"><label><input type="radio" name="radio{{idx}}" value="{{opt.value}}" ng-model="body.selected_value">{{opt.label}}</label></div>'),a.put("checkbox-input.html",'<div class="checkbox" ng-repeat="opt in body.options"><label><input type="checkbox" name="checkbox{{idx}}" ng-model="opt.checked">{{opt.label}}</label></div>'),a.put("select-input.html",'<select class="form-control" ng-model="body.selected_value" ng-options="option.label for option in body.options"></select>'),a.put("order-input.html",'<ol ui-sortable ng-model="body.options" class="order-question"><li ng-repeat="opt in body.options">{{opt.label}}</li></ol>'),a.put("prioritize-input.html",'<div class="prioritization-container"><div class="row prioritization-option" ng-repeat="opt in body.options"><div class="col-md-2"><input type="number" min="1" max="{{body.options.length}}" class="form-control input-sm prioritize-number" ng-model="opt.priority" unique-priority="body.options"></div><div class="col-md-10"><p>{{opt.label}}</p></div></div></div>'),a.put("errors.html",'<div class="error-container"><span class="text-error" ng-show="questionForm.$invalid">Por favor revisa tu respuesta.</span></div>')}]),app.directive("questionary",function(){return{templateUrl:"questionary.html",restrict:"EA",transclude:!0,scope:{firstSection:"@",lastSection:"@",sections:"=",currentSection:"=",walkedPath:"=",onFinish:"&",onChange:"&"},controller:["$scope",function(a){function b(){a.walkedPath.push(a.currentSection),a.currentSection=a.nextSection,a.nextSection=a.sections[a.currentSection.next]}function c(){a.nextSection=a.currentSection,a.currentSection=a.walkedPath.pop()}a.currentSection=a.sections[a.firstSection],a.nextSection=a.sections[a.currentSection.next],a.walkedPath=[],a.navigation={hasNext:!1,hasPrevious:!1},a.moveToNextSection=function(){angular.isObject(a.nextSection)?(console.log("moving one section ahead"),b()):(console.log("disappear next button"),a.walkedPath.push(a.currentSection),a.onFinish())},a.moveToPreviousSection=function(){var b=a.walkedPath.length;b-1>=0?(console.log("moving one section backward"),c()):console.log("disappear previous button")}}],link:function(a){function b(b){a.nextSection=a.sections[b]}a.$on("PATH_CHANGE",function(a,c){b(c.new_path)}),a.$on("DEFAULT_PATH",function(){b(a.currentSection.next)}),a.$watch("currentSection",function(){var b=a.walkedPath.length+1;a.navigation.hasPrevious=b-1>0?!0:!1},!0)}}}),app.directive("section",function(){return{templateUrl:"section.html",restrict:"EA",transclude:!0,scope:{title:"@",description:"@"}}}),app.directive("question",["$rootScope","$compile",function(a){return{templateUrl:"question.html",restrict:"EA",controller:["$scope",function(a){a.codeData={title:a.title,body:a.body},a.template={text:"text-input.html",number:"number-input.html",radio:"radio-input.html",checkbox:"checkbox-input.html",select:"select-input.html",order:"order-input.html",prioritize:"prioritize-input.html"}}],transclude:!0,scope:{title:"=",description:"=",type:"=",body:"=",debug:"=",idx:"="},link:function(b,c,d){b.$watch("type",function(a){"select"!=a||"null"!==b.body.selected_value&&!angular.isUndefined(b.body.selected_value)||(b.body.selected_value=b.body.options[0])}),b.$watch("body.selected_value",function(c,e){if(c!==e){var f=b.type;return"select"===f||"radio"===f?void(angular.isString(c.change_path)&&"true"===d.nested?(console.log("new path"+c.change_path),a.$broadcast("PATH_CHANGE",{new_path:c.change_path})):"true"===d.nested&&(console.log("default path"),a.$broadcast("DEFAULT_PATH",{}))):void 0}},!0)}}}]),app.directive("uniquePriority",function(){return{require:"ngModel",scope:{uniquePriority:"="},link:function(a,b,c,d){function e(a){var b=!0,c=!1,e=0,f=0,g=a.length;angular.forEach(a,function(a){null!=a.priority&&""!==d.$viewValue?e+=a.priority==d.$viewValue?1:0:null===a.priority&&(f+=1)}),b=1>=e?!0:!1,c=g>f?!0:!1,d.$setValidity("uniquePriority",b),d.$setValidity("required",c)}a.uniquePriority;d.$parsers.unshift(function(){return d.$viewValue}),a.$watch("uniquePriority",function(a){e(a)},!0)}}}),angular.module("questionaryApp").service("Questionary",["$http",function(a){var b={title:"Delegación",help:"Selecciona uno de los valores",type:"select",body:{options:[{value:"a",label:"Álvaro Obregón"},{value:"b",label:"Azcapotzalco"},{value:"c",label:"Benito Juárez"},{value:"d",label:"Coyoacán"},{value:"e",label:"Cuajimalpa de Morelos"},{value:"f",label:"Cuauhtémoc"},{value:"g",label:"Gustavo A. Madero"},{value:"h",label:"Iztacalco"},{value:"i",label:"Iztapalapa"},{value:"j",label:"Magdalena Contreras"},{value:"k",label:"Miguel Hidalgo"},{value:"l",label:"Milpa Alta"},{value:"m",label:"Tláhuac"},{value:"n",label:"Tlalpan"},{value:"o",label:"Venustiano Carranza"},{value:"p",label:"Xochimilco"},{value:"q",label:"Fuera del DF"}]}},c={walkedPathHasSection:function(a,b){for(var c=this.sections[a],d=0;d<b.length;d++)if(angular.equals(b[d],c))return!0;return!1},sections:{"1.B":{identifier:"1.B Características Sociodemográficas",next:"2.C.1",help:"Contesta las siguientes preguntas sobre ti y selecciona la respuesta con la que más te identificas.",grouped:!0,questions:[{id:"1.B.1",title:"Edad",type:"number",body:{minimumValue:1,value:35}},{id:"1.B.2",title:"Sexo",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Hombre"},{value:"b",label:"Mujer"}]}},{id:"1.B.3",title:"Nivel de estudios",type:"select",body:{options:[{value:"a",label:"Ninguno"},{value:"b",label:"Primaria"},{value:"c",label:"Secundaria / Secundaria Técnica"},{value:"d",label:"Bachillerato / Preparatoria / Preparatoria Técnica"},{value:"e",label:"Licenciatura / Ingeniería"},{value:"f",label:"Maestría ó superior"}]}},{id:"1.B.4",title:"¿Resides en el D.F.?",type:"select",nested:!0,body:{options:[{value:"a",label:"No, vivo en otra entidad"},{value:"b",label:"Sí, vivo en el D.F.",question:null}]}},{id:"1.B.5",title:"¿El negocio ya está en operación?",type:"select",body:{options:[{value:"a",label:"No, aún no está operando"},{value:"b",label:"Sí, ya está en operación",question:null,change_path:"2.A.1"}]}},{id:"1.B.6",title:"¿Hablas algún dialecto o lengua indígena?",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"No"},{value:"b",label:"Sí"}]}}]},"2.A.1":{identifier:"2.A Perfiles",next:"2.A.2",grouped:!1,questions:[{id:"2.A.1",title:"La razón principal por la que llevo a cabo este proyecto es porque… ",help:"De la siguiente lista selecciona y ordena las 3 prioridades con las que más te identificas. Escoge 1 para la prioridad con la que más te identificas, 2 para la segunda y 3 para la tercera. No puedes repetir el mismo número.",type:"prioritize",body:{options:[{priority:null,value:"a",label:"No hay suficientes oportunidades laborales para encontrar un empleo."},{priority:null,value:"b",label:"Prefiero emprender mi propio proyecto que ser empleado."},{priority:null,value:"c",label:"Quiero generar un impacto positivo en la sociedad y/o medio ambiente."},{priority:null,value:"d",label:"Quiero desarrollar mi creatividad."},{priority:null,value:"e",label:"Quiero trabajar en algo agradable y que me de tiempo libre."},{priority:null,value:"f",label:"Tengo una idea o proyecto muy innovador que es (o será) muy rentable y tendré grandes ganancias."}]}}]},"2.A.2":{identifier:"2.A Perfiles",next:"2.A.3",grouped:!1,questions:[{id:"2.A.2",title:"El principal objetivo de mi empresa es...",help:"De la siguiente lista selecciona y ordena las 3 prioridades con las que más te identificas. Escoge 1 para la prioridad con la que más te identificas, 2 para la segunda y 3 para la tercera. No puedes repetir el mismo número.",type:"prioritize",body:{options:[{priority:null,value:"a",label:"Obtener ingresos para solventar los gastos básicos personales / familiares."},{priority:null,value:"b",label:"Tener mi propio negocio sin depender de un tercero."},{priority:null,value:"c",label:"Que yo sea independiente y tenga tiempo para mí."},{priority:null,value:"d",label:"Exponer un proyecto artístico."},{priority:null,value:"e",label:"Generar un impacto positivo en la población y/o el medio ambiente."},{priority:null,value:"f",label:"Realizar un proyecto empresarial muy innovador, exitoso y con grandes ganancias."}]}}]},"2.A.3":{identifier:"2.A Perfiles",next:"2.A.4",grouped:!1,questions:[{id:"2.A.3",title:"¿Tu negocio pertenece a alguno de los siguientes sectores?",help:"Selecciona la respuesta con la que más te identificas de la lista desplegable del recuadro.",type:"select",body:{options:[{value:"a",label:"Industrias manufactureras"},{value:"b",label:"Comercio"},{value:"c",label:"Preparación de alimentos y bebidas (restaurantes, puestos y similares) y hoteles"},{value:"d",label:"Servicios profesionales, técnicos, corporativos, financieros, inmobiliarios, educativos, médicos y de apoyo a negocios"},{value:"e",label:"Culturales y de esparcimiento, deportivos y recreativos"},{value:"f",label:"Organizaciones con fines altruistas y medio ambientales"},{value:"g",label:"Agricultura, ganadería, aprovechamiento forestal y pesca"},{value:"h",label:"Tecnologías de la información y la comunicación"},{value:"i",label:"Otros"},{value:"j",label:"No sé"}]}}]},"2.A.4":{identifier:"2.A Perfiles",next:"2.A.5",grouped:!1,questions:[{id:"2.A.4",title:"¿Cuántas personas trabajan en la empresa (incluyendo a los dueños)?",help:"Escribe en el recuadro tu respuesta.",type:"number",body:{minimumValue:1,value:1}}]},"2.A.5":{identifier:"2.A Perfiles",next:"2.A.6",grouped:!1,questions:[{id:"2.A.5",title:"Del total de personas que trabajan en la empresa, ¿cuántos son familiares (padres, hijos, abuelos, hermanos, tíos, primos, sobrinos, cuñados) de los dueños? Incluye a los dueños en tu respuesta.",help:"Escribe en el recuadro tu respuesta.",type:"number",body:{minimumValue:0,value:0}}]},"2.A.6":{identifier:"2.A Perfiles",next:"2.A.7",grouped:!1,questions:[{id:"2.A.6",title:"¿El producto/servicio que se ofrece es?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Es nuevo y distinto a lo que existe y/o el proceso de elaboración / comercialización es innovador."},{value:"b",label:"En algunas características son diferentes a los de mi competencia o lo ofrezco a personas que no lo tienen."},{value:"c",label:"Ya existe y es ofrecido por otros."}]}}]},"2.A.7":{identifier:"2.A Perfiles",next:"2.A.8",grouped:!1,questions:[{id:"2.A.7",title:"Las siguientes frases describen maneras distintas de obtener ingresos, selecciona la frase con la que más te identificas",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Tengo un ingreso relativamente estable (no importa cuanto dinero) que se caracteriza por un flujo diario (o casi diario) de dinero."},{value:"b",label:"Tengo un ingreso inestable que se caracteriza por un flujo irregular de dinero (por proyecto/por evento/por servicio) con lapsos de tiempo sin ingreso amplios."}]}}]},"2.A.8":{identifier:"2.A Perfiles",next:"3.A.1",grouped:!1,questions:[{id:"2.A.8",title:"Piensa en las ganancias que tiene tu empresa , imagina que ese monto vale 100, si te ofrecieran un empleo con un salario de 110 ¿qué preferirías?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Aceptar el empleo y dejar de trabajar en mi empresa."},{value:"b",label:"No aceptar el empleo y seguir con mi empresa."}]}}]},"3.A.1":{identifier:"3.A Etapas",grouped:!1,next:"3.A.2",questions:[{id:"3.A.1",title:"¿Cuántos años lleva este proyecto/negocio en operación?",help:"Escribe el tiempo en años. Si lleva menos de un año, escribe 1.",type:"number",body:{minimumValue:1,value:1}}]},"3.A.2":{identifier:"3.A Etapas",grouped:!1,next:"3.A.3",questions:[{id:"3.A.2",title:"Selecciona las frases que describen el o los lugares en donde vendes/ofreces tu producto y a quiénes va dirigido (puedes seleccionar varias opciones si concuerda con tu perfil)",help:"Selecciona cada una de las respuestas si te identificas con ellas.",type:"checkbox",body:{options:[{value:"a",label:"Se vende/ofrece en una cuadra o colonia de la Ciudad de México.",checked:!1},{value:"b",label:"Se vende/ofrece en varias colonias de la Ciudad de México.",checked:!1},{value:"c",label:"Se vende/ofrece fuera de la zona del DF y área metropolitana.",checked:!1},{value:"d",label:"Se exporta al extranjero.",checked:!1},{value:"e",label:"Se vende/ofrece o anuncia en internet.",checked:!1},{value:"f",label:"Se vende/ofrece al publico en general (al consumidor final).",checked:!1},{value:"g",label:"Se vende/ofrece a empresas que a su vez venden al público u otras empresas.",checked:!1},{value:"h",label:"Se vende/ofrece al menudeo.",checked:!1},{value:"i",label:"Se vende/ofrece al mayoreo.",checked:!1}]}}]},"3.A.3":{identifier:"3.A Etapas",grouped:!1,next:"3.A.4",questions:[{id:"3.A.3",title:"¿Cuál de las siguientes frases describe mejor la manera en la que administro mi negocio?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Llevo personalmente todas las cuentas de mi negocio sin apuntar nada."},{value:"b",label:"Llevo las cuentas de mi negocio a mano, en una libreta en donde apunto los ingresos, gastos, etc."},{value:"c",label:"Llevo las cuentas de mi negocio en Excel o un programa similar."},{value:"d",label:"Hay uno o varios empleados especializados en, o contrato el servicio para, llevar a cabo la contabilidad de la empresa."}]}}]},"3.A.4":{identifier:"3.A Etapas",grouped:!1,next:"3.A.5",questions:[{id:"3.A.4",title:"¿Cuál de las siguientes frases describe mejor la toma de decisiones en la empresa?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Todas las decisiones del día a día las toma el dueño(s) de la empresa."},{value:"b",label:"En la empresa, además del dueño(s), hay uno o dos empleados de confianza que toman decisiones sobre la operación del negocio."},{value:"c",label:"En la empresa, además del dueño(s), hay una estructura de decisión mayor a 3 personas."}]}}]},"3.A.5":{identifier:"3.A Etapas",grouped:!1,next:"3.A.6",questions:[{id:"3.A.5",title:"¿El negocio tiene RFC (Registro Federal de Contribuyentes)?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Sí"},{value:"b",label:"No"}]}}]},"3.A.6":{identifier:"3.A Etapas",grouped:!1,next:"3.A.7",questions:[{id:"3.A.6",title:"¿Cuál es el nivel de respaldo que da la tecnología en tu negocio?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Ninguna, no se necesita / no tengo recursos"},{value:"b",label:"Sirve de apoyo para algunos procesos administrativos (procesamiento de nómina, costos, gastos, ventas, etc.)"},{value:"c",label:"Juega un papel clave en el proceso de elaboración/comercialización del producto o servicio que ofrece mi empresa (además de apoyar la gestión y administración de la empresa)."}]}}]},"3.A.7":{identifier:"3.A Etapas",grouped:!1,next:"3.A.8",questions:[{id:"3.A.7",title:"Selecciona los insumos con los que cuenta tu negocio o se utilizan para realizar el producto o servicio que ofrece la empresa",help:"Selecciona cada una de las respuestas si te identificas con ellas.",type:"checkbox",body:{options:[{value:"a",label:"Computadora / Laptop / tablet",checked:!1},{value:"b",label:"Acepta tarjetas de crédito, depósitos o transferencias bancarias como medios de pago u obtención de recursos",checked:!1},{value:"c",label:"Programa de cómputo especial para realizar el trabajo (diferente a Excel, Power-Point y Word)",checked:!1}]}}]},"3.A.8":{identifier:"3.A Etapas",grouped:!1,next:"4.A",questions:[{id:"3.A.8",title:"¿Alguna vez has obtenido un crédito para tu negocio de una institución bancaria o similar?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Sí"},{value:"b",label:"No"}]}}]},"4.A":{identifier:"4.A Prioridades / Problemas",grouped:!1,questions:[{id:"4.A.1",title:"De la siguiente lista enumera las primeras 3 prioridades actuales que tenga tu empresa. Puedes escoger de 1 a 3 prioridades.",help:"Escribe el valor de la respuesta",type:"prioritize",body:{options:[{priority:null,value:"a",label:"Conseguir financiamiento / Acceder a instrumentos financieros."},{priority:null,value:"b",label:"Diseñar o mejorar mi plan de negocios."},{priority:null,value:"c",label:"Incrementar la productividad / Mejorar procesos."},{priority:null,value:"d",label:"Entrar a la formalidad."},{priority:null,value:"e",label:"Contratar personal."},{priority:null,value:"f",label:"Capacitar al personal de la empresa."},{priority:null,value:"g",label:"Expandir mi mercado"},{priority:null,value:"h",label:"Incorporar tecnología e innovación."}]}}]},"2.C.1":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.2",questions:[{id:"2.C.1",title:"La razón PRINCIPAL por la que quiero llevar a cabo este proyecto es porque...",help:"De la siguiente lista selecciona y ordena las 3 frases con las que más te identificas. Escoge 1 para la prioridad con la que más te identificas, 2 para la segunda y 3 para la tercera. No puedes repetir el mismo número.",type:"prioritize",body:{options:[{priority:null,value:"a",label:"No hay suficientes oportunidades laborales para encontrar un empleo."},{priority:null,value:"b",label:"Prefiero emprender mi propio proyecto que ser empleado."},{priority:null,value:"c",label:"Quiero generar un impacto positivo en la sociedad y/o medio ambiente."},{priority:null,value:"d",label:"Quiero desarrollar mi creatividad."},{priority:null,value:"e",label:"Quiero trabajar en algo agradable y que me de tiempo libre."},{priority:null,value:"f",label:"Tengo una idea o proyecto muy innovador que será muy rentable y tendré grandes ganancias."}]}}]},"2.C.2":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.3",questions:[{id:"2.C.2",title:"El PRINCIPAL objetivo de mi empresa será...",help:"De la siguiente lista selecciona y ordena las 3 frases con las que más te identificas. Escoge 1 para la prioridad con la que más te identificas, 2 para la segunda y 3 para la tercera. No puedes repetir el mismo número.",type:"prioritize",body:{options:[{priority:null,value:"a",label:"Obtener ingresos para solventar los gastos básicos personales/familiares."},{priority:null,value:"b",label:"Tener mi propio negocio sin depender de un tercero."},{priority:null,value:"c",label:"Que yo sea independiente y tenga tiempo para mí."},{priority:null,value:"d",label:"Exponer un proyecto artístico."},{priority:null,value:"e",label:"Generar un impacto positivo en la población y/o el medio ambiente."},{priority:null,value:"f",label:"Realizar un proyecto empresarial muy innovador, exitoso y con grandes ganancias."}]}}]},"2.C.3":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.4",questions:[{id:"2.C.3",title:"¿Cuál de las siguientes frases describe mejor tu situación laboral-empresarial actual?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"NO tengo empleo y NO tengo otro negocio."},{value:"b",label:"SÍ tengo empleo y NO tengo otro negocio."},{value:"c",label:"NO tengo empleo y SÍ tengo otro negocio."},{value:"d",label:"SÍ tengo empleo y SÍ tengo otro negocio."}]}}]},"2.C.4":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.5",questions:[{id:"2.C.4",title:"Imagina que ya tienes tu negocio con el cual las ganancias son igual a 100, si te ofrecieran un empleo con un salario de 110 ¿qué preferirías?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Aceptar el empleo y dejar de trabajar en mi empresa."},{value:"b",label:"No aceptar el empleo y seguir con mi empresa."}]}}]},"2.C.5":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.6",questions:[{id:"2.C.5",title:"¿Tu negocio pertenecerá a alguno de los siguientes sectores?",help:"Selecciona la respuesta con la que más te identificas de la lista desplegable del recuadro.",type:"select",body:{options:[{value:"a",label:"Industrias manufactureras"},{value:"b",label:"Comercio"},{value:"c",label:"Preparación de alimentos y bebidas (restaurantes, puestos y similares) y hoteles"},{value:"d",label:"Servicios profesionales, técnicos, corporativos, financieros, inmobiliarios, educativos, médicos, de apoyo a negocios y manejo de desechos"},{value:"e",label:"Culturales y de esparcimiento, deportivos y recreativos"},{value:"f",label:"Organizaciones con fines altruistas y medio ambientales"},{value:"g",label:"Agricultura, ganadería, aprovechamiento forestal y pesca"},{value:"h",label:"Tecnologías de la información y la comunicación"},{value:"i",label:"Otros"},{value:"j",label:"No sé"}]}}]},"2.C.6":{identifier:"2.C Perfiles",grouped:!1,next:"2.C.7",questions:[{id:"2.C.6",title:"¿El producto/servicio que se ofrecerá será?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Será muy nuevo y distinto a lo que ya existe y/o el proceso de elaboración será muy innovador."},{value:"b",label:"En algunas características será diferente a los de mi competencia o lo voy a ofrecer a personas que no lo conocen o que no tienen acceso a él."},{value:"c",label:"Ya existe y es ofrecido por otros."}]}}]},"2.C.7":{identifier:"2.C Perfiles",grouped:!1,next:"4.C",questions:[{id:"2.C.7",title:"¿Cuál es el nivel de respaldo que dará la tecnología en tu negocio?",help:"Selecciona la respuesta con la que más te identificas.",type:"radio",body:{selected_value:"a",options:[{value:"a",label:"Ninguna, no se necesitará / no tengo recursos para eso"},{value:"b",label:"Servirá de apoyo para algunos procesos administrativos (procesamiento de nómina, costos, gastos, ventas, etc.)"},{value:"c",label:"Jugará un papel importante en la empresa (en el proceso de elaboración del producto o servicio que ofrece la empresa, además de apoyar la gestión y administración de la empresa)"}]}}]},"4.C":{identifier:"4.C Prioridades / Problemas",grouped:!1,questions:[{id:"4.C.1",title:"De la siguiente lista selecciona la (o las) prioridad(es) actual(es) que tenga tu empresa. Puedes escoger de 1 a 3 prioridades.",help:"De la siguiente lista selecciona y ordena las 3 prioridades con las que más te identificas. Escoge 1 para la prioridad con la que más te identificas, 2 para la segunda y 3 para la tercera. No puedes repetir el mismo número.",type:"prioritize",body:{options:[{priority:null,value:"a",label:"Conseguir financiamiento/ Acceder a instrumentos financieros."},{priority:null,value:"b",label:"Diseñar o mejorar mi plan de negocios."},{priority:null,value:"c",label:"Incrementar la productividad/ Mejorar procesos."},{priority:null,value:"d",label:"Entrar a la formalidad."},{priority:null,value:"e",label:"Capacitar al personal de la empresa."},{priority:null,value:"f",label:"Expandir mi mercado."},{priority:null,value:"g",label:"Incorporar tecnología e innovación."}]}}]}}};c.sections["1.B"].questions[3].body.options[1].question=angular.copy(b),c.sections["1.B"].questions[4].body.options[1].question=angular.copy(b);var d="http://fondeso.herokuapp.com/profile/";return c.save=null,c.submit=function(b,e){console.log(c.sections);var f=d+"submit",g={answers:b,filters:e};return a.post(f,angular.toJson(g))},c}]),angular.module("questionaryApp").service("FondesoProfile",["$http",function(a){var b="http://fondeso.herokuapp.com",c={all:function(){var c=b+"/funds.json";return a.get(c)},category:function(c,d){var e=b+"/profile/"+c+"/";return a.post(e,{filters:d})}};return c}]),angular.module("questionaryApp").controller("FundCtrl",["$scope","$routeParams","$location","FondesoProfile","FondesoFilter",function(a,b,c,d,e){var f=b.category;console.log(b.category),a.fundSelected=[],a.funds=null,a.gridOptions={data:"funds",selectedItems:a.fundSelected,multiSelect:!1,columnDefs:[{field:"name",displayName:"Nombre del Fondo",cellTemplate:'<div class="cell-background"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}]},angular.isDefined(f)?d.category(f,e.filters).then(function(b){a.funds=b.data,a.fundSelected[0]=a.funds[0]},function(){c.url("/404")}):d.all().then(function(b){a.funds=b.data,a.fundSelected[0]=a.funds[0]})}]),angular.module("questionaryApp").service("FondesoSpecialCase",["Questionary",function(a){var b=function(a,b){switch(a){case"necessity_education":return angular.equals(b,"a")||angular.equals(b,"b")||angular.equals(b,"c")||angular.equals(b,"d");case"necessity_reason_to_build_this_project_and_principal_business_objective":return angular.equals(b,[1,2])||angular.equals(b,[2,1])||angular.equals(b,[1,1]);case"necessity_current_laboral_situation":return angular.equals(b,"a");case"necessity_if_someone_offered_me_a_job":return angular.equals(b,"a");case"professional_education":return angular.equals(b,"e")||angular.equals(b,"f");case"professional_reason_to_build_this_project_and_principal_business_objective":return(angular.equals(b[0],1)||angular.equals(b[1],1))&&(angular.equals(b[2],1)||angular.equals(b[3],1));case"professional_current_laboral_situation":return angular.equals(b,"a")||angular.equals(b,"b");case"professional_if_someone_offered_me_a_job":return angular.equals(b,"a");default:return!1}},c=function(a){var b=[a["2.C.1"].questions[0].body.options[0].priority,a["2.C.2"].questions[0].body.options[0].priority];return[a["1.B"].questions[2].body.selected_value.value,b,a["2.C.3"].questions[0].body.selected_value,a["2.C.4"].questions[0].body.selected_value]},d=function(a){var b=[a["2.C.1"].questions[0].body.options[0].priority,a["2.C.1"].questions[0].body.options[1].priority,a["2.C.2"].questions[0].body.options[0].priority,a["2.C.2"].questions[0].body.options[1].priority];return[a["1.B"].questions[2].body.selected_value.value,b,a["2.C.3"].questions[0].body.selected_value,a["2.C.4"].questions[0].body.selected_value]};return{checkForNecessityProfile:function(d,e){var f=c(d);return b("necessity_education",f[0])&&b("necessity_reason_to_build_this_project_and_principal_business_objective",f[1])&&b("necessity_current_laboral_situation",f[2])&&b("necessity_if_someone_offered_me_a_job",f[3])&&a.walkedPathHasSection("2.C.4",e)},checkForProfessionalProfile:function(c,e){var f=d(c);return b("professional_education",f[0])&&b("professional_reason_to_build_this_project_and_principal_business_objective",f[1])&&b("professional_current_laboral_situation",f[2])&&b("professional_if_someone_offered_me_a_job",f[3])&&a.walkedPathHasSection("2.C.4",e)}}}]),angular.module("questionaryApp").service("FondesoFilter",["Questionary",function(a){var b=function(a,b){switch(angular.isUndefined(b)&&(a="answer_is_undefined"),a){case"sex_is_women":return angular.equals(b,"b");case"business_is_rural_sector":return angular.equals(b,"g");case"younger_than_30":return 30>b;case"older_or_equal_to_60":return b>=60;case"artisans":return(angular.equals(b[0],"a")||angular.equals(b[0],"b")||angular.equals(b[0],"c")||angular.equals(b[0],"d"))&&(angular.equals(b[1],"a")||angular.equals(b[1],"b")||angular.equals(b[1],"e")||angular.equals(b[1],"i")||angular.equals(b[1],"j"));case"convenience_store":return angular.equals(b,"b");case"college":return b[0]<25&&(angular.equals(b[1],"c")||angular.equals(b[1],"d"));case"export_entrepeneur":return angular.isNumber(b);case"export_business":return(e(b[0],"b")||e(b[0],"c")||e(b[0],"d")||e(b[0],"e"))&&angular.isNumber(b[1]);case"manufacture":return angular.equals(b,"a");case"intellectual_property":return angular.equals(b,"a");case"construction":return angular.equals(b,"d");case"tourism":return angular.equals(b,"c")||angular.equals(b,"i");case"access_to_it":return angular.isNumber(b)||angular.equals(b,"h");case"technology_business":return angular.equals(b,"h");default:return!1}},c=function(a,b){switch(a.type){case"select":return angular.isUndefined(a.body.selected_value)?void 0:a.body.selected_value.value;case"radio":return a.body.selected_value;case"checkbox":var c=[];return angular.forEach(a.body.options,function(a){a.checked===!0&&this.push(a.value)},c),c;case"prioritize":var d=null;return angular.forEach(a.body.options,function(a){a.value===b&&(d=a.priority)}),d;case"number":return a.body.value;default:return void 0}},d=function(b,c){return a.walkedPathHasSection(b,c)},e=function(a,b){return-1!==a.indexOf(b)},f=function(a){return a["1.B"].questions[1].body.selected_value},g=function(a){return c(a.questions[0])},h=function(a){return c(a["1.B"].questions[0])},i=function(a){return c(a["1.B"].questions[2])},j=function(a){return c(a["3.A.2"].questions[0])},k=function(a,b){return c(a.questions[0],b)},l=function(a){return c(a.questions[0])},m=function(a){return c(a["1.B"].questions[5])
};return{filters:{MUJ:!1,RUR:!1,JOV:!1,TER:!1,ART:!1,TAB:!1,BAC:!1,EXP:!1,MAN:!1,PIN:!1,CON:!1,TUR:!1,ATI:!1,IND:!1,TIC:!1},checkForWomenFilter:function(a,c){var e=f(a);return b("sex_is_women",e)&&d("1.B",c)},checkForRuralFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("business_is_rural_sector",e)||d("2.C.5",c)&&b("business_is_rural_sector",f)},checkForYoungFilter:function(a,c){var e=h(a);return b("younger_than_30",e)&&d("1.B",c)},checkForElderlyFilter:function(a,c){var e=h(a);return b("older_or_equal_to_60",e)&&d("1.B",c)},checkForArtisanFilter:function(a,c){var e=i(a),f=g(a["2.A.3"]),h=g(a["2.C.5"]);return d("2.A.3",c)&&b("artisans",[e,f])||d("2.C.5",c)&&b("artisans",[e,h])},checkForConvenienceStoreFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("convenience_store",e)||d("2.C.5",c)&&b("convenience_store",f)},checkForCollegeFilter:function(a,c){var e=h(a),f=i(a);return b("college",[e,f])&&d("1.B",c)},checkForExportFilter:function(a,c){var e=j(a),f=k(a["4.A"],"g"),g=k(a["4.C"],"f");return b("export_business",[e,f])&&d("4.A",c)||b("export_entrepeneur",g)&&d("4.C",c)},checkForManufactureFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("manufacture",e)||d("2.C.5",c)&&b("manufacture",f)},checkForIntellectualPropertyFilter:function(a,c){var e=l(a["2.A.6"]),f=l(a["2.C.6"]);return d("2.A.6",c)&&b("intellectual_property",e)||d("2.C.6",c)&&b("intellectual_property",f)},checkForConstructionFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("construction",e)||d("2.C.5",c)&&b("construction",f)},checkForTourismFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("tourism",e)||d("2.C.5",c)&&b("tourism",f)},checkForAccessToITFilter:function(a,c){var e=k(a["4.A"],"h"),f=g(a["2.C.5"]);return b("access_to_it",e)&&d("4.A",c)||b("access_to_it",f)&&d("2.C.5",c)},checkForNativeFilter:function(a,c){return d("1.B",c)&&b("native",m(a))},checkForITFilter:function(a,c){var e=g(a["2.A.3"]),f=g(a["2.C.5"]);return d("2.A.3",c)&&b("technology_business",e)||d("2.C.5",c)&&b("technology_business",f)},checkAllFilters:function(a,b){this.filters.MUJ=this.checkForWomenFilter(a,b),this.filters.RUR=this.checkForRuralFilter(a,b),this.filters.JOV=this.checkForYoungFilter(a,b),this.filters.TER=this.checkForElderlyFilter(a,b),this.filters.ART=this.checkForArtisanFilter(a,b),this.filters.TAB=this.checkForConvenienceStoreFilter(a,b),this.filters.BAC=this.checkForCollegeFilter(a,b),this.filters.EXP=this.checkForExportFilter(a,b),this.filters.MAN=this.checkForManufactureFilter(a,b),this.filters.PIN=this.checkForIntellectualPropertyFilter(a,b),this.filters.CON=this.checkForConstructionFilter(a,b),this.filters.TUR=this.checkForTourismFilter(a,b),this.filters.ATI=this.checkForAccessToITFilter(a,b),this.filters.IND=this.checkForNativeFilter(a,b),this.filters.TIC=this.checkForITFilter(a,b),console.log(this.filters)}}}]);