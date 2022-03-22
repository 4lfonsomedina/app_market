var sesion_local = window.localStorage;



$(document).ready(function() {
	//sesion_local.clear();
	

	function actualizar_session(session_id){
		$.post(url_api+"actualizar_session",{id:session_id},function(r){
			//actualizamos variables
			if(jQuery.parseJSON(r).length>0){
				var cliente = jQuery.parseJSON(r)[0];
				sesion_local.setItem("FerbisAPP_id",		cliente.id_cliente);
				sesion_local.setItem("FerbisAPP_numero", 	cliente.numero);
				sesion_local.setItem("FerbisAPP_nombre",	cliente.nombre);
				sesion_local.setItem("FerbisAPP_telefono", cliente.telefono);
				sesion_local.setItem("FerbisAPP_correo", 	cliente.correo);
				sesion_local.setItem("FerbisAPP_dir_calle", cliente.dir_calle);
				sesion_local.setItem("FerbisAPP_dir_numero1", cliente.dir_numero1);
				sesion_local.setItem("FerbisAPP_dir_numero2", cliente.dir_numero2);
				sesion_local.setItem("FerbisAPP_lat", cliente.lat);
				sesion_local.setItem("FerbisAPP_lon", cliente.lon);
				sesion_local.setItem("link_banner", cliente.link_banner);
				actualizar_interfaz();
				//token_firebase(cliente.id_cliente);
				setTimeout(function(){
					notificaciones();
				}, 1000);
			}else{
				$('#modal_bienvenida').modal({backdrop: 'static', keyboard: false});
			}
		});
	}
	function notificaciones(){
		var estoy = window.location.href.split("/")[window.location.href.split("/").length-1].split(".")[0];
		if(estoy!="index"){return;}
		$.post(url_api+"get_pedidos_por_pagar",{id_cliente:sesion_local.getItem("FerbisAPP_id")},function(r){
			if(r=='1'){
				alert_2("Tienes pedidos listos para pago<br><br>"+
					
					"<i class='fa fa-bars' aria-hidden='true'></i> Menú -> <i class='fa fa-shopping-basket' aria-hidden='true'></i> Mis Pedidos<br><br>"+ 
					"Para pagar desde la Aplicación <br><br>"+
					"<a class='btn btn-default blank_a' href='pedidos.html'>ir ahora</a>"
					);
			}else{
				console.log("error");
				setTimeout(function(){
					try{verificacion_encuesta(sesion_local.getItem("FerbisAPP_id"));}catch{}
				}, 1000);
			}
		});
	}
	//actualizamos interfaz
	function actualizar_interfaz(){
		$("#nombre_usuario").html(sesion_local.getItem("FerbisAPP_nombre"));
		if(sesion_local.getItem("link_banner")=='1'){
			 $("#link_banner").removeAttr('disabled');
		}
	}
	//evitar que se pueda ocultar el modal de bienvenida

	//verificar si el cliente esta dado de alta
	setTimeout(function(){
		if(sesion_local.getItem("FerbisAPP_id")!=null){
		actualizar_session(sesion_local.getItem("FerbisAPP_id"));
		}else{
			$('#modal_bienvenida').modal({backdrop: 'static', keyboard: false});
		}
	}, 2000);
	

	//Captura de nombre
	$(document).on("click",".btn_bienvenida",function(){
		if($(".modal_bienvenida_nombre").val()!=""){
			var temp_nombre = $(".modal_bienvenida_nombre").val();
			$(".modal_bienvenida_body").html(loader());
			$.post(url_api+"alta_cliente",{nombre:temp_nombre},function(r){
				var cliente = jQuery.parseJSON(r)[0];
				actualizar_session(cliente.id_cliente);
				$("#modal_bienvenida").modal("hide");
			})
		}else{
			alert_2("Es importante que contemos su nombre para saber con quien nos dirigimos.");
		}
	})
});



function token_firebase(id_cliente){
		const messaging = firebase.messaging();
      // Get registration token. Initially this makes a network call, once retrieved
	    // subsequent calls to getToken will return from cache.
	    messaging.getToken({vapidKey: 'BJEl5N1MisRuwTpbSDCgVDuQKZ4jRs0jmzxBNRLYDnLVJ1OvvMDpPCBCWO96sMNqHQsONL-QUafGmV_ycU58avU'}).then((currentToken) => {
	      if (currentToken) {
	        sendTokenToServer(currentToken,id_cliente);
	        //updateUIForPushEnabled(currentToken);
	      } else {
	        // Show permission request.
	        console.log('No registration token available. Request permission to generate one.');
	        // Show permission UI.
	        //updateUIForPushPermissionRequired();
	        //setTokenSentToServer(false);
	      }
	    }).catch((err) => {
	      console.log('An error occurred while retrieving token. ', err);
	      console.log('Error retrieving registration token. ', err);
	      //setTokenSentToServer(false);
	    });
	}
function sendTokenToServer(currentToken,id_cliente){
        $.post(url_api+"guardar_token", {token: currentToken,id: id_cliente}, function(r) {
        	console.log(r);
        });
    }