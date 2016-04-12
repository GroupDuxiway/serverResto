function setupBarcode() {
	var format = '';
	format = $("#barcode-format > .btn.active").attr("rel");
	if(format === undefined || format.length == 0) {
		$('.webpass_barcode_canvas').hide();
		return;
	}

	$('.webpass_barcode_canvas').removeAttr('style');

	var message = $("#encoded").val();
	var bwip = new BWIPJS;
	bwip.bitmap(new Bitmap);
	bwip.scale(3, 3);
	bwip.push(message);
	bwip.push({});
	if (format == "aztec" || format == "qr") {
		bwip.call(format + "code");

	} elseif(format == "code128") {
		bwip.call("code128");

	} else {
		bwip.call("pdf417");
	}

	var canvas = $(".webpass_barcode_canvas")[0];
	bwip.bitmap().show(canvas, "N");

	$(".webpass_barcode_canvas").hide();

	var img    = canvas.toDataURL("image/png");
	$('#result').attr('src', img);
}

$('#generateBarcode').click(function(e){
	e.preventDefault();
	setupBarcode();
});
