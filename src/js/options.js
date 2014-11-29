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

function prepList(opts) {
	var container = $('#options');
	$.each(opts.labels, function(i, v) {
		var setting = divs.setting.clone();
		$('.tagname', setting).val(i);
		$('.contentTagText', setting).text(i);
		$('.contentText', setting).text(loremIpsoum.random());
		
		// Bindings
		$('.edit', setting).click(function(e) {
			divs.board.appendTo(setting);
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

var divs;

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

