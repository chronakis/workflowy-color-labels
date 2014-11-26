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

/**
 * I prefer this mode
 */
jQuery.noConflict();

/**
 * Records the previous enabled state
 */
var prevEnabled = false;

/**
 * We use this to mark dom objects that we should be clearing
 */
var marker = "wfcl";

/**
 * Colors all tags that are under $root
 */
function colorizeTree($root) {
	jQuery(".contentTagText", $root).each(function (i) {
		$elm = jQuery(this);
		var tag = $elm.text();
		var $elmToColor;
		var labelInfo = labelMap.labels[tag];
		// If there is a defined label, process it and color us
		if (labelInfo) {
			if (labelInfo.applyTo === 'label')
				$elmToColor = $elm.parent();
			else
				$elmToColor = $elm.parent().parent();
			
			// Color and mark
			$elmToColor.css({'color': labelInfo.fg, 'background-color': labelInfo.bg}).addClass(marker);
		}
		else {
	    	// If the user just renamed a tag to something we don't colour
	    	// workflowy will recreate the nodes, loosing colour info, so no action required
			// however, this is not the case for coloring 'text', so we need to check
			
			if ($elm.parent().parent().hasClass(marker))
				$elm.parent().parent().css({'color': '', 'background-color': ''}).removeClass(marker);
		}
	});
}


/**
 * Binds the dom updates to a time delayed function
 */
function bindDOMUpdates() {
	// Firstly, if we are called, it means either load or re-activation
	// run the updates
	colorizeTree(jQuery(document));
	//debugger;
	
	// Bind the dom change event to a delayed update process
	jQuery(document).bind('DOMNodeInserted', function(e) {
	    var $element = jQuery(e.target);

	    // This is for when opening and closing
	    if ($element.is('.project .open')) {
	    	colorizeTree($element);
	    }
	    // We only respond to tag changes
	    else if ($element.hasClass('contentTag')) {
	    	colorizeTree($element);
	    }
	});
}


/**
 * Disables the extension
 */
function disable() {
    // Clear any timers
    if (timerUpdateNodes)
        clearInterval(timerUpdateNodes);
  
  // Clean up the markup
  jQuery('.wfc').css({'color': '', 'background-color': ''}).removeClass("wfc");
}


/**
 * This processes the loaded options and populates our local copies
 * 
 * @param outerOpts  Chrome will next my object in one with the same name:
 *                   save: options: {a:1, b:2}
 *                   load: options.options {a:1, b:2
 */
function processOptions(outerOpts) {
	var loaded = false;
	if (!chrome.runtime.error) {
		var opts = outerOpts.options; // the data will have my options in the thing called "options"
		try {
			labelMap.enabled = opts.enabled == false ? false : true;
			labelMap.labels = JSON.parse(opts.labels);
			loaded = true;
		}
		catch (err) {
			console.log("Failed to parse JSON");
			alert("Proplem with the loaded options, restoring defaults");
		}
	}
	
	if (!loaded) {
		// Add defaults
		labelMap.enabled = true;
		labelMap.defaults();
	}
}

/**
 * A Callback called when options change
 * 
 * @param outerOpts  The outer wrapper for the options, see comment at processOptions
 */
function optionsReloaded(outerOpts) {
	processOptions(outerOpts);
	// We were disabled
	if (prevEnabled && labelMap.enabled == false) {
		disable();
	}
	// We were enabled
	else if (prevEnabled == false && labelMap.enabled == true) {
		bindDOMUpdates();
	}
	prevEnabled = labelMap.enabled;
};


/**
 * Callback called at the first load of the page
 * 
 * @param outerOpts  The outer wrapper for the options, see comment at processOptions
 */
function optionsLoaded(outerOpts) {
	processOptions(outerOpts);
	prevEnabled = labelMap.enabled;

	if (labelMap.enabled)
		bindDOMUpdates();
	
	// Add the optionsReloaded hook to the options changing
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		chrome.storage.sync.get("options", optionsReloaded);
	});
	
};


/**
 * We load here
 */
jQuery(document).ready(function() {
	/*
	 * // This is a test for using a listener from the popup
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		if (request.action == "saved") {
			sendResponse({reply: "saved received"});
			console.log("message received");
		}
	  });	
	*/
	
	// We start here
	chrome.storage.sync.get("options", optionsLoaded);
});

