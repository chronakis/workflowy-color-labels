/**
 * 
 * Copyright 2014 by Yiannis Chronakis <jchronakis@gmail.com>
 *
 * This file is part of some open source application.
 * 
 * Both the file and the application are Licensed under
 * GNU General Public License 3.0 or later.  Some rights reserved.
 * 
 * See LICENCE file
 * 
 * @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */
var testMode;

/** For debugging */
var gopts;

var rawColorsText;
var enabledCheck;

/** Holds some detachable divs */
var divs;


function attachEditor(setting, label) {
	var board = divs.board.appendTo(setting);
	
	$('#tagcheck', board).prop('checked', label.tag).click(function(e){
			
		});
	$('#tagautofg', board).prop('checked', label.tagfg ? true : false).click(function(e){
			
		});
	$('#tagautobg', board).prop('checked', label.tagbg ? true : false).click(function(e){
			
		});
	$('#tagfg', board).val(label.tagfg).keyup(function (e){
		
	});
	$('#tagbg', board).val(label.tagbg).keyup(function (e){
		
	});

	$('#textcheck', board).prop('checked', label.text);
	$('#textautofg', board).prop('checked', label.textfg ? true : false);
	$('#textautobg', board).prop('checked', label.textbg ? true : false);
	$('#textfg', board).val(label.textfg).keyup(function (e){
		
	});
	$('#textbg', board).val(label.textbg).keyup(function (e){
		
	});
	
}

/**
 * Convert the board form values to a label value
 */
function formToVal(setting) {
	var res =  {
		tag   : $('.otag'   , setting).val(),
		tagfg : $('.otagfg' , setting).val(),
		tagbg : $('.otagbg' , setting).val(),
		tagnu : $('.otagnu' , setting).val(),
		text  : $('.otext'  , setting).val(),
		textfg: $('.otextfg', setting).val(),
		textbg: $('.otextbg', setting).val()
	};
}

function updatePreview(setting, val) {
	if (val.tag) {
		var css = {};
		if (val.tagfg)
			css['color'] = val.tagfg;
		if (val.tagbg)
			css['background-color'] = val.tagbg;
		$('.contentTag', setting).css(css);
		$('.contentTagText', setting).css('text-decoration', val.tagnu ? 'none' : 'underline');
	}
	if (val.text) {
		var css = {};
		if (val.textfg)
			css['color'] = val.textfg;
		if (val.textbg) {
			css['background-color'] = val.textbg;
			css['border-radius'] = '6px';
		}
		$('.content', setting).css(css);
	}
}

function prepList(opts) {
	var container = $('#options');
	$.each(opts.labels, function(key, val) {
		var setting = divs.setting.clone();
		$('.tagname', setting).val(key);
		$('.contentTagText', setting).text(key);
		$('.contentText', setting).text(loremIpsoum.random());

		$('.otag', setting).val(val.tag);
		$('.otagfg', setting).val(val.tagfg);
		$('.otagbg', setting).val(val.tagbg);
		$('.otagnu', setting).val(val.tagnu);
		$('.otext', setting).val(val.text);
		$('.otextfg', setting).val(val.textfg);
		$('.otextbg', setting).val(val.textbg);
		
		updatePreview(setting, val);
		
		
		// Bindings
		$('.edit', setting).click(function(e) {
			attachEditor(setting, val);
		});
		
		$('.delete', setting).click(function(e) {
			setting.remove();
		});
		$('.tagname', setting).keyup(function(e) {
			$('.contentTagText', setting).text($(this).val());
		});
		
		setting.appendTo(container);
	});  
}

/* Load stuff on load */
function loadCallback (outerOpts) {
	if (chrome && chrome.runtime && chrome.runtime.error) {
		console.log("Chrome runtime error: " + chrome.runtime.error);
		return;
	}
	
	// Chrome will nest my object in one with the same name:
	// save: options: {a:1, b:2}
	// load: options.options {a:1, b:2}
	var opts = outerOpts.options; // the data will have my options in the thing called "options"
	gopts = opts;
	rawColorsText.value = opts.labels;
	enabledCheck.checked = opts.enabled;
	
	prepList(opts);
};


jQuery(document).ready(function() {
	// Assign shortcuts
	rawColorsText = document.getElementById("raw-colors");
	enabledCheck  = document.getElementById("enabled");
	
	legacyBindings();
	
	divs = {
			setting: $('.setting').detach().show(),
			board:   $('.board').detach().show()
	}
	
	// Load and trigger everything
	try {
		chrome.storage.sync.get("options", loadCallback);
		testMode = false;
	} catch (err) {
		testMode = true;
		loadCallback(stubOptions);
	}
});

