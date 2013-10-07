
	/* DECLARACIONES DE VARIABLES*/
	
	var cols = document.querySelectorAll('aside .unit'),
		mult = document.getElementById('mult'),
		div  = document.getElementById('division'),
		unidadesExistentes      = ['metro','kilogramo','segundo','ampere'],
		unidadesRestantesStatic = ['metro2','metro3','hertz','newton','joule','watt','coulomb','volt','ohm','farad','weber','tesla','henry'],
		unidadesRestantes       = unidadesRestantesStatic.slice(0,unidadesRestantesStatic.length),
		dragSrcEl        = null,
		superComb        = '',
		combMult         = '',
		combDiv          = '',
		centinel         = 0,
		centinelMult     = 0,
		centinelDiv      = 0,
		activarTooltip   = false,
		centinelMensaje  = false,
		WIDTH = 0,
		HEIGHT = 0,
		MAX_UNITS = 0,
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
	
	
	/* IMPLEMENTACIONES DE FUNCIONES */	
	
	function handleDragStart(e){
		dragSrcEl = this;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', this.innerHTML);
		var unit_width, unit_height;
		WIDTH = document.querySelector('#mult').offsetWidth;
		HEIGHT = document.querySelector('#mult').offsetHeight;
		unit_width = document.querySelector('.unit').offsetWidth + 20;
		if(WIDTH < (unit_width * 6)) MAX_UNITS = 5;
		if(WIDTH < (unit_width * 5)) MAX_UNITS = 4;
		if(WIDTH < (unit_width * 4)) MAX_UNITS = 3;
		if(WIDTH < (unit_width * 3)) MAX_UNITS = 2;
		if(WIDTH < (unit_width * 2)) MAX_UNITS = 1;
		console.log("Ancho del area: " + WIDTH);
		console.log("Ancho de unidad: " + unit_width);
	}
	
	function handleDragOver(e){
		if (e.preventDefault){
			e.preventDefault();
		}
		e.dataTransfer.dropEffect = 'move';
		return false;
	}
	
	function handleDragEnter(e){
		this.classList.add('over');
	}

	function handleDragLeave(e){
		this.classList.remove('over');
	}

	function handleDrop(e){
		if (e.stopPropagation){
			e.stopPropagation();
		}
		if (dragSrcEl != this){
			dragSrcEl.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData('text/html');
		}
		return false;
	}

	function handleDropMult(e){
		if(centinelMult >= MAX_UNITS) return false;
		activarTooltip = centinelMensaje = false;
		centinel = 0;
		if (e.stopPropagation) e.stopPropagation();		
		if (dragSrcEl != this){
			var element = $(e.dataTransfer.getData('text/html')).next().text();
			if(element.indexOf("metro") != -1){
				if(element.indexOf("metro3") != -1){
					if(combDiv.indexOf('metro3') != -1){
						$("#division div.metro3").first().remove();
						combDiv = combDiv.replace("metro3","");
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro2') != -1){
						$("#division div.metro2").first().remove();
						combDiv = combDiv.replace("metro2","");
						combMult = combMult + "metro";
						addElementOnArea("metro",'mult');
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro') != -1){
						$("#division div.metro").first().remove();
						combDiv = combDiv.replace("metro","");
						combMult = combMult + "metro2";
						addElementOnArea("metro2",'mult');
						centinelDiv--;
						centinel = 1;
					}					
				}
				else if(element.indexOf("metro2") != -1){
					if(combDiv.indexOf('metro3') != -1){
						$("#division div.metro3").first().remove();
						combDiv = combDiv.replace("metro3","metro");
						addElementOnArea('metro','division');
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro2') != -1){
						$("#division div.metro2").first().remove();
						combDiv = combDiv.replace("metro2","");
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro') != -1){
						$("#division div.metro").first().remove();
						combDiv = combDiv.replace("metro","");
						combMult = combMult + "metro";
						addElementOnArea("metro",'mult');
						centinelDiv--;
						centinel = 1;
					}					
				}
				else if(element == 'metro'){
					if(combDiv.indexOf('metro3') != -1){
						$("#division div.metro3").first().remove();
						combDiv = combDiv.replace("metro3","metro2");
						addElementOnArea('metro2','division');
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro2') != -1){
						$("#division div.metro2").first().remove();
						combDiv = combDiv.replace("metro2","metro");
						addElementOnArea('metro','division');
						centinelDiv--;
						centinel = 1;
					}
					else if(combDiv.indexOf('metro') != -1){
						$("#division div.metro").first().remove();
						combDiv = combDiv.replace("metro","");
						centinelDiv--;
						centinel = 1;
					}					
				}				
			}			
			else if(combDiv.indexOf(element) != -1){				
				combDiv = combDiv.replace(element,"");
				$("#division div."+element).first().remove();
				centinelDiv--;
				centinel = 1;
			}
			if(centinel == 0){
				if(centinelMult < 5) combMult = combMult + element;
				addElementOnArea(element,'mult');
			}
			centinel = 0;
			if(diccionario[combMult]){
				combMult = diccionario[combMult];				
				this.innerHTML = "";
				centinelMult = 0;
				addElementInColumn(combMult);
				addElementOnArea(combMult,'mult');
				activarTooltip = true;
				centinel = 1;
			}
			superComb = combMult + '/' + combDiv;
			if(centinel == 0){				
				if(diccionario[superComb]){
					combMult = diccionario[superComb];
					this.innerHTML = "";
					centinelMult = 0;
					$('#division').empty();
					addElementInColumn(combMult);
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
					superComb = combDiv = '';
				}
			}
			if(activarTooltip){
				$('#mult').attr('title',tooltips[combMult]);
				if(centinelMensaje){
					mensaje(combMult);
					modificarUnidadesRestantes(combMult);
				}
				else mensaje("repeat");
			}else{
				$('#mult').removeAttr('title');
				mensaje("default");
			}
		}		
		return false;
	}
		
	function handleDropDiv(e){
		if(centinelDiv >= MAX_UNITS) return false;
		activarTooltip = centinelMensaje = false;
		centinel = 0;
		if(e.stopPropagation) e.stopPropagation();		
		if(dragSrcEl != this){
			var element = $(e.dataTransfer.getData('text/html')).next().text();			
			if(element.indexOf("metro") != -1){
				if(element.indexOf("metro3") != -1){
					if(combMult.indexOf('metro3') != -1){
						$("#mult div.metro3").first().remove();
						combMult = combMult.replace("metro3","");
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro2') != -1){
						$("#mult div.metro2").first().remove();
						combMult = combMult.replace("metro2","");
						combDiv = combDiv + "metro";
						addElementOnArea("metro",'division');
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro') != -1){
						$("#mult div.metro").first().remove();
						combMult = combMult.replace("metro","");
						combDiv = combDiv + "metro2";
						addElementOnArea("metro2",'division');
						centinelMult--;
						centinel = 1;
					}					
				}
				else if(element.indexOf("metro2") != -1){
					if(combMult.indexOf('metro3') != -1){
						$("#mult div.metro3").first().remove();
						combMult = combMult.replace("metro3","metro");
						addElementOnArea('metro','mult');
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro2') != -1){
						$("#mult div.metro2").first().remove();
						combMult = combMult.replace("metro2","");
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro') != -1){
						$("#mult div.metro").first().remove();
						combMult = combMult.replace("metro","");
						combDiv = combDiv + "metro";
						addElementOnArea("metro",'division');
						centinelMult--;
						centinel = 1;
					}					
				}
				else if(element == 'metro'){
					if(combMult.indexOf('metro3') != -1){
						$("#mult div.metro3").first().remove();
						combMult = combMult.replace("metro3","metro2");
						addElementOnArea('metro2','mult');
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro2') != -1){
						$("#mult div.metro2").first().remove();
						combMult = combMult.replace("metro2","metro");
						addElementOnArea('metro','mult');
						centinelMult--;
						centinel = 1;
					}
					else if(combMult.indexOf('metro') != -1){
						$("#mult div.metro").first().remove();
						combMult = combMult.replace("metro","");
						centinelMult--;
						centinel = 1;
					}					
				}				
			}
			else if(combMult.indexOf(element) != -1){				
				combMult = combMult.replace(element,"");
				$("#mult div."+element).first().remove();
				centinelMult--;
				centinel = 1;
				if(diccionario[combMult]){
					combMult = diccionario[combMult];					
					$('#mult').empty();
					centinelMult = 0;
					addElementInColumn(combMult);
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
				}
			}
			if(centinel == 0){
				if(centinelDiv < 5)
					combDiv = combDiv + element;
				addElementOnArea(element,'division');
			}
			centinel = 0;
			if(diccionario[combDiv]){
				combDiv = diccionario[combDiv];
				this.innerHTML = "";
				centinelDiv = 0;
				addElementInColumn(combDiv);
				addElementOnArea(combDiv,'division');
				activarTooltip = true;
				centinel = 1;
			}
			superComb = combMult + '/' + combDiv;
			if(centinel == 0){
				if(diccionario[superComb]){
					combMult = diccionario[superComb];
					combDiv = '';
					$('#mult').empty();
					this.innerHTML = "";
					centinelMult = centinelDiv = 0;
					addElementInColumn(combMult);
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
					superComb = '';
				}
			}
			if(activarTooltip){
				if(combMult != "") $('#mult').attr('title',tooltips[combMult]);								
				else if(combDiv != "") $('#division').attr('title',tooltips[combMult]);
				if(centinelMensaje){
					mensaje(combMult);
					modificarUnidadesRestantes(combMult);
				}
				else
					mensaje("repeat");
			}else{
				$('#mult').removeAttr('title');
				$('#division').removeAttr('title');
				mensaje("default");
			}
		}
		return false;
	}
	
	function handleDragEnd(e){
		[].forEach.call(cols, function (col){
			col.classList.remove('over');
		});
		this.style.opacity = '1';
	}
	
	function addElementInColumn(texto){
		for(elemento in unidadesExistentes){
			if(unidadesExistentes[elemento] == texto)
				return false;			
		}
		centinelMensaje = true;
		var unidad = document.createElement("div");
		var label = document.createElement("label");		
		var footer = document.createElement("footer");
		unidad.setAttribute('class','unit');		
		unidad.setAttribute('draggable','true');		
		footer.innerHTML = texto;
		if(texto == 'ohm'){
			label.setAttribute('style','font-family:Symbol');
			label.innerHTML = 'w';
		}else
			label.innerHTML = simbolos[texto];
		unidad.appendChild(label);		
		unidad.appendChild(footer);
		setDragAndDropProp(unidad);
		unidadesExistentes[unidadesExistentes.length] = texto;		
		document.querySelector("aside").appendChild(unidad);		
	}	
		
	function addElementOnArea(texto, area){
		if((area == 'mult') && (centinelMult >= MAX_UNITS)) return false;
		if((area == 'mdivision') && (centinelDiv >= MAX_UNITS)) return false;
		var sector = document.getElementById(area);
		var unidad = document.createElement("div");
		var footer = document.createElement("footer");
		var label = document.createElement("label");
		unidad.setAttribute('class','unit onarea ' + texto);
		footer.innerHTML = texto;
		if(texto == 'ohm'){
			label.setAttribute('style','font-family:Symbol');
			label.innerHTML = 'w';
		}else
			label.innerHTML = simbolos[texto];
		unidad.appendChild(label);
		unidad.appendChild(footer);		
		sector.appendChild(unidad);
		if(area == 'mult') centinelMult++;
		if(area == 'division') centinelDiv++;
	}
	
	function mensaje(unidad){
		var ruta = $("#mensaje");
			ruta.empty();		
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
		ruta.append(p);
		console.log(ruta);
	}
	
	function limpiarPizarra(){
		$('#mult').html('');
		$('#division').html('');		
		centinelMult = centinelDiv = 0;
		superComb = combMult = combDiv = '';
		mensaje("default");
	}
		
	function reset(){
		$('#mult').html('');
		$('#division').html('');
		superComb = combMult = combDiv = subTmp = '';		 
		centinel = centinelMult = centinelDiv = 0;				
		if(unidadesExistentes.length != 4){
			$('.unit').remove();
			unidadesExistentes = [];
			addElementInColumn('metro');
			addElementInColumn('kilogramo');
			addElementInColumn('segundo');
			addElementInColumn('ampere');
		}
		$('#contadorUnidades').html(unidadesExistentes.length + '/17');
		mensaje("default");
		reiniciarUnidadesRestantes();
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
		$(tmp).jrumble({x: 8,y: 8,rotation: 4});
		$(tmp).trigger('startRumble');
		setTimeout(function(){
			$(tmp).trigger('stopRumble');
			$(tmp).fadeOut('slow');			
		},500);
	}
	
	function setDragAndDropProp(element){
		element.addEventListener('dragstart', handleDragStart, false);
		element.addEventListener('dragenter', handleDragEnter, false)
		element.addEventListener('dragover', handleDragOver, false);
		element.addEventListener('dragleave', handleDragLeave, false);
		element.addEventListener('drop', handleDrop, false);
		element.addEventListener('dragend', handleDragEnd, false);
	}
	
	function getUnits(){
		$.ajax({
			dataType: "json",
			async: false,
			url: 'json/units_json.json',
			type: "GET",
			success: function(respuesta){				
				diccionario = respuesta;
				console.log(respuesta);
			}
		});
	}
	
	[].forEach.call(cols, function(col){
		setDragAndDropProp(col);
	});
			
	mult.addEventListener('drop', handleDropMult, false);
	mult.addEventListener('dragstart', handleDragStart, false);
	mult.addEventListener('dragenter', handleDragEnter, false)
	mult.addEventListener('dragover', handleDragOver, false);
	mult.addEventListener('dragleave', handleDragLeave, false);		
	mult.addEventListener('dragend', handleDragEnd, false);
	
	div.addEventListener('drop', handleDropDiv, false);
	div.addEventListener('dragstart', handleDragStart, false);
	div.addEventListener('dragenter', handleDragEnter, false)
	div.addEventListener('dragover', handleDragOver, false);
	div.addEventListener('dragleave', handleDragLeave, false);		
	div.addEventListener('dragend', handleDragEnd, false);
	
	
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
	
	function init(){
		document.querySelector("#btnVaciar").addEventListener('click',limpiarPizarra,false);
		document.querySelector("#btnReinicio").addEventListener('click',reset,false);
		getUnits();		
	}
	
	window.onload = init();
	