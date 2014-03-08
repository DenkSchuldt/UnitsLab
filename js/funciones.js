
	/* DECLARACIONES DE VARIABLES*/
	
	var units = document.querySelectorAll('aside .unit'),
		unidadesExistentes      = ['metro','kilogramo','segundo','ampere'],
		unidadesRestantesStatic = ['metro2','metro3','hertz','newton','joule','watt','coulomb','volt','ohm','farad','weber','tesla','henry'],
		unidadesRestantes       = unidadesRestantesStatic.slice(0,unidadesRestantesStatic.length),
		superComb        = '',
		combMult         = '',
		combDiv          = '',
		centinel         = 0,
		activarTooltip   = false,
		centinelMensaje  = false,
		WIDTH = 0,
		HEIGHT = 0,
		MULT_LEFT = 0,
		MULT_RIGHT = 0,
		MULT_BOTTOM = 0,
		MULT_TOP = 0,
		DIV_LEFT = 0,
		DIV_RIGHT = 0,
		DIV_BOTTOM = 0,
		DIV_TOP = 0,
		tooltips = {
			'metro2' : 'm*m',
			'metro3' : 'm^2*m',
			'hertz'  : '1/s',
			'newton' : '(m*kg)/s^2',
			'joule'  : 'N*m',
			'watt'   : 'J/s',
			'coulomb': 'A*s',
			'volt'   : 'W/A',
			'ohm'    : 'V/A',
			'farad'  : 'C/V',
			'weber'  : 'V*s',
			'tesla'  : 'Wb/m^2',
			'henry'  : 'Wb/A'
		},
		simbolos = {
			'metro'    : 'm',
			'segundo'  : 's',
			'kilogramo': 'kg',
			'ampere'   : 'A',
			'metro2'   : 'm<sup>2</sup>',
			'metro3'   : 'm<sup>3</sup>',
			'hertz'    : 'Hz',
			'newton'   : 'N',
			'joule'    : 'J',
			'watt'     : 'W',
			'coulomb'  : 'C',
			'volt'     : 'V',
			'ohm'      : 'w',
			'farad'    : 'F',
			'weber'    : 'Wb',
			'tesla'    : 'T',
			'henry'    : 'H'
		};		
	
	function checkMult(elem){
		centinel = 0;
		activarTooltip = centinelMensaje = false;
		var element = elem.target.childNodes[1].innerHTML;
		if(elem.target.mult) return;
		if(elem.target.div){
			elem.target.div = false;
			combDiv = combDiv.replace(element,"");
		}
		if(element.indexOf("metro") != -1){
			if(element.indexOf("metro3") != -1){
				if(combDiv.indexOf('metro3') != -1){
					$(".unit.div.metro3").first().remove();
					combDiv = combDiv.replace("metro3","");
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro2') != -1){
					$(".unit.div.metro2").first().remove();
					combDiv = combDiv.replace("metro2","");
					combMult = combMult + "metro";
					addUnitInArea("metro",'mult');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro') != -1){
					$(".unit.div.metro").first().remove();
					combDiv = combDiv.replace("metro","");
					combMult = combMult + "metro2";
					addUnitInArea("metro2",'mult');
					$(elem.target).remove();
					centinel = 1;
				}					
			}
			else if(element.indexOf("metro2") != -1){
				if(combDiv.indexOf('metro3') != -1){
					$(".unit.div.metro3").first().remove();
					combDiv = combDiv.replace("metro3","metro");
					addUnitInArea('metro','div');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro2') != -1){
					$(".unit.div.metro2").first().remove();
					combDiv = combDiv.replace("metro2","");
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro') != -1){
					$(".unit.div.metro").first().remove();
					combDiv = combDiv.replace("metro","");
					combMult = combMult + "metro";
					addUnitInArea("metro",'mult');
					$(elem.target).remove();
					centinel = 1;
				}					
			}
			else if(element == 'metro'){
				if(combDiv.indexOf('metro3') != -1){
					$(".unit.div.metro3").first().remove();
					combDiv = combDiv.replace("metro3","metro2");
					addUnitInArea('metro2','div');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro2') != -1){
					$(".unit.div.metro2").first().remove();
					combDiv = combDiv.replace("metro2","metro");
					addUnitInArea('metro','div');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combDiv.indexOf('metro') != -1){
					$(".unit.div.metro").first().remove();
					combDiv = combDiv.replace("metro","");
					$(elem.target).remove();
					centinel = 1;
				}					
			}				
		}			
		else if(combDiv.indexOf(element) != -1){
			//Para simplificar una unidad
			combDiv = combDiv.replace(element,"");
			$(".unit.div."+element).first().remove();
			$(elem.target).remove();
			centinel = 1;
		}
		if(centinel == 0){
			//Si no hay combinación o simplificación, añado la unidad al area
			combMult = combMult + element;
			elem.target.mult = true;
		}
		centinel = 0;
		if(diccionario[combMult]){
			//Si la combinación existe, esta es añadida al area y a la barra de unidades disponibles
			combMult = diccionario[combMult];
			$(".unit.mult").remove();
			addUnitInColumn(combMult,true,"");
			addUnitInArea(combMult,'mult');
			activarTooltip = true;
			centinel = 1;
		}
		superComb = combMult + '/' + combDiv;
		if(centinel == 0){
			if(diccionario[superComb]){
				//Si la super combinación existe, esta es añadida al area y a la barra de unidades disponibles
				combMult = diccionario[superComb];
				$(".unit.mult").remove();
				$('.unit.div').remove();
				addUnitInColumn(combMult,true,"");
				addUnitInArea(combMult,'mult');
				activarTooltip = true;
				superComb = combDiv = '';
			}
		}
		if(activarTooltip){
			if(centinelMensaje){
				mensaje(combMult);
				modificarUnidadesRestantes(combMult);
			}
			else mensaje("repeat");
		}else{
			mensaje("default");
		}
		elem.target.mult = true;
		console.log("CombMult es: " + combMult);
		console.log("CombDiv es: " + combDiv);
	}
	
	function checkDiv(elem){
		centinel = 0;
		activarTooltip = centinelMensaje = false;
		var element = elem.target.childNodes[1].innerHTML;
		if(elem.target.div) return;
		if(elem.target.mult){
			elem.target.mult = false;
			combMult = combMult.replace(element,"");
		}
		if(element.indexOf("metro") != -1){
			if(element.indexOf("metro3") != -1){
				if(combMult.indexOf('metro3') != -1){
					$(".unit.mult.metro3").first().remove();
					combMult = combMult.replace("metro3","");
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro2') != -1){
					$(".unit.mult.metro2").first().remove();
					combMult = combMult.replace("metro2","");
					combDiv = combDiv + "metro";
					addUnitInArea("metro",'div');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro') != -1){
					$(".unit.mult.metro").first().remove();
					combMult = combMult.replace("metro","");
					combDiv = combDiv + "metro2";
					addUnitInArea("metro2",'div');
					$(elem.target).remove();
					centinel = 1;
				}					
			}
			else if(element.indexOf("metro2") != -1){
				if(combMult.indexOf('metro3') != -1){
					$(".unit.mult.metro3").first().remove();
					combMult = combMult.replace("metro3","metro");
					addUnitInArea('metro','mult');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro2') != -1){
					$(".unit.mult.metro2").first().remove();
					combMult = combMult.replace("metro2","");
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro') != -1){
					$(".unit.mult.metro").first().remove();
					combMult = combMult.replace("metro","");
					combDiv = combDiv + "metro";
					addUnitInArea("metro",'div');
					$(elem.target).remove();
					centinel = 1;
				}
			}
			else if(element == 'metro'){
				if(combMult.indexOf('metro3') != -1){
					$(".unit.mult.metro3").first().remove();
					combMult = combMult.replace("metro3","metro2");
					addUnitInArea('metro2','mult');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro2') != -1){
					$(".unit.mult.metro2").first().remove();
					combMult = combMult.replace("metro2","metro");
					addUnitInArea('metro','mult');
					$(elem.target).remove();
					centinel = 1;
				}
				else if(combMult.indexOf('metro') != -1){
					$(".unit.mult.metro").first().remove();
					combMult = combMult.replace("metro","");
					$(elem.target).remove();
					centinel = 1;
				}					
			}
		}
		else if(combMult.indexOf(element) != -1){				
			combMult = combMult.replace(element,"");
			$(".unit.mult."+element).first().remove();
			$(elem.target).remove();
			centinel = 1;
			if(diccionario[combMult]){
				combMult = diccionario[combMult];
				$('.unit.mult').remove();
				$('.unit.div').remove();
				addUnitInColumn(combMult,true,"");
				addUnitInArea(combMult,'mult');
				activarTooltip = true;
			}
		}
		if(centinel == 0){
			combDiv = combDiv + element;
			elem.target.div = true;
		}
		centinel = 0;
		if(diccionario[combDiv]){
			combDiv = diccionario[combDiv];
			$(".unit.div").remove();
			addUnitInColumn(combDiv,true,"");
			addUnitInArea(combDiv,'div');
			activarTooltip = true;
			centinel = 1;
		}
		superComb = combMult + '/' + combDiv;
		if(centinel == 0){
			if(diccionario[superComb]){
				combMult = diccionario[superComb];
				combDiv = '';
				$('.unit.mult').remove();
				$(".unit.div").remove();
				addUnitInColumn(combMult,true,"");
				addUnitInArea(combMult,'mult');
				activarTooltip = true;
				superComb = '';
			}
		}
		if(activarTooltip){
			if(centinelMensaje){
				mensaje(combMult);
				modificarUnidadesRestantes(combMult);
			}
			else
				mensaje("repeat");
		}else{
			mensaje("default");
		}
		elem.target.div = true;
		console.log("CombMult es: " + combMult);
		console.log("CombDiv es: " + combDiv);
	}
	
	function addUnitInColumn(text){
		for(element in unidadesExistentes){
			if(unidadesExistentes[element] == text)
				return false;			
		}
		centinelMensaje = true;
		var unit = createUnit(text,true,"");
		unidadesExistentes[unidadesExistentes.length] = text;
		document.querySelector("aside").appendChild(unit);
		$(unit).css("top",$(unit).offset().top);
		$(unit).css("left",$(unit).offset().left);
	}	
		
	function addUnitInArea(text, area){
		var unit = createUnit(text,false,area);
		document.querySelector("aside").appendChild(unit);
		unit.inside = true;
		if(area == "mult"){
			$(unit).css("left",MULT_LEFT+WIDTH-350);
			$(unit).css("top",MULT_TOP+HEIGHT-150);
		}else if(area == "div"){
			$(unit).css("left",DIV_LEFT+WIDTH-350);
			$(unit).css("top",DIV_TOP+HEIGHT-150);
		}
	}
	
	function createUnit(text,_super,area){
		var unit = document.createElement("div");
		var label = document.createElement("label");		
		var footer = document.createElement("footer");
		footer.innerHTML = text;
		if(text == 'ohm'){
			label.setAttribute('style','font-family:Symbol');
			label.innerHTML = 'w';
		}else
			label.innerHTML = simbolos[text];
		unit.appendChild(label);	
		unit.appendChild(footer);
		$(unit).udraggable({
			start: function ($element, dragging, x, y) {
				recursiveUdrag($element, dragging, x, y);
			},
			stop: function ($elem, dragging, x, y){
				checkUnitOnArea($elem);
			}
		});
		if(_super){
			$(unit).attr('class','unit super');
			$(unit).css("position","initial");
		}
		else $(unit).attr('class','unit ' + area + ' ' + text);
		if(area == "mult") unit.mult = true;
		if(area == "div") unit.div = true;
		return unit;
	}
	
	
	function mensaje(unidad){
		var msj = $("#mensaje");
			msj.empty();		
		var p = document.createElement("p");
		if(unidad == 'default'){
			p.setAttribute('style','color:gray;');
			p.innerHTML = '&iexcl;<b>Combina</b> las unidades para crear muchas mas!';
		}else if(unidad == 'repeat'){
			p.setAttribute('style','color:#3E8EBB;');
			p.innerHTML = '<b>&iexcl;Vaya!</b> Ya has creado esta unidad...';
		}else{			
			p.setAttribute('style','color:darkgreen;');
			p.innerHTML = '<b>&iexcl;Enhorabuena!</b> Has creado: <b>' + unidad + '</b>';
			$('#contadorUnidades').html(unidadesExistentes.length + '/17');
		}		
		msj.append(p);
	}
	
	function limpiarPizarra(){
		var allUnits = $(".unit");
		for(var i=0; i<allUnits.length; i++){
			if(!$(allUnits[i]).hasClass("super")){
				$(allUnits[i]).fadeOut('fast',function(){
					$(allUnits[i]).remove();
				});
			}
		}
		centinelDiv = 0;
		superComb = combMult = combDiv = '';
		mensaje("default");
	}
	
	function reiniciarUnidadesRestantes(){
		unidadesRestantes.length = 0;
		unidadesRestantes = unidadesRestantesStatic.slice();				
		$('#seccionDos').html("<h4>Unidades restantes:</h4>");
		for(var i in unidadesRestantes){			
			var p = document.createElement('p');			
				p.appendChild(document.createTextNode(unidadesRestantes[i]));
			if(unidadesRestantes[i] == "metro2") p.setAttribute('id','m2');
			else if(unidadesRestantes[i] == "metro3") p.setAttribute('id','m3');
			else p.setAttribute('id',simbolos[unidadesRestantes[i]]);				
			$('#seccionDos').append(p);
		}		
	}	
	
	function modificarUnidadesRestantes(elemento){				 
		var tmp = "";		
		if(elemento == "metro2") tmp = "#m2";
		else if(elemento == "metro3") tmp = "#m3";
		else tmp = "#"+simbolos[elemento];
		$(tmp).fadeOut('slow');
	}
	
	function getUnits(){
		$.ajax({
			dataType: "json",
			async: false,
			url: 'json/units_json.json',
			type: "GET",
			success: function(respuesta){				
				diccionario = respuesta;
			}
		});
	}
	
	function getOffset(el){
		var _x = 0;
		var _y = 0;
		while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	}
	
	function setBordersOfAreas(){
		WIDTH = document.querySelector('#mult').offsetWidth;
		HEIGHT = document.querySelector('#mult').offsetHeight;
		MULT_LEFT = getOffset(document.querySelector('#mult')).left;
		MULT_RIGHT = MULT_LEFT + WIDTH;
		MULT_BOTTOM = getOffset(document.querySelector('#mult')).top + HEIGHT;
		MULT_TOP = MULT_BOTTOM - HEIGHT;
		DIV_LEFT = getOffset(document.querySelector('#division')).left;
		DIV_RIGHT = DIV_LEFT + WIDTH;
		DIV_BOTTOM = getOffset(document.querySelector('#division')).top + HEIGHT;
		DIV_TOP = DIV_BOTTOM - HEIGHT;
	}
	
	$( window ).resize(function() {
		setInitialOffsets();
	});
	
	function recursiveUdrag(elem, drag, x, y){
		if($(elem.target).hasClass("super")){
			var node = elem.target.cloneNode(true);
			$(node).udraggable({
				start: function ($element, dragging, x, y) {
					recursiveUdrag($element, dragging, x, y);
				},
				stop: function ($elem, dragging, x, y){
					checkUnitOnArea($elem);
				}
			});
			node.style.position = "initial";
			$(elem.target).after(node);
			$(node).css("top",elem.target.style.top);
			$(node).css("left",elem.target.style.left);
			$(elem.target).removeClass("super");
		}
		elem.target.style.position = "absolute";
	}
	
	function checkUnitOnArea(elem){
		if(elem.target.offsetLeft >= MULT_LEFT && elem.target.offsetLeft <= MULT_RIGHT-77){
			if(elem.target.offsetTop >= MULT_TOP && elem.target.offsetTop <= MULT_BOTTOM-77){
				$(elem.target).attr("class","unit mult "+elem.target.childNodes[1].innerHTML);
				checkMult(elem);
			}else if(elem.target.offsetTop >= DIV_TOP && elem.target.offsetTop <= DIV_BOTTOM-77){
				$(elem.target).attr("class","unit div "+elem.target.childNodes[1].innerHTML);
				checkDiv(elem);
			}else{
				$(elem.target).attr("class","unit");
				if(elem.target.div){
					elem.target.div = false;
					combDiv = combDiv.replace(elem.target.childNodes[1].innerHTML,"");
				}
				if(elem.target.mult){
					elem.target.mult = false;
					combMult = combMult.replace(elem.target.childNodes[1].innerHTML,"");
				}
			}
		}else{
			if(elem.target.mult){
				elem.target.mult = false;
				combMult = combMult.replace(elem.target.childNodes[1].innerHTML,"");
			}
			if(elem.target.div){
				elem.target.div = false;
				combDiv = combDiv.replace(elem.target.childNodes[1].innerHTML,"");
			}
			$(elem.target).attr("class","unit");
		}
	}
	
	function setInitialOffsets(){
		for(var i=0;i<4;i++){
			$($('.unit.super')[i]).css("top",$($('.unit.super')[i]).offset().top);
			$($('.unit.super')[i]).css("left",$($('.unit.super')[i]).offset().left);
		}
	}
	
	function random(){
		var ps = $("#seccionDos p");
		for(var i=0; i<ps.length; i++){
			var num = Math.floor((Math.random()*20)+1);
			var sign = "+";
			if(num > 10){
				sign = "-";
			}else{
				sign = "+";
			}
			$(ps[i]).css("-ms-transform","rotate("+sign+num+"deg) translateX("+num+"px)");
			$(ps[i]).css("-webkit-transform","rotate("+sign+num+"deg) translateX("+num+"px)");
			$(ps[i]).css("transform","rotate("+sign+num+"deg) translateX("+num+"px)");
		}
	}
	
	function init(){
		random();
		$("#btnVaciar").click(limpiarPizarra);
		getUnits();
		$('.unit').udraggable({
			start: function ($element, dragging, x, y){
				recursiveUdrag($element, dragging, x, y);
			},
			stop: function ($elem, dragging, x, y){
				checkUnitOnArea($elem);
			}
		});
		$('.unit.super').css("position","initial");
		setInitialOffsets();
		setInterval(setBordersOfAreas,1000);
	}
	
	window.onload = init();