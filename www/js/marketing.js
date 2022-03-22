$(document).ready(function(){
	$.post(url_api+'marketing', function(r) {
		$(".contenedor_marketing").html(r);
	});
})