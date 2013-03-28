
/*Modificaciones:
 - Crear un arreglo para las unidades en el area de multiplicacion, y otro para el area
   de divisi�n.
 - Al agregar una ficha a un area, agregar esta al array correspondiente.
 - Concatenar todos los elementos del array antes de enviarlos al diccionario.
 - Si hay respuesta, vaciar el arreglo y colocar la nueva ficha en mult.*/ 
	
	var cols = document.querySelectorAll('#columns .column');
	
	//mult: Area de multiplicaci�n de las unidades
	var mult = document.getElementById('mult');
	
	//div: Area de divisi�n de las unidades
	var div = document.getElementById('division');
	
	/*unidadesExistentes: Se guardan las unidades que se creen en la aplicaci�n. Inicialmente tiene 4 unidades*/
	var unidadesExistentes = ['metro','kilogramo','segundo','ampere']; 
																	   
    /*toolTiped: Sirve para extraer la informaci�n que ser� mostrada en el tooltip de cada nueva unidad creada.*/	
	var toolTiped = {'metro2': 'm*m',
					 'metro3': 'm^2*m',
					 'hertz': '1/s',
					 'newton': '(m*kg)/s^2',
					 'joule': 'N*m',
					 'watt': 'J/s',
					 'coulomb': 'A*s',
					 'volt': 'W/A',
					 'ohm': 'V/A',
					 'farad': 'C/V',
					 'weber': 'V*s',
					 'tesla': 'Wb/m^2',
					 'henry': 'Wb/A'};
					
	/*simbolos: Diccionario en el cual se buscar� el s�mbolo de una determinada unidad.*/
	var simbolos = {'metro': 'm',
					'segundo': 's',
					'kilogramo': 'kg',
					'ampere': 'A',
					'metro2': 'm<sup>2</sup>',
					'metro3': 'm<sup>3</sup>',
					'hertz': 'Hz',
					'newton': 'N',
					'joule': 'J',
					'watt': 'W',
					'coulomb': 'C',
					'volt': 'V',
					'ohm': 'w',
					'farad': 'F',
					'weber': 'Wb',
					'tesla': 'T',
					'henry': 'H'};
					 
	/*diccionario: Contiene todas (o casi todas) las posibles combinaciones de unidades que representen otra unidad.*/
	var diccionario = "";
	
	var unidadesRestantes = ['metro2','metro3','hertz','newton','joule','watt','coulomb','volt','ohm','farad','weber','tesla','henry'];
	var unidadesRestantesStatic = ['metro2','metro3','hertz','newton','joule','watt','coulomb','volt','ohm','farad','weber','tesla','henry'];
	
	var dragSrcEl = null;
	
	/*superComb: Cadena compuesta por las cadenas 'combMult' y 'combDiv', de manera que ambas est�n separadas por '/'. SuperComb se 
				 reestructurar� luego de que una ficha sea soltada en el area de interacci�n. As�, se podr� saber si las unidades
				 que se han arrastrado, representan otra unidad.*/	
	var superComb = '';
	
	/*combMult: Cadena compuesta por las unidades que han sido arrastradas al area de multiplicaci�n*/
	var combMult = '';
	
	/*combMult: Cadena compuesta por las unidades que han sido arrastradas al area de divisi�n*/
	var combDiv = '';
	
	/*centinel: Permite conocer si cierto bloque de c�digo debe ejecutarse luego de que otro bloque de c�digo ha sido ejecutado. Por ejemplo,
				si una unidad arrastada al area de multiplicaci�n ha sido simplificada con una unidad en el area de divisi�n, esta no debe ser
				agregada al area de interacci�n, ni mucho menos agregada a la cadena 'combMult'*/
	var centinel = 0;
	
	/*centinelMult: Lleva la cuenta de cu�ntas unidades han sido arrastradas al area de multiplicaci�n, siendo el l�mite 5.*/
	var centinelMult = 0;
	
	/*centinelMult: Lleva la cuenta de cu�ntas unidades han sido arrastradas al area de multiplicaci�n, siendo el l�mite 5.*/
	var centinelDiv = 0;
	
	/*centinelColumnas: Ocupa los valores de 0 o 1, los mismos que indican en qu� columna (col1 o col2), debe ser colocada la nueva unidad credad,
						que aun no se encuentre en el array de unidadesExistentes. Seguido de esto, se agrega esta unidad al array.*/
	var centinelColumnas = 0;
	
	/*activarTooltip: Si toma el valor de 'true', entonces se agrega un tooltip a la nueva unidad creada, sobre el area de multiplicaci�n o divisi�n.
					  El toolTip es removido al agregar otra unidad al area de interacci�n.*/
	var activarTooltip = false;
	
	/*centinelMensaje: Si toma el valor de 'true', aparecer� un mensaje de �xito indicandole al jugador que una nueva unidad ha sido creada,
					   caso contrario, aparece un mensaje de informaci�n indicando que la unidad en cuesti�n, ya ha sido creada antes.*/
	var centinelMensaje = false;
	
	function modificarUnidadesRestantes(elemento){		
		document.getElementById('seccionDos').innerHTML = "<h4>Unidades restantes:</h4>";
		for(var i in unidadesRestantes){
			if(unidadesRestantes[i] == elemento){
				var pos = unidadesRestantes.indexOf(elemento);
				delete unidadesRestantes[pos];				
			}else if( unidadesRestantes[i] != undefined){
				document.getElementById('seccionDos').innerHTML += '<p>' + unidadesRestantes[i] + '</p>';
			}
		}
	}
	
	function ubicarUnidadesRestantes(){
		unidadesRestantes.length = 0;
		unidadesRestantes = unidadesRestantesStatic.slice();
		document.getElementById('seccionDos').innerHTML = "<h4>Unidades restantes:</h4>";
		for(var i in unidadesRestantes){			
			document.getElementById('seccionDos').innerHTML += '<p>' + unidadesRestantes[i] + '</p>';			
		}
		
	}
	
	function handleDragStart(e){	
		this.style.opacity = '0.4';
		dragSrcEl = this;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', this.innerHTML);
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

	/*
	 * Funci�n: handleDropMult
	 * Descripci�n: 
	 * -----------------------
	 * Verifica los sucesos al hacer drop sobre el area de MULTIPLICACI�N.
	 */
	function handleDropMult(e){
		activarTooltip = false;
		centinelMensaje = false;
		centinel = 0;
		if (e.stopPropagation){
			e.stopPropagation();
		}
		if (dragSrcEl != this){
			var element = $(e.dataTransfer.getData('text/html')).next();
			/*Este bloque solo se ejecuta si la unidad arrastrada es uno de los 3 metros. Evalua si la
			  unidad en cuesti�n debe ser simplificada con una unidad en el area de divisi�n.*/
			//-----------------------------------------------------------
			if(element.text().indexOf("metro") != -1){
				if(element.text().indexOf("metro3") != -1){
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
				else if(element.text().indexOf("metro2") != -1){
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
				else if(element.text() == 'metro'){
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
			}//-----------------------------------------------------------
			
			else if(combDiv.indexOf(element.text()) != -1){
				//ingresa si una unidad debe ser simplificada con otra unidad en el area de divisi�n.
				combDiv = combDiv.replace(element.text(),""); //modo interno
				$("#division div."+element.text()).first().remove(); //modo grafico
				centinelDiv--;
				centinel = 1;
			}
			if(centinel == 0){
				if(centinelMult < 5)
					combMult = combMult + element.text(); //modo interno				
				addElementOnArea(element.text(),'mult'); //modo grafico (con validaci�n de colocar unidad incluida)							
			}
			centinel = 0;
			if(diccionario[combMult]){
				combMult = diccionario[combMult];				
				
				obtenerUnidades();
				
				this.innerHTML = "";
				centinelMult = 0;
				if(centinelColumnas == 0)
					addElementInColumn(combMult,"col1");
				else
					addElementInColumn(combMult,"col2");
				addElementOnArea(combMult,'mult');
				activarTooltip = true;
				centinel = 1;
			}
			superComb = combMult + '/' + combDiv; //No hay problema si superComb no tiene validaci�n, pues el centinel de la siguiente linea lo hace.
			if(centinel == 0){				
				if(diccionario[superComb]){
					combMult = diccionario[superComb];
													
					obtenerUnidades();
					
					this.innerHTML = "";
					centinelMult = 0;
					document.getElementById('division').innerHTML = "";
					if(centinelColumnas == 0)
						addElementInColumn(combMult,"col1");					
					else
						addElementInColumn(combMult,"col2");
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
					superComb = '';
					combDiv = '';
				}
			}
			if(activarTooltip){
				document.getElementById('mult').setAttribute('title',toolTiped[combMult]); //se agrega el tooltip a la unidad creada en el area de mult.
				if(centinelMensaje){
					mensaje(combMult); //se agrega el mensaje de �xito.
					modificarUnidadesRestantes(combMult); //se elimina esa unidad de la lista de unidades restantes.
				}
				else
					mensaje("repeat");  //se agrega el mensaje de informaci�n
				modificarContador(unidadesExistentes.length);
			}else{
				document.getElementById('mult').removeAttribute('title');
				mensaje("default"); //se agrega el mensaje por defecto (el que est� al inicio de la app).
			}
		}
		console.log('SuperComb: ' + superComb);
		console.log('CombMult: ' + combMult);
		console.log('CombDiv: ' + combDiv);
		console.log('centinelMult: ' + centinelMult);
		console.log('centinelDiv: ' + centinelDiv);
		return false;
	}
	
	/*
	 * Funci�n: handleDropDiv
	 * Descripci�n: 
	 * ----------------------
	 * Verifica los sucesos al hacer drop sobre el area de DIVISI�N.
	 */	
	function handleDropDiv(e){
		activarTooltip = false;
		centinelMensaje = false;
		centinel = 0;
		if(e.stopPropagation){
			e.stopPropagation();
		}
		if(dragSrcEl != this){ // contenedor en este m�todo
			var element = $(e.dataTransfer.getData('text/html')).next();
			/*Este bloque solo se ejecuta si la unidad arrastrada es uno de los 3 metros. Evalua si la
			  unidad en cuesti�n debe ser simplificada con una unidad en el area de multiplicaci�n.*/
			//-----------------------------------------------------------
			if(element.text().indexOf("metro") != -1){
				if(element.text().indexOf("metro3") != -1){
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
				else if(element.text().indexOf("metro2") != -1){
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
				else if(element.text() == 'metro'){
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
			}//-----------------------------------------------------------
			
			else if(combMult.indexOf(element.text()) != -1){
				//ingresa si una unidad debe ser simplificada con otra unidad en el area de multiplicaci�n.
				combMult = combMult.replace(element.text(),""); //modo interno
				$("#mult div."+element.text()).first().remove(); //modo gr�fico
				centinelMult--;				
				centinel = 1;				
				if(diccionario[combMult]){ //luego de que las unidades se simplifiquen, es posible que se pueda formar una nueva unidad en el area de multiplicaci�n.
					combMult = diccionario[combMult];					
					document.getElementById('mult').innerHTML = "";
					centinelMult = 0;
					if(centinelColumnas == 0)
						addElementInColumn(combMult,"col1");					
					else
						addElementInColumn(combMult,"col2");										
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
				}
			}
			if(centinel == 0){
				if(centinelDiv < 5)
					combDiv = combDiv + element.text(); //modo interno
				addElementOnArea(element.text(),'division'); //modo grafico (con validaci�n de colocar unidad incluida)
			}
			centinel = 0;
			if(diccionario[combDiv]){
				combDiv = diccionario[combDiv];
				this.innerHTML = "";
				centinelDiv = 0;
				if(centinelColumnas == 0)
					addElementInColumn(combDiv,"col1");				
				else
					addElementInColumn(combDiv,"col2");								
				addElementOnArea(combDiv,'division');
				activarTooltip = true;
				centinel = 1;
			}
			superComb = combMult + '/' + combDiv;
			if(centinel == 0){
				if(diccionario[superComb]){
					combMult = diccionario[superComb];
					combDiv = '';
					document.getElementById('mult').innerHTML = "";
					this.innerHTML = "";
					centinelMult = 0;
					centinelDiv = 0;
					if(centinelColumnas == 0)
						addElementInColumn(combMult,"col1");						
					else
						addElementInColumn(combMult,"col2");											
					addElementOnArea(combMult,'mult');
					activarTooltip = true;
					superComb = '';
				}
			}
			if(activarTooltip){ //se agrega el tooltip a la unidad creada en el area respectiva.
				if(combMult != "")
					document.getElementById('mult').setAttribute('title',toolTiped[combMult]);								
				else if(combDiv != "")
					document.getElementById('division').setAttribute('title',toolTiped[combMult]);
				if(centinelMensaje){
					mensaje(combMult); //se agrega el mensaje de �xito.
					modificarUnidadesRestantes(combMult); //se elimina esa unidad de la lista de unidades restantes.
				}
				else
					mensaje("repeat"); //se agrega el mensaje de informaci�n.
				modificarContador(unidadesExistentes.length);
			}else{
				document.getElementById('mult').removeAttribute('title');
				document.getElementById('division').removeAttribute('title');
				mensaje("default"); //se agrega el mensaje por defecto (el que est� al inicio de la app).
			}
		}
		console.log('SuperComb: ' + superComb);
		console.log('CombMult: ' + combMult);
		console.log('CombDiv: ' + combDiv);
		console.log('centinelMult: ' + centinelMult);
		console.log('centinelDiv: ' + centinelDiv);
		return false;
	}
	
	function handleDragEnd(e){
		[].forEach.call(cols, function (col){
			col.classList.remove('over');
		});
		this.style.opacity = '1';
	}
	
	/*
	 * Funci�n: addElementInColumn
	 * Descripci�n: 
	 * ----------------------
	 * Esta funci�n agrega a la barra de unidades una nueva unidad formada, en caso de que la misma no se encuentre ya en las columnas. 
	 * (funci�n para el m�todo gr�fico)
	 */	
	function addElementInColumn(texto,column){
		for(elemento in unidadesExistentes){
			if(unidadesExistentes[elemento] == texto)
				return false;
			//Si la unidad se encuentra en el array de unidades existentes, no la agrega a la columna respectiva.
		}
		centinelMensaje = true;
		var columna = document.getElementById(column);
		var unidad = document.createElement("div");
		var espacio = document.createElement("div");
		var label = document.createElement("label");		
		var footer = document.createElement("footer");
		unidad.setAttribute('class','column');
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
		espacio.setAttribute('class','horizontal');
		unidadesExistentes[unidadesExistentes.length] = texto;
		columna.appendChild(espacio);
		columna.appendChild(unidad);
		if(column == 'col1')
			centinelColumnas = 1;
		else if(column == 'col2')
			centinelColumnas = 0;
		//modificarContador(unidadesExistentes.length);
	}	
	
	/*
	 * Funci�n: addElementOnArea
	 * Descripci�n: 
	 * ----------------------
	 * Agrega la unidad arrastrada al area de interaccci�n, luego de haber validado que en dicha area existan menos de 5 unidades.
	 * (funci�n para el m�todo gr�fico)
	 */	
	function addElementOnArea(texto, area){
		if((area == 'mult') && (centinelMult >= 5))
			return false;
		if((area == 'mdivision') && (centinelDiv >= 5))
			return false;
		var sector = document.getElementById(area);
		var unidad = document.createElement("div");
		var footer = document.createElement("footer");
		var label = document.createElement("label");
		unidad.setAttribute('class','column ' + texto);
		unidad.setAttribute('id','ubicacion');
		footer.innerHTML = texto;
		if(texto == 'ohm'){
			label.setAttribute('style','font-family:Symbol');
			label.innerHTML = 'w';
		}else
			label.innerHTML = simbolos[texto];
		unidad.appendChild(label);
		unidad.appendChild(footer);		
		sector.appendChild(unidad);
		if(area == 'mult')
			centinelMult++;
		if(area == 'division')
			centinelDiv++;
	}

	/*
	 * Funci�n: limpiarPizarra
	 * Descripci�n: 
	 * ----------------------
	 * 'Borra' las unidades del area de interacci�n, 'pizarra', y settea los valores centinelas y dem�s a su estado original.
	 */	
	function limpiarPizarra(){
		document.getElementById('mult').innerHTML='';
		document.getElementById('division').innerHTML='';		
		centinelMult = 0;
		centinelDiv = 0;
		superComb = '';
		combMult = '';
		combDiv = '';
	}
	
	/*
	 * Funci�n: reset
	 * Descripci�n: 
	 * ----------------------
	 * Settea la aplicaci�n como estaba en el inicio. Las unidades de las columnas son removidas, dejando solo las cuatro iniciales.
	 */	
	function reset(){
		document.getElementById('mult').innerHTML='';
		document.getElementById('division').innerHTML='';
		superComb = '';
		combMult = '';
		combDiv = '';
		subTmp = '';
		centinel = 0;
		centinelMult = 0;
		centinelDiv = 0;
		centinelColumnas = 0;				
		if(unidadesExistentes.length != 4){
			$('.column').remove();
			$('.horizontal').remove();
			unidadesExistentes = [];
			var col1 = document.getElementById("col1");
			var col2 = document.getElementById("col2");
			var espacio = document.createElement("div");
			espacio.setAttribute('class','horizontal');
			addElementInColumn('metro',"col1");
			addElementInColumn('kilogramo',"col1");
			addElementInColumn('segundo',"col2");			
			addElementInColumn('ampere',"col2");
		}
		modificarContador(unidadesExistentes.length);
		mensaje("default");
		ubicarUnidadesRestantes();
    }	
	
	/*
	 * Funci�n: removeMensaje
	 * Descripci�n: 
	 * ----------------------
	 * Remueve el mensaje que se est� mostrando al usuario.
	 */	
	function removeMensaje(){
		document.getElementById('mensaje').innerHTML = "";
	}
	
	/*
	 * Funci�n: mensaje
	 * Descripci�n: 
	 * ----------------------
	 * Muestra un mensaje de �xito, informaci�n, o el mensaje default, dependiendo de lo que reciba por par�metro.
	 */
	function mensaje(unidad){
		var ruta = document.getElementById("mensaje");
		removeMensaje();
		var p = document.createElement("p");
		if(unidad == 'default'){
			p.setAttribute('style','color:gray;margin-left:2%;');
			p.innerHTML = '<b>Combina</b> las unidades para crear muchas mas!';
		}else if(unidad == 'repeat'){
			p.setAttribute('style','color:#3E8EBB;margin-left:2%;');
			p.innerHTML = '<b>Vaya!</b> Ya has creado esa unidad...';
		}else{			
			p.setAttribute('style','color:darkgreen;margin-left:2%;');
			p.innerHTML = '<b>Enhorabuena!</b> Has creado una nueva unidad: <b>' + unidad + '</b>';
		}
		ruta.appendChild(p);
	}		
	
	/*
	 * Funci�n: modificarContador
	 * Descripci�n: 
	 * ----------------------
	 * Actualiza el contador de los elementos que han sido creados, el mismo que se encuentra en la parte superior izquierda de la app, y cuyo l�mite es 17.
	 */
	function modificarContador(contadorDeUnidades){		
		var documento = document.getElementById('contadorUnidades');
		documento.innerHTML = contadorDeUnidades + "/17";
	}
	
	function setDragAndDropProp(element){
		element.addEventListener('dragstart', handleDragStart, false);
		element.addEventListener('dragenter', handleDragEnter, false)
		element.addEventListener('dragover', handleDragOver, false);
		element.addEventListener('dragleave', handleDragLeave, false);
		element.addEventListener('drop', handleDrop, false);
		element.addEventListener('dragend', handleDragEnd, false);
	}		
		
	function obtenerUnidades(){
		$.ajax({
			dataType: "json",
			async:false,
			url: 'json/unidades_json.json',			
			//url: './php/unidades_php.php',
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