function cargar_datos() {
	$.post(url_api+'datos_cuenta',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
		var cuenta = jQuery.parseJSON(r);
		$(".cuenta_id_cliente").val(cuenta.id_cliente);
		$(".cuenta_lat").val(cuenta.lat);
		$(".cuenta_lon").val(cuenta.lon);
		$(".cuenta_nombre").val(cuenta.nombre);
		$(".cuenta_telefono").val(cuenta.telefono);
		$(".cuenta_correo").val(cuenta.correo);
		$(".cuenta_numero").val(cuenta.numero);
		$(".cuenta_colonia").val(cuenta.dir_colonia);
		$(".cuenta_calle").val(cuenta.dir_calle);
		$(".cuenta_num").val(cuenta.dir_numero1);
		$(".cuenta_num2").val(cuenta.dir_numero2);
		$(".cuenta_referencia").val(cuenta.referencia);
		$("input:radio[name=servicio]").each(function(){if($(this).val()==cuenta.servicio){$(this).prop("checked", true);}});
		$("input:radio[name=pago]").each(function(){if($(this).val()==cuenta.pago){$(this).prop("checked", true);}});

		$(".resumen_direccion").html(cuenta.dir_calle+", "+cuenta.dir_numero1+" "+cuenta.dir_numero2+", "+cuenta.dir_colonia);

		verificar_ubicacion();
		mostrar_tabla();
	})
}

//al cambiar la fecha de entrega
$("#fecha_pedido").change(function(){
	calcular_envio($(".pedido_id_sucursal").val());
})

$(document).on("click",".btn_guardar_direccion",function(){
	$(".resumen_direccion").html($(".cuenta_calle").val()+", "+$(".cuenta_num").val()+" "+$(".cuenta_num2").val()+", "+$(".cuenta_colonia").val());
	verificar_ubicacion();
})
function verificar_ubicacion(){
	if($(".cuenta_calle").val()!=""&&$(".cuenta_num").val()!=""&&$(".cuenta_colonia").val()!=""){
		var direccion=	$(".cuenta_calle").val()+", "+$(".cuenta_num").val()+", "+$(".cuenta_colonia").val()+", Mexicali, BC";
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': direccion}, function(results, status) {
			$(".cuenta_lat").val(results[0].geometry.location.lat);
			$(".cuenta_lon").val(results[0].geometry.location.lng);
			sucursal_cercana();
		});
	}
}
function sucursal_cercana(){
	reset_fecha();
	if($(".cuenta_lat").val()!=""&&$(".cuenta_lon").val()!="")
		$.post(url_api+'sucursal_cercana',{lat:$(".cuenta_lat").val(),lon:$(".cuenta_lon").val()},function(r){
			var sucursal = jQuery.parseJSON(r);
			$(".sucursal_cercana").html(sucursal.sucursal);
			$(".sucursal_distancia").html(sucursal.distancia+"km");
			$(".sucursal_distancia_input").val(sucursal.distancia);
			$(".pedido_id_sucursal").val(sucursal.id_sucursal);
			$(".pedido_sucursal").val(sucursal.sucursal);
		})
}
function mostrar_tabla(){
	if(parseFloat($('.pedido_total').html())<200&&$('input:radio[name=servicio]:checked').val()==1){
		alert_2("El total del pedido no alcanza el mínimo de $200.00 para el servicio de envío a domicilio");
		$('#scheck2').click();
		return;
	}
	if($('input:radio[name=servicio]:checked').val()==1){
		$(".tabla_cuenta_recoger").fadeOut(0);
		$(".tabla_cuenta").fadeIn(500);
		$(".contenedor_tipo_pago").show();
		$(".pedido_envio").show();
	}
	if($('input:radio[name=servicio]:checked').val()==2){
		$(".tabla_cuenta").fadeOut(0);
		$(".tabla_cuenta_recoger").fadeIn(500);
		$(".contenedor_tipo_pago").hide();
		$(".pedido_envio").hide();
		$(".pedido_sucursal").val($(".tabla_cuenta_recoger").val());
		$(".pedido_id_sucursal").val($(".recoger_sucursal").val());
		$(".pedido_sucursal").val($(".recoger_sucursal").children("option:selected").html());

	}
	//mostrar_tabla_pago();
}

$(".recoger_sucursal").change(function() {
	$(".pedido_id_sucursal").val($(this).val());
	$(".pedido_sucursal").val($(this).children("option:selected").html());
	reset_fecha();
});

$(document).on("click",".panel_direccion",function(){
	$("#modal_direccion").modal({backdrop: 'static', keyboard: false});
})

function reset_fecha(){
	$("#fecha_pedido").val("");
	$("#select_horas_disponibles").html("");
}
function mostrar_tabla_pago(){
	if($('input:radio[name=pago]:checked').val()==1){
		$(".tabla_pago").fadeIn(500);
	}else{
		$(".tabla_pago").fadeOut(500);
	}
}


$(document).on("click",".btn_enviar_pedido",function(){
	/*
	validaciones:
	1 - Nunca debe de faltar el nombre ni el telefono
	2 - Si es a domicilio no falten colonia, calle, numero1
	*/
	// 1 - Nunca debe de faltar el nombre ni el telefono
	if($(".cuenta_nombre").val()==''){
		alert_2('Es necesario capturar su nombre');
		$(".li_paso2 > a").click();
		return;
	}
	if($(".cuenta_telefono").val()==''){
		alert_2('Es necesario capturar su telefono para comunicarnos con usted cuando su pedido este listo');
		$(".li_paso2 > a").click();
		return;
	}
	if($("#fecha_pedido").val()==''){
		alert_2('Es necesario capturar la fecha del pedido');
		$(".li_paso1 > a").click();
		return;
	}
	if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_colonia").val()==''){
		alert_2('Es necesario capturar su colonia');
		$(".li_paso1 > a").click();
		return;
	}
	if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_calle").val()==''){
		alert_2('Es necesario capturar la calle de su domicilio');
		$(".li_paso1 > a").click();
		return;
	}
	if($('input:radio[name=servicio]:checked').val()==1&&$(".cuenta_num").val()==''){
		alert_2('Es necesario capturar el numero de su domicilio');
		$(".li_paso1 > a").click();
		return;
	}
	$( ".btn_enviar_pedido" ).prop( "disabled", true );
	
	//verificar fecha programada
	$("#select_horas_disponibles").val();
	$.post(url_api+'verificar_horario',{fecha:$("#fecha_pedido").val()+" "+$("#select_horas_disponibles").val()},function(r){
		if(r=='1'){
			setTimeout(function() {
				$.post(url_api+'alta_pedido',$("#pedido_form").serialize(),function(r){
					console.log(r);
					$(".entrega_pedido_mensaje").html($("#fecha_pedido").val()+" "+formato_12hrs($("#select_horas_disponibles").val()));
					$('#modal_pedido_enviado').modal({backdrop: 'static', keyboard: false});
				})
			}, 1000);
		}else{
			alert_2(r);
			$( ".btn_enviar_pedido" ).prop( "disabled", false );
			$("#fecha_pedido").val("");
			$("#select_horas_disponibles").html("");
			$(".li_paso1 > a").click();
		}
	});
	
	//console.log($("#pedido_form").serializeArray());
})

//envio finalizado
$(document).on("click",".btn_aceptar",function(){
	closeBrowser();
})

$(document).on("click",".li_paso",function(){
	$(".btn_paso").hide();
	$(".btn_paso_"+$(this).attr('paso')).show();
	actualizar_paso3();
	mostrar_tabla();
})
$(document).on("click",".btn_paso",function(){
	$(".li_paso"+$(this).attr('paso')+" > a").click();
	actualizar_paso3();
	mostrar_tabla();
})

function actualizar_paso3(){
	var pedido = objectifyForm($("#pedido_form").serializeArray());
	$(".p3_nombre").html(pedido.nombre);
	$(".p3_telefono").html(pedido.telefono);
	$(".p3_frecuente").html(pedido.numero);
	var servicio = "A domicilio"; if(pedido.servicio!=1){ servicio = "Paso por el"; }
	$(".p3_servicio").html(servicio+" <b>"+$("#fecha_pedido").val()+" "+formato_12hrs($("#select_horas_disponibles").val())+"</b>");
	$(".p3_direccion").html(pedido.dir_calle+" "+pedido.dir_numero1+" "+pedido.dir_numero1+","+pedido.dir_colonia);
	$(".p3_referencia").html(pedido.referencia);
}


$.post(url_api+'get_carrito_activo',{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
	var productos_carrito = jQuery.parseJSON(r);
	$('.pedido_articulos').html(productos_carrito.length);
	$('.pedido_articulos_input').val(productos_carrito.length);
	$(".pedido_id_carrito").val(productos_carrito[0].id_carrito);
	var total=0;
	$.each(productos_carrito, function( i, prod ) {
		total+=parseFloat(prod.cantidad)*parseFloat(prod.precio);
	});
	$('.pedido_total').html(parseFloat(total).toFixed(2));
	$('.pedido_total_input').val(parseFloat(total).toFixed(2));
	mostrar_tabla();
	$(".contenedor_resumen_pedido").html(string_carrito(r));
});


function objectifyForm(formArray) {//serialize data function
	var returnArray = {};for (var i = 0; i < formArray.length; i++){returnArray[formArray[i]['name']] = formArray[i]['value'];}
	return returnArray;
}
		
$(document).on("click",".pedido_radio",function(){ reset_fecha(); mostrar_tabla();})
		
function string_carrito(string_json){
	var string_ret="";
	$.each(jQuery.parseJSON(string_json), function( i, prod ) {

		var total=0;
		var descripcion=prod.descripcion; if(prod.producto=="01010101"){ 
			descripcion=prod.detalles;
			prod.unidad="-";
			prod.precio="0";
			total="";
		}else{
			prod.unidad=parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad;
			total=parseFloat(prod.cantidad*prod.precio).toFixed(2);
		}
		if(total=="0.00"){total="";}
		var asado=""; if(prod.asado=='1'){ asado='<i class="fa fa-fire ico_asado" aria-hidden="true"></i>';}
		string_ret+="<a href='#' class='articulo_carrito' "+
		"id_carrito_det='"+prod.id_carrito_det+"' "+
		"producto='"+prod.producto+"' "+
		"departamento='"+prod.departamento+"' "+
		"cantidad='"+prod.cantidad+"' "+
		"asado='"+prod.asado+"' "+
		"termino='"+prod.termino+"' "+
		"descripcion='"+capitalize(prod.descripcion)+"' "+
		"unidad='"+prod.unidad+"' "+
		"detalles='"+prod.detalles+"' "+
		"imagen='"+prod.puntuacion+"' "+
		"precio='"+prod.precio+"' >";

		string_ret+="<div class='col-xs-2 car_cantidad'>"+prod.unidad+"</b></div>"+
		"<div class='col-xs-8 car_desc'>"+asado+" "+capitalize(descripcion)+"</div>"+
		"<div class='col-xs-2 car_importe'>"+total+"</div>"+
		"</a>";
	});
	return string_ret;
}

function calcular_envio(id_sucursal){
	if($("#fecha_pedido").val()==""){return;}
	//contamos los asados
	var asados = 0;
	$(".articulo_carrito").each(function(index, el) {if($(this).attr('asado')==1){asados++;}});
	//verificar el horario disponible
	$.post(url_api+"calcular_hora_entrega2",{dia:$("#fecha_pedido").val(),id_sucursal:id_sucursal,asado:asados},function(r){
		//verificamos si es un json
		$("#select_horas_disponibles").html("");
		try{var horarios = jQuery.parseJSON(r);}
		catch(err){
			$("#fecha_pedido").val("");
			alert_2(r); 
			return;}
		//llenamos el select
		
		$.each(horarios, function( i, pedido ){
			if(pedido.disponible=='s'){
				$("#select_horas_disponibles").append("<option value='"+pedido.hora+":00'>"+pedido.hora_nice+"</option>");
			}
		})
		$.each(horarios, function( i, pedido ){
			if(pedido.disponible=='s'){
				$("#fecha_pedido").val(pedido.fecha);
				$("#select_horas_disponibles").val(pedido.hora+":00");
				return false;
			}
		})
	})
}
function formato_12hrs(hora){
	if(hora==null){return "";}
	hora_array=hora.split(':');
	hora=hora_array[0];

	var ampm='am';
	if(hora>11){
		ampm='pm';
		hora=hora-12;
	}
	if(hora==0){hora=12;}
	return hora+":"+hora_array[1]+ampm;
}