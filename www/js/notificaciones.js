$(document).ready(function() {
		$(".contenedor_notificaciones").html(loader());
		cargar_notificaciones();

		$(document).on("click",".notificacion_row_a",function(){
			$("#modal_notificacion").modal("show");
			$(".contenido_notificacion").html(loader());
			cargar_notificacion($(this).attr('id_notificacion'));
			cargar_notificaciones();
		})

		function cargar_notificacion(id_notificacion){
			$.post(url_api+"get_notificacion",{id_notificacion:id_notificacion},function(r){
				var notificacion = jQuery.parseJSON(r);
				$(".modal_notificacion_asunto").html(notificacion.asunto);
				$(".modal_notificacion_fecha").html(notificacion.fecha);
				$(".contenido_notificacion").html(notificacion.mensaje);
		})
		}

		function cargar_notificaciones(){
			$.post(url_api+"get_notificaciones",{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			var string_contenido="";
			if(jQuery.parseJSON(r).length>0){
				$.each(jQuery.parseJSON(r), function( i, notificacion ) {
					var estatus = "";
					var label = "success";
					var status_desc="Nuevo";
					if(notificacion.leido==1){estatus='-open'; status_desc='Leído'; label="default"}
					string_contenido+='<a href="#" class="notificacion_row_a" id_notificacion="'+
					notificacion.id_notificacion+'">'+
					'<div class="contenedor_paso_1 notificacion_row"><div class=" row" >'+
		'<div class="col-xs-3"><span class="label label-'+label+'">'+
			'<i class="fa fa-envelope'+estatus+'" aria-hidden="true"></i> '+status_desc+'</span></div>'+
		'<div class="col-xs-9"><b>'+notificacion.asunto+'</b><br>'+
		'<span class="small_notificacion">'+notificacion.fecha+'</span></div>'+
	'</div></div></a>';
				})

				$(".contenedor_notificaciones").html(string_contenido);
			}else{
				$(".contenedor_notificaciones").html("<h2 align='center'>No se encontraron Notificaciones</h2>");
			}
		})
		}


		
	});