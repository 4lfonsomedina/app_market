$(document).ready(function() {

var tipo_alta=0;

	$(document).on("click",".btn_alta_tarjeta",function(){
		$("#form_nueva_tarjeta :input").val("");
		$(".btn_guardar_tarjeta").attr('tipo',$(this).attr('tipo'));
		$("#modal_alta_tarjeta").modal("show");

	})

	$(document).on("click",".btn_guardar_tarjeta",function(){
		tipo_alta = $(this).attr('tipo');
		$("#t_i_c").val(sesion_local.getItem("FerbisAPP_id"));
		var datos_t = $("#form_nueva_tarjeta :input").serialize();
		var datos_a = $("#form_nueva_tarjeta :input").serializeArray();
		if(datos_a[1].value.length<16||datos_a[2].value.length<2||datos_a[3].value.length<2){
			alert_2("Datos de tarjeta incorrectos<br> por favor verifica la informacion");
		}else{
			$.post(url_api+'alta_tarjeta', datos_t , function(r) {
				$("#modal_alta_tarjeta").modal("hide");
				notificacion("Tarjeta registrada");
				get_t(tipo_alta);
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		}
	})
	$(document).on("click",".borrar_ttt",function(){
		var id_t = $(this).find("a").attr("id_opc3");
		confirm_2("¿ Esta seguro de que desea borrar esta tarjeta ?",function (){
			$.post(url_api+'baja_tarjeta', {id_t:id_t} , function(r) {
				notificacion("Tarjeta retirada");
				get_t(1);
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		});
	})

	$(document).on("click",".pago_tarjeta_seleccion",function(){
		$("#cvCode").val("");
		$(".btn_realizar_pago").removeClass('disabled');
		$(".btn_realizar_pago_regresar").removeClass('disabled');
		$(".btn_realizar_pago").html('Realizar Pago');
		$("#Modal_procesar_cobro").modal({backdrop: 'static', keyboard: false});
		$("#procesar_pago_total").html($(".boton_procesar_pago").attr('total'));
		$("#proceso_pago_num_tarjeta").html($(this).attr("texto"));
		$(".boton_procesar_pago").attr('id_tar',$(this).attr("id_opc3"));
		setTimeout(function() {
			$("#cvCode").select();
		}, 1000);
	})

	$(document).on("click",".btn_realizar_pago",function(){
		if($("#cvCode").val().length<3){
			alert_2("CVV erroneo!");
			return false;
		}

		//envio de cobro
		$(this).addClass('disabled');
		$(".btn_realizar_pago_regresar").addClass('disabled');
		$(this).html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>');
		$.post(url_api+'pago_tarjeta', 
			//datos de tarjeta
			{
				id_pedido: $(".boton_procesar_pago").attr('pedido'),
				id_tarjeta:$(".boton_procesar_pago").attr('id_tar'),
				cvv:$("#cvCode").val(),
				importe:$(".boton_procesar_pago").attr('total')
			} , 
			function(r) {
				r = jQuery.parseJSON(r);
				confirm_tarjeta(r.mensaje, r.codigo);
			}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
		
	})





});

function confirm_tarjeta(mensaje, codigo) {
	console.log("confirm");
    
    

    if(codigo==0){
    	mensaje = '<i style="color:red" class="fa fa-times fa-3x" aria-hidden="true"></i><br>'+mensaje;
    	$("#btnOperacionRechazada").show();
    	$("#btnOperacionAprovada").hide();
    }
    if(codigo==1){
    	mensaje = '<i style="color:green" class="fa fa-check fa-3x" aria-hidden="true"></i><br>'+mensaje;
    	$("#btnOperacionAprovada").show();
    	$("#btnOperacionRechazada").hide();
    }

    $("#Modal_respuesta_tarjeta_mensaje").html(mensaje);
    $("#Modal_respuesta_tarjeta").modal({backdrop: 'static', keyboard: false});
    $('#btnOperacionAprovada').off("click").click(function() {
       $("#Modal_confirm").modal("hide");
       location.reload();
    });
    $('#btnOperacionRechazada').off("click").click(function() {
    	$("#Modal_respuesta_tarjeta").modal("hide");
        $("#Modal_procesar_cobro").modal("hide");
        $("#Modal_pago_con_tarjeta").modal("hide");
    });
    
}


function get_t(tipo){
		$.post(url_api+'get_t', {id:sesion_local.getItem("FerbisAPP_id")}, function(r) {
			var trs = "";
			$.each(jQuery.parseJSON(r), function( i, ttt ){
				console.log(tipo);
				if(tipo==1){
				trs+=
				'<div class="row pago_tarjeta_seleccion_row">'+
            			'<div class="col-xs-10"> XXXX XXXX XXXX '+ttt.valor+'</div>'+
            			'<div class="borrar_ttt col-xs-2">'+
            				'<a id_opc3="'+ttt.id_opc3+'"><i class="fa fa-trash" aria-hidden="true"></i></a>'+
            			'</div>'+
            	'</div>';
          		}
          		if(tipo==2){
				trs+='<a class="pago_tarjeta_seleccion" id_opc3="'+ttt.id_opc3+'" texto="XXXX XXXX XXXX '+ttt.valor+'">'+
						'<div class="row pago_tarjeta_seleccion_row">'+
						'<div class="col-xs-2" style="font-weight:bold; text-align:right"><i class="fa fa-credit-card fa-2x" aria-hidden="true"></i></div>'+
            			'<div class="col-xs-10" style="text-align:center; font-size:15px;">XXXX XXXX XXXX '+ttt.valor+'</div>'+
            			'</div>'+
          			'</a>';
          		}
          		
			})
			trs+="<a href='#' class='btn btn-primary btn_alta_tarjeta' style='padding: 8px 14px;border-radius: 15px; width: 100%' tipo='2'>"+
                          "Agregar Nueva Tarjeta <i class='fa fa-plus' aria-hidden='true' ></i></a>"+
                    "</a><br>";
			$(".tabla_ttt").html(trs);
		}).fail(function(error) { alert_2("Error de conexión...");  console.log(error.responseJSON); });
	}
