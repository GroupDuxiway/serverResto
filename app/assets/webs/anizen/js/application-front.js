function displayInfo(message, infoBox, autohide)
{
	$('#account_actions').css('background-color', 'none');
	$('#account_actions').addClass('message');
	$('#account_actions').addClass('info');


	$('#account_actions').slideDown('normal');
	var item = $('<p class="message" id="infoBoxMessage">'+message+'</p>').hide().fadeIn(500);
	infoBox.append(item);

	if(autohide) window.setTimeout(clearMessage, 3000);
}

function displayError(message, infoBox, autohide)
{
	$('#account_actions').css('background-color', 'none');
	$('#account_actions').addClass('message');
	$('#account_actions').addClass('anim');
	$('#account_actions').addClass('error');


	$('#account_actions').slideDown('normal');
	var item = $('<p class="message" id="infoBoxMessage">'+message+'</p>').hide().fadeIn(500);
	infoBox.append(item);

	if(autohide)
		window.setTimeout(clearMessage, 4000);
}

function clearMessage() {
	$('#account_actions').slideUp('normal', function() {
		$(this).show();
		$('#account_actions').css('background-color', 'none');
		$('#account_actions').removeClass('message');
		$('#account_actions').removeClass('anim');
		$('#account_actions').removeClass('success');
		$('#account_actions').removeClass('error');
		$('#account_actions').removeClass('warning');
		$('#account_actions').removeClass('info');
	});
	var item = $('#infoBoxMessage');
	if(item)
		item.remove();
}

function getTZ() {
	var tz = jstz.determine();
	return tz.name();
}

$('#btn-login').click(function(event){
	event.preventDefault();

	$(this).attr("disabled", "disabled");
	$(this).find("i.fa-sign-in").hide();
	$(this).prepend('<i class="fa fa-spinner fa-spin realign"></i> ');
	$(this).addClass('disabled');

	$('#login-form').submit();

	return false;
});

var restoreLoginBtn = function() {
	$('#btn-login').removeAttr("disabled");
	$('#btn-login').find("i.fa-spinner").remove();
	$('#btn-login').find("i.fa-sign-in").show();
	$('#btn-login').removeClass('disabled');
}

$(document).ready(function () {
	if( $('.thumbnail').length > 0) {
		$('.thumbnail').popover({
			trigger: 'hover',
			placement: 'top',
			html: true,
			container: 'body'
		});
	}
});

$('#sample_pass_list li').click(function(){
	$('#sampleType').val( $(this).attr('rel') );
	$('#sample_pass_list li.active').removeClass('active');
	$(this).addClass('active');

	$('#email_input').focus();
});

var numberFormatsLitteral = new Array();
numberFormatsLitteral['EUR'] = ' €';
numberFormatsLitteral['USD'] = '$';
numberFormatsLitteral['GBP'] = '£';
numberFormatsLitteral['CHF'] = ' Fr.';


function setupBackgroundColor(color_) {
    var background = $("#webpassBackgroundColor");
    if (background.length == 0) {
    		$("head").prepend('<style type="text/css" id="webpassBackgroundColor"></style>');
    		background = $("#webpassBackgroundColor");
    }

	var html = ".frontside {background-color: " + color_ + "!important;} .backside {background-color: " + color_ + "!important;}";
	html += ".coupon .frontside:before, .coupon .frontside:after, .coupon .backside:before, .coupon .backside:after {";
	html += "background: linear-gradient(135deg, transparent 75%, " + color_ + " 75%) 0 50%,	linear-gradient( 45deg, transparent 75%, " + color_ + " 75%) 0 50% !important;";
	html += "background: -webkit-linear-gradient(135deg, transparent 75%, " + color_ + " 75%) 0 50%,	-webkit-linear-gradient( 45deg, transparent 75%, " + color_ + " 75%) 0 50% !important;";
	html += "background: -moz-linear-gradient(135deg, transparent 75%, " + color_ + " 75%) 0 50%,	-moz-linear-gradient( 45deg, transparent 75%, " + color_ + " 75%) 0 50% !important;";
	html += "background: -ms-linear-gradient(135deg, transparent 75%, " + color_ + " 75%) 0 50%,	-ms-linear-gradient( 45deg, transparent 75%, " + color_ + " 75%) 0 50% !important;";
	html += "background-size: 8px 8px, 8px 8px !important;";

	background.html(html);
}

function setupLabelColor(color) {
    $(".frontside .webpassLabel, .backside .headerFields_area .done").css('color', color);
	var stripBG = $('.strip_area').css('background-image');
	if(stripBG !== undefined && stripBG.length > 10) {
		$('.webpass .frontside .strip_area .primaryFields_area .webpassField .webpassLabel').css('color', '#fff');
	}
};

function setupForegroundColor(color) {
    $(".frontside .webpassField .webpassValue, .webpass_logoText .webpassValue").css('color',color);
	var stripBG = $('.strip_area').css('background-image');
	if(stripBG !== undefined && stripBG.length > 10) {
		$('.webpass .frontside .strip_area .primaryFields_area .webpassField .webpassValue').css('color', '#fff');
	} else {
		$('.webpass .frontside .strip_area').css('height', '110px');
	}

	$('.webpass_info .webpass_infoButton').css('color', color);
};

function setupBackFields(backside) {
    backside.find(".webpassValue").each(function () {
        var this_ = $(this);
        var html_ = this_.html();
	    html_ = html_.replace(/([^>\r\n]?)(\r\n|\n)/g, "$1<br>$2");
	    html_ = html_.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank">$1</a>');
	    html_ = html_.replace(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/ig, '<a href="mailto:$1">$1</a>');
        this_.html(html_);
    });
}

function setupBarcode(item) {
    if (item === undefined || item.length == 0) {
        return;
    }

    var format = item.attr("data-format");
    if(format === undefined || format.length == 0) {
	    $('.webpass_barcode_canvas').hide();
		return;
	}

	$('.webpass_barcode_img').attr('src', '');

	var scaleX = 1;
	var scaleY = 1;

	if(format == "qrcode" || format == "azteccode") {
		scaleX = 3;
		scaleY = 3;

	} else if(format == "pdf417"){
		scaleX = 2;
		scaleY = 3;

	}

	$('.webpass_barcode_canvas').removeAttr('style');

    var message = item.attr("data-message");
	if(message === '') {
		message = 'Captain Wallet rocks!';
	}

	var url = 'https://api-bwipjs.rhcloud.com/?bcid=' + format + '&text=' + encodeURIComponent(message) + '&scaleX='+ scaleX +'&scaleY=' + scaleY;
	$('.webpass_barcode_img').attr('src', url);
/*
	var bwip = new BWIPJS;
    bwip.bitmap(new Bitmap);
    bwip.scale(3, 3);
    bwip.push(message);
    bwip.push({});
    if (format == "aztec" || format == "qr") {
        bwip.call(format + "code")

    } else if (format == "code128") {
        bwip.call("code128")

    } else {
        bwip.call("pdf417")

    }

    var canvas = item.find(".webpass_barcode_canvas").get(0);
    bwip.bitmap().show(canvas, "N")
*/
}

function processValues(pass) {
    pass.find(".webpassValue").each(function () {
		processValue($(this));
    });
}

function processValue(this_) {
	var data = this_.attr("data-currencycode");
	if(data && data.length > 0) {
        var content = this_.html();
		var sign = data;

		if($.inArray(data, numberFormatsLitteral)) {
			sign = numberFormatsLitteral[data];
		}

		if(data == 'USD' || data == 'GBP')
			content = sign + '' + content;
		else if(data == 'EUR' || data == 'CHF')
			content = content +''+ sign;
		else
			content = sign + ' ' + content;

        this_.html(content);

	} else {
		data = this_.attr("data-numberstyle");
		if(data && data.length > 0) {
	        var content = parseFloat(this_.html());
			if(data == 'PKNumberStylePercent') {
				//console.log('==> '+content)
				if(content > 1)
					content = content + ' %';
				else
					content = (100*content) + ' %';
			}
	        this_.html(content);
		}
	}
}

function adaptBackgroundColor() {
	var container = $('.webpass_shell');
	if(container.length > 0) {
		var passType = container.attr('data-passtype');
		if(passType == 'eventTicket') {
		    var b = $("#captainPassBackgroundColor");
		    if (b.length == 0) {
		        b = $("<style>").prop("type", "text/css").prop("id", "captainPassBackgroundColor").appendTo("head")
		    }

			var backgroundColor = $('body').css('background-color');
			var html = '.eventTicket .frontside:before { background: '+backgroundColor+'; }';
			b.html(html);

		} else if(passType == 'boardingPass') {
		    var b = $("#boardingPassColor");
		    if (b.length == 0) {
		        b = $("<style>").prop("type", "text/css").prop("id", "boardingPassColor").appendTo("head")
		    }

			var backgroundColor = $('body').css('background-color');
			var html = '.boardingPass .webpass_sidepunch:before, .boardingPass .webpass_sidepunch:after { background: '+backgroundColor+'; }';
			b.html(html);
		}
	}
}

function resetTextColors(pass_) {
    setupForegroundColor(pass_.attr("data-foreground-color"));
    setupLabelColor(pass_.attr("data-label-color"));
}

function initPass(pass_) {
    setupBackgroundColor(pass_.attr("data-background-color"));
    setupForegroundColor(pass_.attr("data-foreground-color"));
    setupLabelColor(pass_.attr("data-label-color"));
    processValues(pass_);
    adaptBackgroundColor();
    setupBarcode(pass_.find(".webpass_barcode"));
    setupBackFields(pass_.find(".backsideFields"));

	if(pass_.hasClass('eventTicket')) {
		bg = $('.strip_area').css('background-image');
		if(bg != 'none') {
			$('.eventTicket .secondaryFields_area').css('top', '0');
			$('.eventTicket .secondaryFields_area').css('height', '60px');
		}
	}

    pass_.find("a.webpass_infoButton").click(function () {
        var closestPass = $(this).closest(".webpass");
        closestPass.addClass("rotated");
        closestPass.trigger("rotated");
        return false
    });
    pass_.find(".backside button.done").click(function () {
        var closestPass = $(this).closest(".webpass");
        closestPass.removeClass("rotated");
        closestPass.trigger("rotated");
        return false
    })
}

$("#img_logo").one('load', function() {
	var h = $("#img_logo").height();
	var w = $("#img_logo").width();

	if(h == 0 && w == 0)
		return;

	if(h < 45) {
		var top = (45 - h) / 2;
		$('#img_logo').css('margin-top', top+'px');
	}
}).each(function() {
	if(this.complete) $(this).load();
});

/**
 *
 *
 */
function refreshPreviewLayout(level) {
	count = $('.'+level+'_area .webpassField').size();
	if(count == 0)
		return;

	$('.'+level+'_area .webpassField').attr('style', 'padding-right: 0px;');
	if (count > 1) {
		$('.'+level+'_area .webpassField:not(:last-child)').css('float', 'left');
		$('.'+level+'_area .webpassField:last-child').css('float', 'right');
	} else if(count == 1){
		$('.'+level+'_area .webpassField:last-child').css('float', 'left');
	}

	refactorValueFields(level, count - 1);
}

/**
 *
 *
 */
var preventLoop = 0;
function refactorValueFields(level, count) {
	var selector = '.'+level+'_area .webpassField';
	var totalW = 0;
	$(selector).each(function(i, obj) {
		totalW += $(obj).width();
	});

	maxW = $('.' + level + '_area').width();

	if(count == 0)
		padding_ = 0;
	else
		padding_ = Math.floor((maxW - totalW) / count);

	if (padding_ >= 0.0) {
		if(padding_ >= 1) --padding_;
		$(selector+':not(:last-child)').css('padding-right', padding_ + 'px');
	}
	preventLoop = 0;
}


function realignFields() {
	refreshPreviewLayout('secondaryFields');
	refreshPreviewLayout('auxiliaryFields');
}


$(document).ready(function () {
	if($(".webpass").size() > 0) {
		initPass($(".webpass"));
		realignFields();
	}
});



/**
*
*
*/
function addGeocodingHandler(input, resultInput) {
	var options = {
		types: ['geocode']
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		var geo = '';
		if (!place.geometry) {
			return;
		} else {
			geo = place.geometry.location;
			resultInput.value = geo.lat() + '|' + geo.lng();
		};
	});
}

/**
*
*
*/
function geocodingHandler(input, lat, lng) {
	var options = {
		types: ['geocode']
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		var geo = '';
		if (!place.geometry) {
			return;
		} else {
			geo = place.geometry.location;
			lat.value = geo.lat();
			lng.value = geo.lng();
		};
	});
}
