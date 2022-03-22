	$(document).ready(function() {
		$(".contenedor_pedidos").html(loader());
		
		$.post(url_api+"get_carritos",{id:sesion_local.getItem("FerbisAPP_id")},function(r){
			var string_contenido="";
			if(jQuery.parseJSON(r).length>0){
				$.each(jQuery.parseJSON(r), function( i, pedido ) {
					var estatus = pedido.status;
					var leyenda_pago = '<div class="label label-primary" >'
					var status_desc = "";
					var estatusB = ["","","",""];
					var estatusA = ["default","default","default","default"];
					if(estatus>=0){estatusA[0]='info'; }
					if(estatus>=1){estatusA[1]='primary';}
					if(estatus>=2){estatusA[2]='warning';}
					if(estatus>=3){estatusA[3]='success';}
					if(estatus>=4){estatusA[4]='danger';}
					if(estatus==0){estatusB[0]='Captura'; 	status_desc="Captura";	}
					if(estatus==1){estatusB[1]='Surtiendo'; status_desc="Surtiendo";}
					if(estatus==2){estatusB[2]='Preparado'; status_desc="Preparado";}
					if(estatus==3){estatusB[3]='Listo'; 	status_desc="Entrega";}
					if(estatus==4){estatusB[4]='Cancelado'; status_desc="Cancelado";}

					/* Pago status */
					var leyenda_pago="";
					if(pedido.pago_total!=""){pedido.total=pedido.pago_total; }
					if(pedido.pago_status=='1'){
						leyenda_pago="<div style='border-radius:5px; font-weight:bold; background-color:#4caf50; color:white'>$"+pedido.pago_total+"<br><i class='fa fa-credit-card-alt' aria-hidden='true'></i> Pagar</div>";}
					if(pedido.pago_status=='2'){
						leyenda_pago="<div style='border-radius:5px; font-weight:bold; background-color:#4caf50; color:white'>$"+pedido.pago_total+"<br> Pagado</div>";}

					string_contenido+='<a href="#" class="pedido_row_a" id_carrito="'+pedido.id_carrito+'" '+
					'fecha="'+pedido.fecha_entrega+'" '+
					'status="'+status_desc+'" '+
					'pedido="'+pedido.id_pedido+'" '+
					'cliente="'+pedido.id_cliente+'" '+
					'productos="'+pedido.cantidad+'" '+
					'total="'+parseFloat(pedido.total).toFixed(2)+'" '+
					'pago_status="'+pedido.pago_status+'"'+
					'>'+
					'<div class="contenedor_paso_1 pedido_row">'+
  					'<div class="row">'+
  					
    				'<div class="col-xs-4"><b>'+pedido.cantidad+'.Articulos</b><br><span class="small_pedido">'+pedido.fecha_entrega+'</span></div>'+
    '<div class="col-xs-4 pedido_tot"><span class="small_pedido">'+leyenda_pago+'</span></div>'+
    '<div class="col-xs-4 pedido_tot"><span class="small_pedido"><b>Entrega</b></span><br>'+formato_12hrs(pedido.hora_entrega)+'</div>'+
  '</div>'+
  '<div class="row status_pedido_row">'+
    '<div class="col-xs-3"><div class="label-'+estatusA[0]+'"></div>'+estatusB[0]+'</div>'+
    '<div class="col-xs-3"><div class="label-'+estatusA[1]+'"></div>'+estatusB[1]+'</div>'+
    '<div class="col-xs-3"><div class="label-'+estatusA[2]+'"></div>'+estatusB[2]+'</div>'+
    '<div class="col-xs-3"><div class="label-'+estatusA[3]+'"></div>'+estatusB[3]+'</div>'+
  '</div>'+
  '<div>Recibido en sucursal: <b>'+pedido.sucursal+'</b> con folio: <b>'+pedido.consecutivo+'</b></div>'+
'</div>';
				})

				$(".contenedor_pedidos").html(string_contenido);
			}else{
				$(".contenedor_pedidos").html("<h2 align='center'>No se encontraron pedidos</h2>");
			}
			console.log(r);
		})

		$(document).on("click",".pedido_row_a",function(){
			//$(".modal_pedido_fecha").html($(this).attr('fecha'));
			//$(".modal_pedido_status").html($(this).attr('status'));
			//$(".modal_pedido_productos").html($(this).attr('productos')+" productos");
			$(".modal_pedido_total").html("<b>$ "+$(this).attr('total')+"</b>");
			$(".contenido_pedido").html(loader());
			$(".boton_re-ordenar").attr('id_carrito',$(this).attr('id_carrito'));
			if($(this).attr('status')=='Entrega'){$(".boton_re-ordenar").show();}
			else{$(".boton_re-ordenar").hide();}

			/* Datos para cobro con tarjeta */
			if($(this).attr('pago_status')!='1'){ $(".boton_procesar_pago").hide();	}
			else{$(".boton_procesar_pago").show();}
			$(".boton_procesar_pago").attr('pedido',$(this).attr('pedido'));
			$(".boton_procesar_pago").attr('cliente',$(this).attr('cliente'));
			$(".boton_procesar_pago").attr('total',$(this).attr('total'));

			$.post(url_api+"get_carritos_id",{id:$(this).attr('id_carrito')},function(r){
				$(".contenido_pedido").html(string_carrito_pedido(r));
				$("#modal_pedido").modal("show");
			})
		})

		/* Modulo cobro con tarjeta */
		$(document).on("click",".boton_procesar_pago",function(){
			get_t(2);
			$("#Modal_pago_con_tarjeta").modal('show');
		})

		//boton de re-ordenar
		$(document).on("click",".boton_re-ordenar",function(){
			console.log($(this).attr('id_carrito'));
			$.post(url_api+"re_ordenar", {id_carrito:$(this).attr('id_carrito')}, function(r) {
				alert_2("Pedido agregado a su carrito actual");
				closeBrowser();
			});
		})


		function string_carrito_pedido(string_json){
		var string_ret="";
		var id_departamento = "0";
		$.each(jQuery.parseJSON(string_json), function( i, prod ) {
			//dividir por departamento
			var icon="";
			if(prod.status==0){icon="<div class='col-xs-3' style='text-align:center'><i class='fa fa-shopping-basket' aria-hidden='true'></i></div>";}
			if(prod.status==1){icon="<div class='col-xs-3' style='color:#1E8449;text-align:center'><i class='fa fa-check-square-o' aria-hidden='true'></i></div>";}
			if(prod.status==2){icon="<div class='col-xs-3' style='color:#A93226;text-align:center'>Agotado</div>";}
			if(prod.detalles!=""){prod.detalles="<br>"+prod.detalles;}
			var asado=""; if(prod.asado=='1'){ asado='(ASA) ';}

			var preparado=""; if(prod.preparado=='1'&&prod.id_departamento=='002'){ preparado='(PRE) ';}
			var corte=""; if(prod.corte!='N'&&prod.corte!=''&&prod.id_departamento=='002'){ corte='(COR '+prod.corte+') '; }
			var termino=""; if(prod.termino!=''&&prod.asado=='1'&&prod.id_departamento=='002'){ termino='(TER '+prod.termino+') ';}
 
			string_ret+="<div class='articulo_carrito_pedido' >"+
			  				"<div class='col-xs-2 car_cantidad'>"+parseFloat(prod.cantidad).toFixed(2)+"<br><b>"+prod.unidad+"</b></div>"+
			  				"<div class='col-xs-7 car_desc'><b>"+prod.descripcion+"</b>"+asado+preparado+corte+termino+prod.detalles+"</div>"+icon+
			  				"</div>";
		});
		return string_ret;
	}


	function formato_12hrs(hora){
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
	});