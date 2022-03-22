$(document).ready(function() {

	var path_=getPhoneGapPath();
	//alert(path_);
	//carcar contenidos de los div_contenido
	$(".div_contenido").each(function(index, el){
		if($(this).attr("contenido")==""){
			$(this).attr("contenido",get_value("ruta"));
		}
		$(this).load(path_+'/contenido/'+$(this).attr("contenido"),function(){
			$(".slash").fadeOut(500,"swing");
			$(".titulo_emergente").each(function(index, el) {
				$(this).html(get_value("ruta").toUpperCase().split(".")[0]);
			})
		});

		$(".div_contenido").each(function(index, el){
			$(this).hide();
			$(this).slideDown(500);
		})
		//$(this).show('10000');
	});

	//funcion de cargar emergente para IOS
	$(document).on("click",".blank_a",function(x){
		x.preventDefault();
		if(!$(this).attr("disabled")){
			var el = $(this);
			$(".sombra_menu").click();
	   		window.open(el.attr('href'));
		}else{
			if($(this).attr("mensaje")!="0")
				alert_2($(this).attr("mensaje"));
		}
		
	});	
	
	// desaparecer splash
	setTimeout(function(){$(".splash").fadeOut(500);},500);
	//regresar a inicio
	$(document).on("click",".menu_inicio",function(){
		$(".splash").fadeIn(500,function(){
			window.location.href = "index.html";
		});
		
	})

	//cargar ventanas emergentes
	/*
	$(document).on("click",".ventana_emergente",function(){
		window.open('emergente.html?ruta='+$(this).attr('ruta')+".html");
	})
	*/

	//cerrar ventanas emergentes
	$(document).on("click",".cerrar_ventana",function(){
		$(".splash").fadeIn(500,function(){
			closeBrowser();
		})
	})

	

	//funcion que extrae variables get
	function get_value(variable){ 
	  var query = window.location.search.substring(1); 
	  var vars = query.split("&"); 
	  for (var i=0;i<vars.length;i++){ 
	    var pair = vars[i].split("="); 
	    if (pair[0] == variable){return pair[1];} 
	  }
	  return ""; //not found 
	}
});

//funcion phonegap para cerrar ventanas
	function closeBrowser(){
		window.history.go(-2);
	}
	function getPhoneGapPath() {
	   var path = window.location.pathname;
	   path = path.substr( path, path.length - 10 );
	   return path;
	};