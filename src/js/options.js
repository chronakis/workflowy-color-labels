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

/* Load stuff on load */
var loadCallback = function(outerOpts) {
	// Chrome will next my object in one with the same name:
	// save: options: {a:1, b:2}
	// load: options.options {a:1, b:2}
	if (!chrome.runtime.error) {
		var opts = outerOpts.options; // the data will have my options in the thing called "options"
		gopts = opts;
		rawColorsText.value = opts.labels;
		enabledCheck.checked = opts.enabled;
	}
};
	
document.addEventListener("DOMContentLoaded", function() {
	// Assign shortcuts
	rawColorsText = document.getElementById("raw-colors");
	enabledCheck  = document.getElementById("enabled");

	// Load
	try {
		chrome.storage.sync.get("options", loadCallback);
		testMode = false;
	} catch (err) {
		testMode = true;
		jQuery.getScript('../../test/resources/script.js', function() {
			loadCallback(stubOptions);
		});
	}
	
	document.getElementById("save").onclick = function() {
		try{
			JSON.parse(rawColorsText.value);
		}
		catch(err) {
			alert("Could not save because JSON syntax is wrong.\n\nPlease consider restoring defaults or last saved version");
			return;
		}
	
		// prepare the data to save
		var opts = {
			enabled: enabledCheck.checked,
			labels:  rawColorsText.value
			};
		
		chrome.storage.sync.set({'options': opts}, function() {
			if (chrome.runtime.error) {
				console.log("Runtime error.");
			}
		});
		
		// Send message to content to reload
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {action: "saved"}, function(response) {
			console.log("Reply was: " + response.reply);
		  });
		});		
		
		window.close();
	}

	document.getElementById("cancel").onclick = function() {
		chrome.storage.sync.get("options", loadCallback);
	}

	document.getElementById("validate").onclick = function() {
		try{
			JSON.parse(rawColorsText.value);
			alert("Valid JSON!");
		}
		catch(err) {
			alert("Not a valid JSON syntax.\n\nPlease consider restoring defaults or last saved version");
		}
	}
	
	document.getElementById("restore").onclick = function() {
		enabledCheck.checked = true;
		labelMap.clear();
		labelMap.defaults();
		//labelMap.addSimpleColors(arColors);
		rawColorsText.value = JSON.stringify(labelMap.labels, null, '\t');
	}
	
});


