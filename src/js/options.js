/*
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
 * The way options work:
 * 1. On load, calling prepList
 *    - creates a setting div per tag
 *    - calls valToForm which translates value to form elements
 *    - calls formToView which updates the previews
 * 2. When the user attaches the editor
 *    - calls formToEditor to update editor fields from the settings form
 *    - binds the events in such a way that board form fields
 *      update the setting hidden fields
 * 3. Editor 
 */
var testMode;

/** For debugging */
var gopts;

/** legacy */
var rawColorsText;
var enabledCheck;

/** Holds some detachable divs */
var divs;

/** Holds the editor object */
var editor;

/** the collection of the settings */
var settings= {};

function createEditor(board) {
	var editor = {
			/** The setting being edited now */
			settingEdited: null,
			mainDiv   : board,
			fields    : {
				etag	: $('#etag'   , board),
				etagfg	: $('#etagfg' , board),
				etagbg	: $('#etagbg' , board),
				etagnu	: $('#etagnu' , board),
				etext	: $('#etext'  , board),
				etextfg	: $('#etextfg', board),
				etextbg	: $('#etextbg', board)
			},
//			metaFields: {     
//				autotagfg : $('#autotagfg' , board),
//				autotagbg : $('#autotagbg' , board),
//				autotextfg: $('#autotextfg', board),
//				autotextbg: $('#autotextbg', board)
//			},
//			enableOpts: function (owner) {
//				$('.disabler', owner.parent().parent()).css('display', owner.prop('checked') ? 'none' : 'block');
//			},
			
			_bindFields: function() {
				var editor = this;
//				this.fields.etag.click(function(e) {
//					var check = $(this);
//					editor.enableOpts(check);
//				});
//				this.fields.etext.click(function(e) {
//					var check = $(this);
//					editor.enableOpts(check);
//				});
			},
			
			detach: function() {
				this.settingEdited = null;
				board.detach();
				$.each(this.fields, function(idx, field) {
					field.off();
					if (field.is(':checkbox'))
						field.prop('checked', false);
					else
						field.val('');
				});
			},
			
			attach: function(setting) {
				this.settingEdited = setting;
				var board = this.mainDiv;
				board.appendTo(setting.mainDiv);
				
				// Populate editor with fields
				var fields = setting.fields;
				var editor = this;
				$.each(this.fields, function(idx, field) {
					var other = setting.fields['o' + idx.substr(1)];
					if (field.is(':checkbox')) {
						field.prop('checked', other.val() == 'true').off().click(function(e){
							console.log(idx + ": " + field.prop('checked'));
								other.val(field.prop('checked')).change();
							});
					}
					else if (field.is(':text')) {
						field.val(other.val()).off().keyup(function(e){
							other.val(field.val()).change();
						});
						
					}
				});
				
				// Do the bindings
			}
	};
	
	editor._bindFields();
	return editor;
}

/**
 * Takes a setting div and value from the settings
 * and populates the hidden and creates the setting object
 * @param val
 * @param setting
 */
function createSetting(settingDiv, val) {
	var res = {
			val    : val,
			mainDiv: settingDiv,
			fields : {
				// Note: Field to val mappings are
				// filed: oNAME, val: NAME
				// but we avoid automatic things here to have a proper list
				oname   : $('.oname'  , settingDiv),
				otag	: $('.otag'   , settingDiv),
				otagfg	: $('.otagfg' , settingDiv),
				otagbg	: $('.otagbg' , settingDiv),
				otagnu	: $('.otagnu' , settingDiv),
				otext	: $('.otext'  , settingDiv),
				otextfg	: $('.otextfg', settingDiv),
				otextbg	: $('.otextbg', settingDiv)
			},
			divs   : {
				tag      : $('.contentTag'    , settingDiv),
				tagText  : $('.contentTagText', settingDiv),
				text     : $('.content'       , settingDiv),
				textText : $('.contentText'    , settingDiv)
			},
			
			/**
			 * Binds local fields to preview
			 * This meant to be used during initalization only
			 */
			_bindFields : function() {
				var me = this;
				$.each(this.fields, function (idx, field) {
					if (idx == 'oname') {
						this.keyup(function(e) {
							me.divs.tagText.text($(this).val());
						})
					}
					else {
						this.change(function(e) {
							me.updatePreview();
						});
					}
				});
			},
			
			/**
			 * Destroys this setting
			 */
			destroy: function() {
				$.each(this.fields, function (idx, field) {
					field.off();
				});
				this.fields = null;
				this.divs = null;
				this.mainDiv.remove();
			},
			
			/**
			 * Sets the fields based on val,
			 * optionally it assigns newval to val
			 */
			updateFields: function(newval) {
				// Assign the new val, if present
				if (newval)	this.val = newval;
				
				// make a copy because "this" changes in the $.each loop
				var val = this.val;
				$.each(this.fields, function (idx, field) {
					// We can use this trick, since we have the same name
					// between fields members and form inputs
					field.val(val[idx.substr(1)]).change(); 
				});
			},

			/**
			 * updates the preview for a setting
			 */
			updatePreview: function() {
				var fields = this.fields;
				
				var cssReset = {
					'color': '',
					'background-color': ''
				};
				
//				if (fields.otag.val()) {
					var css = $.extend({}, cssReset);
					if (fields.otagfg.val())
						css['color'] = fields.otagfg.val();
					if (fields.otagbg.val())
						css['background-color'] = fields.otagbg.val();
					this.divs.tag.css(css);
					this.divs.tagText.css('text-decoration', fields.otagnu.val() == 'true' ? 'none' : 'underline');
//				}
//				if (fields.otext.val()) {
					var css = $.extend({}, cssReset);
					if (fields.otextfg.val())
						css['color'] = fields.otextfg.val();
					if (fields.otextbg.val()) {
						css['background-color'] = fields.otextbg.val();
						css['border-radius'] = '6px';
					}
					else {
						css['border-radius'] = '';
					}
					this.divs.text.css(css);
//				}
			},
			
			/**
			 * Converts the hidden fields to a proper val for settings
			 */
			fieldsToVal: function() {
				var res = {};
				var val = this.val;
				$.each(this.fields, function (idx, field) {
					res[idx.substr(1)] = field.val(); 
				});
				return res;
			}
		};
	
	res._bindFields();
	return res;
}

/**
 * This adds a new setting, after it creates it
 * @param key name of the setting
 * @param val the value
 */
function addSetting(opts, container, val) {
	var setting = createSetting(divs.setting.clone());
	
	// Update the field values
	setting.updateFields(val);
	
	// Create some initial sentenses
	setting.divs.tagText.text(val.name);
	setting.divs.textText.text(loremIpsoum.random());

	// Bindings
	var setDiv = setting.mainDiv;
	$('.edit', setDiv).click(function(e) {
		if (editor.settingEdited != setting)
			editor.attach(setting);
		else
			editor.detach();
	});
	
	$('.delete', setDiv).click(function(e) {
		setting.destroy();
		delete settings[val.name];
	});
	
	setDiv.appendTo(container);
	settings[val.name] = setting;
	
	return setting;
}

/**
 * Creates a new array of options from the form
 * @returns 
 */
function formToLabels() {
	var res = {};
	
	$.each(settings, function(idx, setting) {
		var val = setting.fieldsToVal();
		res[val.name] = val;
	});
	
	return res;
}

function prepList(opts) {
	var container = $('#options');
	
	divs.enabled.prop('checked', opts.enabled == true);
	
	$.each(opts.labels, function(key, val) {
		addSetting(opts, container, val);
	});  

	$('.pageactions .addrule').click(function(e) {
		var val = $.extend({}, emptyOption);
		// Add it detached
		//opts.labels[val.name] = val;
		var setting = addSetting(opts, container, val);
		editor.attach(setting);
	});

	$('.pageactions .save').click(function(e) {
		// We need to convert settings list to options
		opts.enabled = divs.enabled.prop('checked');
		opts.labels = formToLabels();
		try {
			chrome.storage.sync.set({'options': opts}, function() {
				if (chrome.runtime.error) {
					console.log("Runtime error.");
				}
			});
		} catch (err) {
			console.log("Chrome not pressent, can't save");
			divs.debugText.val(JSON.stringify(opts, null, '\t'));
			console.log(opts);
		}
		window.close();
	});
	
	$('.pageactions .loadsaved').click(function(e) {
		clearForm();
		loadCallback({options: opts});
	});
	
	$('.pageactions .defaults').click(function(e) {
		clearForm();
		loadCallback(stubOptions);
	});
}

/**
 * Clears the form
 */
function clearForm() {
	$('.pageactions input').off();
	$.each(settings, function(idx, setting) {
		setting.destroy();		
		delete settings[idx];
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
	var opts;
	
	// First time load
	if (outerOpts.options === undefined) {
		opts = stubOptions.options;
	}
	else {
		// the data will have my options in the thing called "options"
		opts = outerOpts.options;
	}
		
	gopts = opts;
	
	prepList(opts);
};


jQuery(document).ready(function() {
	// Assign shortcuts
	rawColorsText = document.getElementById("raw-colors");
	enabledCheck  = document.getElementById("enabled");
	
	divs = {
			enabled  : $('#enabled'),
			setting  : $('.setting').detach().show(),
			board    : $('.board').detach().show(),
			debugDiv : $('#debug'),
			debugText: $('#debugbox')
	}
	
	editor = createEditor(divs.board);
	
	// Load and trigger everything
	try {
		chrome.storage.sync.get("options", loadCallback);
		testMode = false;
	} catch (err) {
		testMode = true;
		loadCallback(stubOptions);
	}
	
//	if (testMode) {
//		divs.debugDiv.show();
//		$('#options').css('margin-right', '380px');
//	}
//	else
//		divs.debugDiv.hide();
});

