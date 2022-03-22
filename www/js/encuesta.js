function verificacion_encuesta(id_cliente){
	$("#id_cliente_encuesta").val(id_cliente);
	$.post(url_api+'realizar_encuesta2', {id: sesion_local.getItem("FerbisAPP_id")}, function(r) {
		if(r=='1'){
			actualizar_botones_encuesta1();
			$("#Modal_encuesta").modal('show');
		}
	});
}


$(document).ready(function() {


	$(".iniciar_encuesta1").click(function() {
		$("#Modal_encuesta").modal('hide');
		$("#Modal_encuesta_1").modal({backdrop: 'static', keyboard: false});
	});
	//botones de siguiente
	$(".enc_btn_siguiente").click(function() {
		var activo = 1;
		$(".encuesta1").each(function() {
			if($(this).attr('activo')=='1'){
				activo = parseInt($(this).attr('consecutivo'))+1;
				$(".encuesta1").attr('activo','0');
				 return false;
			}
		})
		$(".encuesta1").each(function() {
			if($(this).attr('consecutivo')==activo){
				$(this).attr('activo','1');
				 return false;
			}
		})
		actualizar_botones_encuesta1();
	});

	$(".enc_btn_anterior").click(function() {
		var activo = 1;
		$(".encuesta1").each(function() {
			if($(this).attr('activo')=='1'){
				activo = parseInt($(this).attr('consecutivo'))-1;
				$(".encuesta1").attr('activo','0');
				 return false;
			}
		})
		$(".encuesta1").each(function() {
			if($(this).attr('consecutivo')==activo){
				$(this).attr('activo','1');
				 return false;
			}
		})
		actualizar_botones_encuesta1();
	});
	$(".enc_btn_finalizar").click(function() {
		$.post(url_api+'guardar_encuesta', $("#contenedor_encuesta").serialize(), function(r) {
		});
		$(".encuesta1").hide();
		$(".enc_btn_anterior").parent('div').hide();
		$(".enc_btn_siguiente").parent('div').hide();
		$(".enc_btn_finalizar").parent('div').hide();
		$(".enc_btn_regresar").parent('div').show();

		$(".encuesta_gracias").show();
		
	});

	

	//funcion de estrellas
	$(".td_star").click(function(){
		var valor = $(this).find('i').attr('valor');
		var pregunta = $(this).find('i').attr('pregunta');
		var check = $(this).find("input");
		$(this).parent('tr').parent('tbody').parent('table').parent('div').find('input').val(valor);
		$(".estrella_check").each(function(){
			if($(this).attr('pregunta')==pregunta){
				if($(this).attr('valor')<=valor){
					$(this).removeClass('fa-star-o');
					$(this).addClass('fa-star');
				}else{
					$(this).removeClass('fa-star');
					$(this).addClass('fa-star-o');
				}
			}
		});
	})
});





function actualizar_botones_encuesta1(){
		var btn_anterior = $(".enc_btn_anterior").parent('div');
		var btn_siguiente = $(".enc_btn_siguiente").parent('div');
		var btn_finalizar = $(".enc_btn_finalizar").parent('div');
		$(".encuesta1").each(function(){
			var encuesta_c = $(this).attr('consecutivo');
			var encuesta_a = $(this).attr('activo');
			
			if(encuesta_a=='1'){
				$(this).show(200);
				btn_anterior.hide();
				btn_siguiente.hide();
				btn_finalizar.hide();

				if(encuesta_c=='1'){
					btn_siguiente.removeClass('col-xs-6');
					btn_siguiente.addClass('col-xs-12');
					btn_siguiente.show();
				}
				if(encuesta_c=='6'){
					btn_finalizar.show();
					btn_anterior.show();
				}
				if(encuesta_c!='6'&&encuesta_c!='1'){
					btn_siguiente.removeClass('col-xs-12');
					btn_siguiente.addClass('col-xs-6');
					btn_siguiente.show();
					btn_anterior.show();
				}
			}else{
				$(this).hide();
			}
			

		});
	}