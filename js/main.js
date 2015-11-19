/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
*/
var mads = function () {
	/* Get Tracker */
	if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
		this.custTracker = rma.customize.custTracker;
	} else if (typeof custTracker != 'undefined') {
		this.custTracker = custTracker;
	} else {
		this.custTracker =  [];
	}

	/* Unique ID on each initialise */
	this.id = this.uniqId();

	/* Tracked tracker */
	this.tracked = [];

	/* Body Tag */
	this.bodyTag = document.getElementsByTagName('body')[0];

	/* Head Tag */
	this.headTag = document.getElementsByTagName('head')[0];

	/* RMA Widget - Content Area */
	this.contentTag = document.getElementById('rma-widget');

	/* URL Path */
	this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () { return new Date().getTime(); };

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
};

/* tracker */
mads.prototype.tracker = function (tt, type, name) {

	/* 
	 * name is used to make sure that particular tracker is tracked for only once
	 * there might have the same type in different location, so it will need the name to differentiate them
	 */
	name = name || type;

	if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
		for (var i = 0; i < this.custTracker.length; i++) {
			var img = document.createElement('img');

			/* Insert Macro */
			var src = this.custTracker[i].replace('{{type}}', type);
			src = src.replace('{{tt}}', tt);
			/* */
			img.src = src + '&' + this.id;

			img.style.display = 'none';
			this.bodyTag.appendChild(img);

			this.tracked.push(name);
		}
	}
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
	var script = document.createElement('script');
	script.src = js;

	if (typeof callback != 'undefined') {
		script.onload = callback;
	}

	this.headTag.appendChild(script);
};

/* Load CSS File */
mads.prototype.loadCss = function (href) {
	var link = document.createElement('link');
	link.href = href;
	link.setAttribute('type', 'text/css');
	link.setAttribute('rel', 'stylesheet');

	this.headTag.appendChild(link);
};

mads.prototype.listen = function(options) {
    	var receiveMessage = function(event) {
      	options.callback(event.data);
    	}
    	window.addEventListener("message", receiveMessage, false);
}

var umobile = function(){
	var _this = this;
	this.sdk = new mads();

	this.parent = document.getElementById('rma-widget');
	this.answer = null;
	this.prefix = '+6018'
	this.number = null;
	this.choices = ['RM 70', 'RM 128', 'RM 158', 'RM 188'];
	this.formUrl = 'https://api.mobileads.com/twilio/index.php';

	var startSeconds = new Date().getTime() / 1000;
	this.sdk.listen({
		'callback': function(msg) {
		    	if (typeof msg.auth != 'undefined' && typeof msg.auth.type != 'undefined' && msg.auth.type == 'closeExpandable') {
				var endSeconds = new Date().getTime() / 1000;
				var diffSeconds = endSeconds - startSeconds;
				_this.sdk.tracker('E', 'duration', 'duration', diffSeconds);
		    	}
		}
	});

	this.sdk.loadCss(this.sdk.path + 'css/bootstrap.min.css');
	this.sdk.loadCss(this.sdk.path + 'css/animate.min.css');
	this.sdk.loadCss(this.sdk.path + 'css/style.css');
	this.sdk.loadJs(this.sdk.path + 'js/jquery.js', function(){
		_this.sdk.loadJs(_this.sdk.path + 'js/bootstrap.min.js');
		_this.preload();
		_this.firstScreen(_this.parent);
	});	
}

umobile.prototype.isEmpty = function(value){ return typeof value != 'undefined' && $.trim(value) ? false : true; }

umobile.prototype.preload = function(){
	var _this = this;
	var script = document.createElement('SCRIPT');
	var str = '';
	str = str + 'var frame_1 = new Image();' +
	'var frame_2 = new Image();' +
	'var frame_3 = new Image();' +
	'var frame_4_c = new Image();' +
	'var frame_4_w = new Image();' +
	'var frame_5 = new Image();' +
	'var frame_6 = new Image();' +
	'var explode = new Image();' +
	'var hero = new Image();' +
	'var logo_lg = new Image();' +
	'frame_1.src='+ _this.sdk.path+' "img/frame_1.png";' +
	'frame_2.src='+ _this.sdk.path+' "img/frame_2.png";' +
	'frame_3.src='+ _this.sdk.path+' "img/frame_3.png";' +
	'frame_4_c.src='+ _this.sdk.path+' "img/frame_4_c.png";' +
	'frame_4_w.src='+ _this.sdk.path+' "img/frame_4_w.png";' +
	'frame_5.src='+ _this.sdk.path+' "img/frame_5.png";' + 
	'frame_6.src='+ _this.sdk.path+' "img/frame_6.png";' +
	'explode.src='+ _this.sdk.path+' "img/explode.png";' +
	'hero.src='+ _this.sdk.path+' "img/hero.png";' +
	'logo_lg.src='+ _this.sdk.path+' "img/logo_lg.png";';
	script.innerHTML = str;
	_this.sdk.bodyTag.appendChild(script);
}

umobile.prototype.firstScreen = function(parent){
	var _this = this;
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'first-holder animated fadeIn wrapper');
	parent.appendChild(frame);

	var frame_input = document.createElement('DIV');
	frame_input.setAttribute('class', 'frame_input');
	frame.appendChild(frame_input);
	var lists = '';
	for (var i = 0; i < _this.choices.length; i++) {
		lists += '<li>'+ _this.choices[i] +'<li>'
	};

	frame_input.innerHTML = '<div class="btn-group btn-select dropup"><button type="button" class="btn btn-default btn-action" data-toggle="dropdown">SELECT COST</button><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu">'+ lists +'</ul></div><button type="button" class="btn btn-orange center-block button-submit">Submit</button>'; 
	
	this.firstclickHandler = function(){
		if(_this.answer != null){
			_this.secondScreen();
			var a = _this.answer.replace(/ +/g, "");
			_this.sdk.tracker('E', a);
		}	
	}

	$('.dropdown-menu li').click(function(event) {
		document.querySelector('.btn-action').innerHTML = $(this).text();
		_this.answer = $(this).text();
	});

	document.querySelector('.btn-action').addEventListener('click', function(){
		$('.dropdown-toggle').dropdown()
	});

	document.querySelector('.button-submit').addEventListener('click', _this.firstclickHandler, false);
}

umobile.prototype.secondScreen = function(){
	var _this = this;

	document.querySelector('.first-holder').style.display = 'none';
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'second-holder animated fadeIn wrapper');
	_this.parent.appendChild(frame);

	var frame_input = document.createElement('DIV');
	frame_input.setAttribute('class', 'frame_input');
	frame.appendChild(frame_input);
	frame_input.innerHTML = '<form action="'+ _this.formUrl +'" method="post"><p class="notify hidden"></p><div class="input-group input-group-lg"><span class="input-group-addon" id="basic-addon1">'+ _this.prefix +'</span><input type="text" class="form-control form-control-number" name= "phone-number" placeholder="XXX XXXX" aria-describedby="basic-addon1" maxlength="7"></div><button type="button" class="btn btn-orange center-block button-accept btn-lg">I Accept</button></form>';

	this.secondclickHandler = function(){
		$('.notify').text('').addClass('hidden');
		_this.number = document.querySelector('.form-control-number').value;
		if(_this.isEmpty(_this.number)){
			$('.notify').text('Please key in your phone number.').removeClass('hidden');
			document.querySelector('.form-control-number').focus();
		}else if(isNaN(_this.number )){
			$('.notify').text('Please key in a valid phone number.').removeClass('hidden');
			document.querySelector('.form-control-number').focus();
		}else{
			_this.number = _this.prefix + _this.number;
			_this.thirdScreen();
		}
	}
	document.querySelector('.button-accept').addEventListener('click', _this.secondclickHandler, false);
}

umobile.prototype.thirdScreen = function(){
	var _this = this;
	document.querySelector('.second-holder').style.display = 'none';
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'third-holder animated tada wrapper');
	_this.parent.appendChild(frame);

	setTimeout(function(){
		_this.fourthScreen();
	}, 4000);
}

umobile.prototype.fourthScreen = function(){
	var _this = this;
	var status = 'wrong';
	document.querySelector('.third-holder').style.display = 'none';
	var frame = document.createElement('DIV');
	if(this.answer != 'RM 70'){
		frame.setAttribute('class', 'fourth-holder-wrong animated fadeIn wrapper');
	}else{
		frame.setAttribute('class', 'fourth-holder-right animated fadeIn wrapper');
		status = 'right';
	}
	_this.parent.appendChild(frame);
	setTimeout(function(){
		_this.fifthScreen(status);
	}, 5000);
}

umobile.prototype.fifthScreen = function(status){
	var _this = this;
	document.querySelector('.fourth-holder-' + status).style.display = 'none';
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'fifth-holder animated fadeIn wrapper');
	frame.innerHTML = '<p class="countdown">5</p>'
	_this.parent.appendChild(frame);

	var seconds;
	var duration = 4;
	var timer = duration;
	var countdown =  setInterval(function(){
		seconds = parseInt(timer % 60, 10);
		document.querySelector('.countdown').innerHTML = seconds;

		if (--timer < 0) {
			timer = duration;
		}

		if(seconds == 0){
			clearInterval(countdown);
			setTimeout(function(){
				_this.sixthScreen();
			}, 1000)
		}
	}, 1000);
}

umobile.prototype.sixthScreen = function(){
	var _this = this;
	document.querySelector('.fifth-holder').style.display = 'none';
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'sixth-holder animated fadeIn wrapper');
	_this.parent.appendChild(frame);

	var explode = document.createElement('IMG');
	explode.setAttribute('class', 'explosion animated zoomIn');
	explode.setAttribute('src', _this.sdk.path + 'img/explode.png');

	var hero = document.createElement('IMG');
	hero.setAttribute('class', 'hero');
	hero.setAttribute('src', _this.sdk.path + 'img/hero.png');


	setTimeout(function(){
		frame.appendChild(explode);
		frame.appendChild(hero);
	}, 500);

	setTimeout(function(){
		_this.finalScreen();
	}, 3000);
}

umobile.prototype.finalScreen = function(){
	var _this = this;
	document.querySelector('.sixth-holder').style.display = 'none';
	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'final-holder wrapper');

	_this.parent.appendChild(frame);

	var logo = document.createElement('IMG');
	logo.setAttribute('class', 'logo animated flipInY');
	logo.setAttribute('src', _this.sdk.path + 'img/logo_lg.png');

	var button = document.createElement('BUTTON');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-orange center-block button-info btn-lg');
	button.innerHTML = 'More Info';
	frame.appendChild(logo);
	frame.appendChild(button);

	document.querySelector('.button-info').addEventListener('click', function(){
		_this.sdk.tracker('CTR','site');
        	_this.sdk.linkOpener('http://www.u.com.my/postpaid');
	});
	var xhr = new XMLHttpRequest();
	xhr.open("POST", _this.formUrl, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// console.log('mobile=' + _this.number);
			console.log(xhr.status);
		}
	};

	setTimeout(function() {
		xhr.send('mobile=' + _this.number);
	}, 1000);
}

var u = new umobile();

