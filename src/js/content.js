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
		
		var cssReset = { 'color': '', 'background-color': '' };

		var opt = labelMap.labels[tag];
		
		if (opt) { 
			var css = jQuery.extend({}, cssReset);
			if (opt.tagfg)
				css['color'] = opt.tagfg;
			if (opt.tagbg)
				css['background-color'] = opt.tagbg;
			$elm.parent().css(css).addClass(marker);
			//$elm.parent().css('text-decoration', fields.otagnu.val() == 'true' ? 'none' : 'underline');
			
			css = jQuery.extend({}, cssReset);
			if (opt.textfg)		css['color'] = opt.textfg;
			if (opt.tagbg) {
				css['background-color'] = opt.textbg;
				css['border-radius'] = '6px';
			}
			else {
				css['border-radius'] = '';
			}
			$elm.parent().parent().css(css).addClass(marker);
		}
		else {
	    	// If the user just renamed a tag to something we don't colour
	    	// workflowy will recreate the nodes, loosing colour info, so no action required
			// however, this is not the case for coloring 'text', so we need to check
			
			if ($elm.parent().parent().hasClass(marker))
				$elm.parent().parent().css(cssReset).removeClass(marker);
		}
		
//		// If there is a defined label, process it and color us
//		if (labelInfo) {
//			if (labelInfo.applyTo === 'label')
//				$elmToColor = $elm.parent();
//			else
//				$elmToColor = $elm.parent().parent();
//			
//			// Color and mark
//			$elmToColor.css({'color': labelInfo.fg, 'background-color': labelInfo.bg}).addClass(marker);
//		}
//		else {
//	    	// If the user just renamed a tag to something we don't colour
//	    	// workflowy will recreate the nodes, loosing colour info, so no action required
//			// however, this is not the case for coloring 'text', so we need to check
//			
//			if ($elm.parent().parent().hasClass(marker))
//				$elm.parent().parent().css({'color': '', 'background-color': ''}).removeClass(marker);
//		}
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
		var opts;
		// First time load
		if (outerOpts.options === undefined) {
			opts = stubOptions.options;
		}
		else {
			// the data will have my options in the thing called "options"
			opts = outerOpts.options;
		}
		labelMap = opts;
		loaded = true;
	}
	
	if (!loaded) {
		// Add defaults
		labelMap = stubOptions;
	}
}

/**
 * A Callback called when options change
 * 
 * @param outerOpts  The outer wrapper for the options, see comment at processOptions
 */
function optionsReloaded(outerOpts) {
	processOptions(outerOpts);
	// We switched from enabled to disabled
	if (prevEnabled && labelMap.enabled == false) {
		disable();
	}
	// We switched from disabled to enabled
	else if (prevEnabled == false && labelMap.enabled == true) {
		bindDOMUpdates();
	}
	// We were both previously and currently enabled
	else if (labelMap.enabled) {
		colorizeTree(jQuery(document));		
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
	//optionsLoaded(stubOptions);
	chrome.storage.sync.get("options", optionsLoaded);
});

