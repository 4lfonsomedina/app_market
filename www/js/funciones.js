//variables genericas en todos los scripts posteriores a funciones.js
var url_api = "https://admin.testing-device.com/index.php/api_controller/";
if( /iPhone|iPad/i.test(navigator.userAgent) ) {
   console.log('IOS');
}
if(/Android/i.test(navigator.userAgent)){
	console.log('ANDROID');
}
$(document).ready(function() {

//quitar slash
//deshabilitar zoom
// stop ios bounce and zoom 
document.ontouchmove = event => {event.preventDefault();}; 
//variables de inicio para las funciones
	iniciar_app();


// funcion que se ejecuta al iniciar la aplicacion PRODUCTOS FERBIS
	function iniciar_app(){
		actualizar_burbuja_carrito();
		actualizar_burbuja_notificaciones();
		/*
		$.post('contenido/banner.html', function(resp_json){
			$("#contenedor_articulos").html(resp_json);
		})
		/*
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_dep',{dep:'007'}, function(resp_json){
			string_articulos(resp_json);
			actualizar_burbuja_carrito();
			actualizar_burbuja_notificaciones();
		});
		*/
	}
	

// Al precionar el departamento
	$(document).on("click",".img_dep",function(){
		var temp_dep=$(this).attr('dep');
		$("#input_search_dep").val($(this).attr('dep'));
		if($(this).attr('nombre')!=null)
			$(".input_search").attr('placeholder','Buscar en '+$(this).attr('nombre'))
		if(temp_dep==0){regresar_inicio(); return;}

		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_subdepartamentos',{dep:temp_dep}, function(r){
			
				var string="<div class='contenedor_banner'>";
				string+="<div class='img_banner'><img src='img/banner"+temp_dep+".png' width='100%' class='banner_dep'></div>";
				string+="<div class='col-xs-12 btns_navegacion'><div class='col-xs-6'><a href='#' class='regresar_link back_click'>< Regresar</a></div>";
				string+="<div class='col-xs-6' style='text-align:right'><a href='#' class='ver_todo_link' dep='"+temp_dep+"'>Ver todo</a></div></div>";
				string+="<div class='contenedor_subdepartamentos'>"
				$.each(jQuery.parseJSON(r), function( i, subdep ) {
					string+="<div class='col-xs-4 img_subdep' dep='"+subdep.id_departamento+"' subdep='"+subdep.id_subdepartamento+"'><img src='img/"+subdep.id_departamento+subdep.id_subdepartamento+".png' width='100%'></div>";
				})
				string+="</div></div>";
				crecer_buscador();
				
				$("#contenedor_articulos").html(string);
				$("#contenedor_articulos").slideDown(1000);
				//$(".contenedor_subdepartamentos").html(subdeps);
				$(".banner_dep").attr('src','img/banner'+temp_dep+'.png');
		}).fail(function(error) { alert_2("Error de conexión..."); console.log(error.responseJSON); });
		});
		/*
		$(".input_search").val("");
		var dep = $(this).attr('dep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_dep',{dep:dep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
			});
		})
		*/
	})

	$(document).on("click",".img_subdep",function(){
		$(".input_search").val("");
		var subdep = $(this).attr('subdep');
		var temp_dep=$(this).attr('dep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_subdep',{subdep:subdep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
				$(".img_dep").attr('dep',temp_dep);
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		})
	})

	$(document).on("click",".ver_todo_link",function(){
		$(".input_search").val("");
		var dep = $(this).attr('dep');
		$("#contenedor_articulos").fadeOut(500,"swing",function(){	
			$.post(url_api+'get_productos_dep',{dep:dep}, function(resp_json){
				string_articulos(resp_json);
				reducir_buscador();
				$(".img_dep").attr('dep',dep);
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		})
	})

	$(document).on("click",".regresar_link",function(){
		regresar_inicio();
	})

// Al escribir en el filtro buscador
/*
	$(document).on("keyup",".input_search",function(){
		if($(this).val()==""||$(this).val().length<2){return;}
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_filtro',{desc:$(this).val(),dep:$("#input_search_dep").val()}, function(resp_json){
			reducir_buscador();
			string_articulos(resp_json);
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	})
*/
	
	$(document).on("submit","#form_buscar",function(event){
		event.preventDefault();
		if($(".input_search").val()==""||$(".input_search").val().length<3){ 
			alert_2('Por lo menos escriba 3 caracteres...'); 
			$(".input_search").focus(); 
			return;
		}
		$("#contenedor_articulos").html(loader());
		$.post(url_api+'get_productos_filtro',{desc:$(".input_search").val(),dep:$("#input_search_dep").val()}, function(resp_json){
			$(".input_search").blur();
			reducir_buscador();
			string_articulos(resp_json);
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	})

// Al presionar un articulo
	$(document).on("click",".row_articulo",function(){
		$(".sombra_menu").click();
		$("#agregarArticuloModal").modal("show");
		if($(this).attr('producto')=="01010101"){
			$(".ocultar_contenido_producto").hide();
			$(".ocultar_contenido_producto_mensaje").show();
			$(".ord_detalles").attr("rows",4);
		}else{
			$(".ocultar_contenido_producto").show();
			$(".ocultar_contenido_producto_mensaje").hide();
			$(".ord_detalles").attr("rows",2);
		}
		$(".descripcion_modal").html($(this).attr('descripcion'));

		$(".unidad_modal").html($(this).attr('unidad'));
		

		//transicion de imagen
		$(".img_modal_loader").html(loader_mini());
		$(".img_modal_loader").show();
		$(".img_prod_modal").hide();
		$(".img_prod_modal").attr('src',$(this).attr('imagen'));
		setTimeout(function() {$(".img_modal_loader").hide();$(".img_prod_modal").fadeIn(500);},1500)
		
		$(".input_orden").val(1);
		$(".check_asado").prop('checked',false);
		$(".check_asado").attr('departamento',$(this).attr('departamento'));
		$(".check_preparado_input").val(0);
		$(".check_preparado").prop('checked',false);
		$(".ord_detalles").val("");
		$(".check_asado_input").val(0);


		//datos fara formulario 
		$("#producto_modal_form").val($(this).attr('producto'));
		$("#departamento_modal_form").val($(this).attr('departamento'));
		$("#unidad_modal_form").val($(this).attr('unidad'));
		$("#precio_modal_form").val($(this).attr('precio'));
		$("#cliente_modal_form").val(sesion_local.getItem("FerbisAPP_id"));
		$("#descripcion_modal_form").val($(this).attr('descripcion'));

		$(".fyv_asado").hide(500);
		//etiquetas
		if($(this).attr('departamento')=='005'||$(this).attr('departamento')=='002'){
			$(".row_asado").show();
			if($(this).attr('unidad')=='KG'){
				$(".unidad_modal").html("<div class='col-xs-4'></div><div class='col-xs-4'>"+
				"<select name='unidad' class='form-control cambio_unidad' style='text-align-last:center;' precio_kg='"+parseFloat($(this).attr('precio')).toFixed(2)+"' precio='"+(parseFloat($(this).attr('precio'))*parseFloat($(this).attr('peso_promedio'))).toFixed(2)+"'>"+
				"<option value='KG'>KG</option>"+
				"<option value='PZA'>PZA</option>"+
				"</select></div><div class='col-xs-4'></div>");
			}
		}
		else{
			$(".row_asado").hide();
		}
		if($(this).attr('departamento')=='005'){
		$(".row_preparado").hide();
		$(".row_preparado2").show();
		}else{
			$(".row_preparado").show();
			$(".row_preparado2").hide();
		}
		if($(this).attr('departamento')=='002'){$(".contenedor_corte").show();}
		else{ $(".contenedor_corte").hide(); }
	})
	// al pesionar el texto del servicio_asado
	$(document).on("click",".servicio_asado",function(){
		$(this).parent('div').find('.div_check_asado').find('input').click();
	})
	$(document).on("change",".cambio_unidad",function(){
		$(".input_orden").val( Math.round($(".input_orden").val()) );
		$("#unidad_modal_form_e").val($(this).val());
		$("#unidad_modal_form").val($(this).val());
		if($(this).val()=="PZA"){
			$("#precio_modal_form").val($(this).attr('precio'));
			$("#precio_modal_form_e").val($(this).attr('precio'));
		}else{
			$("#precio_modal_form").val($(this).attr('precio_kg'));
			$("#precio_modal_form_e").val($(this).attr('precio_kg'));
		}
		
	})
	// al pesionar el texto del servicio_asado
	$(document).on("click",".servicio_preparado",function(){
		$(this).parent('div').find('.div_check_preparado').find('input').click();
	})
	//actualizacion de input de asado
	$(document).on('change',".check_asado",function(){
		if($(this).is(":checked")){
			$(".check_asado_input").val(1);
			$(".select_termino").val('B/A');
			if($(this).attr("departamento")=='002'){
				$(".fyv_asado").show(500);
			}
		}
		else{
			$(".check_asado_input").val(0); 
			$(".fyv_asado").hide(500);
		}
	})
	//actualizacion de input de asado
	$(document).on('change',".check_preparado",function(){
		if($(this).is(":checked")){$(".check_preparado_input").val(1);}
		else{$(".check_preparado_input").val(0);}
	})
	
// Al precional el boton de mas producto
	$(document).on("click",".ord_mas",function(){
		if($(".cambio_unidad").val()!='KG'){
			$(".input_orden").val(parseInt($(".input_orden").val())+1);
		}else{
			$(".input_orden").val(parseFloat($(".input_orden").val())+0.5);
		}
	})
// Al precional el boton de menos producto
	$(document).on("click",".ord_menos",function(){
		//
		if($(".cambio_unidad").val()!='KG'){
			if($(".input_orden").val()>1)
				$(".input_orden").val(parseInt($(".input_orden").val())-1);
		}else{
			if($(".input_orden").val()>0.5)
				$(".input_orden").val(parseFloat($(".input_orden").val())-0.5);
		}

	})
	// evitar que manualmente pongan 0 o negativos
	$(".input_orden").change(function(){
		if($(".cambio_unidad").val()!='KG'){
			$(".input_orden").val(parseInt($(".input_orden").val()));
			if($(".input_orden").val()<=0)
				$(".input_orden").val(1);
		}else{
			if($(".input_orden").val()<=0)
				$(".input_orden").val(0.5);
		}
	})
// Al precional el input de cantidad
	$(document).on("click",".input_orden",function(){
		$(this).select();
	})

//functiones para abrir menu lateral
	$(document).on("click",".abrir_menu_lateral",function(){
		$(".contenedor_menu_lateral_izq").show(300);
	})
	$(document).on("click",".abrir_menu_lateral_der",function(){
		$(".contenedor_menu_lateral_der").show(300);
		$(".div_procesar_pedido").hide();
		$(".contenido_carrito").html(loader());
		$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			$(".cant_carrito").html(jQuery.parseJSON(r).length);
			$(".contenido_carrito").hide();
			if(jQuery.parseJSON(r).length>0){
				$(".div_procesar_pedido").fadeIn(500);
				$(".contenido_carrito").html(string_carrito(r));
				$(".contenido_carrito").fadeIn(500);
			}else{	
				$(".contenido_carrito").html("<div class='carrito_vacio'>Carrito vacío</div>");
				$(".div_procesar_pedido").hide();

/*
				$(".articulo_carrito_drag").draggable({ axis: "x",revert: true,stop: function( event, ui ) {
					var distancia=Math.min( 100, ui.position.left );
			       console.log($(this).find('a').attr('class'));
			       if(distancia>=100||distancia<=-100){
			       		if(confirm("¿Está seguro que desea remover el artículo de carrito?")){
			       			$(this).remove();
			       			$(".sombra_menu").click();
			       			var id_carrito_det=$(this).find('a').attr("id_carrito_det");
							$.post(url_api+'remover_carrito',{id_carrito_det:id_carrito_det},function(r){
								actualizar_burbuja_carrito();
								actualizar_burbuja_notificaciones();
								$(".abrir_menu_lateral_der").click();
							}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
			       		}
			       }
			      }	});
*/

			}
			var total_aprox=0;
			$(".articulo_carrito").each(function() {total_aprox+=parseFloat($(this).attr('cantidad'))*parseFloat($(this).attr('precio'));});
			$(".total_pedido").html(parseFloat(total_aprox).toFixed(2));
			if(parseFloat(total_aprox)==0){$(".btn_realizar_pedido").attr("disabled",true);}
			else{$(".btn_realizar_pedido").removeAttr('disabled');}
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	})
	$(document).on("click",".sombra_menu",function(){
		$(".contenedor_menu_lateral_izq").hide();
		$(".contenedor_menu_lateral_der").hide();
	})

//funcion alta de producto al carrito
$(document).on("click",".agregar_al_carrito_btn",function(){
	$("#agregarArticuloModal").modal("hide");
	$.post(url_api+'agregar_producto_pedido_activo',$("#form_alta_carrito").serialize(),function(r){
		if(r>0){
			notificacion("Producto agregado a su carrito");
			actualizar_burbuja_carrito();
			actualizar_burbuja_notificaciones();
			$('.sombra_menu').click();
		}else{
			notificacion("Error");
		}
	}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
})

//funcion para abrir modal de edicion deun pedido
$(document).on("click",".articulo_carrito",function(){
	$('.sombra_menu').click();
	$("#editarArticuloModal").modal("show");
	if($(this).attr('producto')=="01010101"){
			$(".ocultar_contenido_producto").hide();
			$(".ocultar_contenido_producto_mensaje").show();
			$(".ord_detalles").attr("rows",4);
	}else{
			$(".ocultar_contenido_producto").show();
			$(".ocultar_contenido_producto_mensaje").hide();
			$(".ord_detalles").attr("rows",2);
	}

	//transicion de imagen
	$(".img_modal_loader_e").html(loader_mini());
	$(".img_modal_loader_e").show();
	$(".img_prod_modal_e").hide();
	$(".img_prod_modal_e").attr('src',$(this).attr('imagen'));
	setTimeout(function() {$(".img_modal_loader_e").hide();$(".img_prod_modal_e").show();},1500)

	$(".descripcion_modal_e").html($(this).attr('descripcion'));
	$(".unidad_modal_e").html($(this).attr('unidad'));
	$(".input_orden").val(parseFloat($(this).attr('cantidad')).toFixed(2));
	$(".check_asado").prop('checked',false);
	$(".check_preparado").prop('checked',false);
	$(".check_asado").attr('departamento',$(this).attr('departamento'));
	if($(this).attr('asado')=='1'){$(".fyv_asado").show();$(".check_asado").prop('checked',true);}
	if($(this).attr('preparado')=='1'){$(".check_preparado").prop('checked',true);}
	$(".ord_detalles").val($(this).attr('detalles'));
	$(".check_asado_input").val($(this).attr('asado'));
	$(".check_preparado_input").val($(this).attr('preparado'));
	$(".select_termino").val($(this).attr('termino'));
	$(".select_corte").val($(this).attr('corte'));

	//datos fara formulario 
	$("#producto_carrito_modal_form_e").val($(this).attr('id_carrito_det'));
	$("#producto_modal_form_e").val($(this).attr('producto'));
	$("#departamento_modal_form_e").val($(this).attr('departamento'));
	$("#unidad_modal_form_e").val($(this).attr('unidad'));
	$("#precio_modal_form_e").val($(this).attr('precio'));
	$("#cliente_modal_form_e").val(sesion_local.getItem("FerbisAPP_id"));
	$("#descripcion_modal_form_e").val($(this).attr('descripcion'));
	$(".contenedor_menu_lateral_der").hide(300);
	

	if($(this).attr('departamento')=='005'||$(this).attr('departamento')=='002'){
		var precio_kg=parseFloat($(this).attr('precio')).toFixed(2);
		var precio_pza=(parseFloat($(this).attr('precio'))*parseFloat($(this).attr('peso_promedio'))).toFixed(2);
		if($(this).attr('unidad')=='PZA'){
			precio_kg=(parseFloat($(this).attr('precio'))/parseFloat($(this).attr('peso_promedio'))).toFixed(2);
			precio_pza=parseFloat($(this).attr('precio')).toFixed(2);
		}


		$(".row_asado").show();
		$(".unidad_modal_e").html("<div class='col-xs-4'></div><div class='col-xs-4'>"+
			"<select name='unidad' class='form-control cambio_unidad' style='text-align-last:center;' precio_kg='"+precio_kg+"' precio='"+precio_pza+"'>"+
			"<option value='KG'>KG</option>"+
			"<option value='PZA'>PZA</option>"+
			"</select></div><div class='col-xs-4'></div>");
		console.log($(this).attr('unidad'));
		$(".cambio_unidad").val($(this).attr('unidad'));
			
	}else{
		$(".row_asado").hide();
	}
	if($(this).attr('departamento')=='005'){
		$(".row_preparado").hide();
		$(".row_preparado2").show();
	}else{
		$(".row_preparado").show();
		$(".row_preparado2").hide();
	}
	if($(this).attr('departamento')=='002'){$(".contenedor_corte").show();}
	else{ $(".contenedor_corte").hide(); }
})

//funcion para agregar otro producto que no se encontro en el catalogo
$(document).on("click",".btn_otro_pedido", function(){
	$("#otroArticuloModal").modal("show");
})


//funcion para eliminar producto del carrito
$(document).on("click",".btn_modal_borrar_e", function(){
	confirm_2("¿ Está seguro que desea remover el artículo de carrito ?",function (){
		var id_carrito_det=$("#producto_carrito_modal_form_e").val();
		$("#editarArticuloModal").modal("hide");
		$.post(url_api+'remover_carrito',{id_carrito_det:id_carrito_det},function(r){
			actualizar_burbuja_carrito();
			actualizar_burbuja_notificaciones();
			notificacion("Artículo removido del carrito");
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	})
})

//funcion para guardar cambios de la edicion del pedido
$(document).on("click",".btn_modal_guardar_e", function(){
	$("#editarArticuloModal").modal("hide");
	$.post(url_api+'editar_carrito',$("#form_editar_carrito").serialize(),function(r){
		notificacion("Artículo del pedido actualizado");
		$('.sombra_menu').click();
	}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
})

// Funcion para mostrar los articulos de la busqueda
	function string_articulos(string_json){
		var string_ret="";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			// se utiliza puntuacion para la imagen
			string_ret+="<div class='row row_articulo' "+
							"producto='"+prod.producto+"' "+
							"departamento='"+prod.departamento+"' "+
							"descripcion='"+capitalize(prod.descripcion)+"' "+
							"unidad='"+prod.unidad+"' "+
							"imagen='"+prod.puntuacion+"' "+
							"peso_promedio='"+prod.peso_promedio+"' "+
							"precio='"+prod.precio+"' "+
							">"+
			  				"<div class='col-xs-12 articulo'><div class='col-xs-4 cont_imagen_articulo' style='height:120px;'>"+
			  				"<div class='art_img' imagen='"+prod.puntuacion+"'></div>"+
			  				"</div><div class='col-xs-8 articulo_desc'>"+
			  				"<div class='art_desc'>"+capitalize(prod.descripcion)+"</div>"+
			  				"<div class='art_um'>$"+parseFloat(prod.precio).toFixed(2)+" "+prod.unidad+"</div>"+
			  				"<div class='btn_agregar'><button class='btn btn-default btn-md btn_agragar'><i class='fa fa-cart-plus'></i></button></div>"+
			  				"</div></div></div>";
		});
		//agregamos al contenedor
		$("#contenedor_articulos").hide();
		$("#contenedor_articulos").html(string_ret);
		$("#contenedor_articulos").slideDown(1000);

		$(".art_img").html(loader_mini());
		/*
		$(".art_img").each(function(index, el) {
			$(el).html("<img src='"+$(el).parent("div").parent("div").parent("div").attr('imagen')+"' class='img_art'>");
			$(el).fadeIn(150);

		})*/
		
		$(".art_img").each(function(index, el) {
			setTimeout(function() {
				$(el).fadeOut(150,function(){
					$(el).html("<img src='"+$(el).attr('imagen')+"' class='img_art'>");
					setTimeout(function() {$(el).fadeIn(500);},150);
					
				});
			},300*index);

		});
/*
		$(".art_img").hide();setTimeout(function() {
			

		}, 1000);
*/
	}
	function string_carrito(string_json){
		var string_ret="";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			// se utiliza puntuacion para la imagen
			var total=0;
			var unidad="";
			var descripcion=prod.descripcion; if(prod.producto=="01010101"){ 
				descripcion=prod.detalles;
				prod.unidad="-";
				prod.precio="0";
				total="";
			}else{
				unidad=parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad;
				total=parseFloat(prod.cantidad*prod.precio).toFixed(2);
			}
			if(total=="0.00"){total="";}
			var asado=""; if(prod.asado=='1'){ asado='<i class="fa fa-fire ico_asado" aria-hidden="true"></i>';}

			string_ret+="<div class='articulo_carrito_drag'><a href='#' class='articulo_carrito' "+
							"id_carrito_det='"+prod.id_carrito_det+"' "+
							"producto='"+prod.producto+"' "+
							"departamento='"+prod.departamento+"' "+
							"cantidad='"+prod.cantidad+"' "+
							"asado='"+prod.asado+"' "+
							"preparado='"+prod.preparado+"' "+
							"termino='"+prod.termino+"' "+
							"corte='"+prod.corte+"' "+
							"descripcion='"+capitalize(prod.descripcion)+"' "+
							"unidad='"+prod.unidad+"' "+
							"detalles='"+prod.detalles+"' "+
							"imagen='"+prod.puntuacion+"' "+
							"peso_promedio='"+prod.peso_promedio+"' "+
							"precio='"+prod.precio+"' >";

			  	string_ret+="<div class='col-xs-2 car_cantidad'>"+unidad+"</b></div>"+
			  				"<div class='col-xs-8 car_desc'>"+asado+" "+capitalize(descripcion)+"</div>"+
			  				"<div class='col-xs-2 car_importe'>"+total+"</div>"+
			  				"</a></div>";
		});
		return string_ret;
	}
});//fin

// alerta global
function notificacion(mensaje){
	$(".alerta_multiusos").html(mensaje);
	$(".alerta_multiusos").fadeIn(200);
	setTimeout(function() {$(".alerta_multiusos").fadeOut(200);}, 3000);
}

//funcion que actualiza la cantidad de productos en el carrito de compras
function actualizar_burbuja_carrito(){
	$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
		var productos_carrito = jQuery.parseJSON(r).length;
		if(productos_carrito>0){
			$(".mini_burbuja").html(productos_carrito);
			$(".mini_burbuja").fadeIn(100);
		}else{
			$(".mini_burbuja").fadeOut(100);
		}
	}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
}

//funcion que actualiza la burbuja de notificaciones
function actualizar_burbuja_notificaciones(){
	$.post(url_api+'get_num_notificaciones',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
		if(parseInt(r)>0){
			$(".mini_burbuja_notificaciones").html(r);
			$(".mini_burbuja_notificaciones").show(100);
		}else{
			$(".mini_burbuja_notificaciones").hide(100);
		}
	}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
}

// loader global
function loader(){
		return '<div style="text-align:center;padding-top:100px;color:#BCBCBC;"><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i><span class="sr-only"></span></div>';
}
function loader_mini(){
		return '<div style="height: 120px;display: flex;align-items: center;justify-content: center; color:#BCBCBC;"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only"></span></div>';
}

function diaSemana(){
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f=new Date();
	alert_2(diasSemana[f.getDay()]);   
}
function capitalize(texto) {
	texto = texto.toLowerCase();
  return texto[0].toUpperCase() + texto.slice(1);
}
function crecer_buscador(){
	$(".menu_buscar").find(".col-xs-2").hide(500,function(){
		$(".menu_buscar").find(".col-xs-10").addClass('col-xs-12');
		$(".menu_buscar").find(".col-xs-10").removeClass('col-xs-10');
		$('#contenedor_articulos').scrollTop(0);
		$(".input_search").val("");
		$(".producto_no_encontrado").fadeOut(500);
	});
	
}
function reducir_buscador(){
	$(".menu_buscar").find(".col-xs-2").show(500);
	$(".menu_buscar").find(".col-xs-12").addClass('col-xs-10');
	$(".menu_buscar").find(".col-xs-12").removeClass('col-xs-12');
	$('#contenedor_articulos').scrollTop(0);
	$(".producto_no_encontrado").fadeIn(100);
}
function regresar_inicio(){
	location.reload();
	/*
	$("#contenedor_articulos").fadeOut(500,"swing",function(){
		$.post(path_+'/contenido/banner.html', function(resp_json){
			$("#contenedor_articulos").html(resp_json);
			$("#contenedor_articulos").slideDown(500,function(){

			});
			crecer_buscador();
		})
	});
	*/
}


/* inhabilitar boton de regreso */
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(e) {
  	e.preventDefault();
  	$( ".regresar_link_e" ).click();
  	var final=false;
  	$( ".ini_" ).each(function( index ) {final=true;});
  	if(final){cerrar_app();}
  	else{
  		var existe_link=false;
  		$( ".regresar_link" ).each(function( index ) {existe_link=true;});
  		if(existe_link){
  			$( ".regresar_link" ).click();
  		}else{
  			$(".regresar_banner").click();
  		}
  	}
}

function cerrar_app(){
	if (navigator.app) {navigator.app.exitApp();}
	else if (navigator.device) { navigator.device.exitApp();}
	else {window.close();}
}

function alert_2(mensaje){
	$("#Modal_alerta_mensaje").html(mensaje);
	$("#Modal_alerta").modal("show");
}

function confirm_2(mensaje, funcionSI) {
	console.log("confirm");
    $("#Modal_confirm_mensaje").html(mensaje);
    $("#Modal_confirm").modal("show");

    $('#btnYes').off("click").click(function() {
       $("#Modal_confirm").modal("hide");
       funcionSI();
    });
    $('#btnNo').off("click").click(function() {
        $("#Modal_confirm").modal("hide");
    });
    
}
