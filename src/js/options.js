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
			
			pickers: {
				btagfg	: $('#btagfg' , board),
				btagbg	: $('#btagbg' , board),
				btextfg	: $('#btextfg', board),
				btextbg	: $('#btextbg', board),
				palette: [
					        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
					        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
					        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
					        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
					        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
					        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
					        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
					        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
					    ]
			},
			
			_bindButtons: function() {
				var editor = this;
				var fields = this.fields;
				var pickers = this.pickers;
				var opts = {
					    showPaletteOnly: true,
					    togglePaletteOnly: true,
					    hideAfterPaletteSelect:true,
					    togglePaletteMoreText: 'more colors',
					    togglePaletteLessText: 'less colors',
					    color: 'blanchedalmond',
					    palette: pickers.palette						
				};
				
				opts['change'] = function(color) { fields.etagfg.val(color.toHexString()).keyup(); };
				pickers.btagfg.spectrum(opts);

				opts['change'] = function(color) { fields.etagbg.val(color.toHexString()).keyup(); };
				pickers.btagbg.spectrum(opts);
				
				opts['change'] = function(color) { fields.etextfg.val(color.toHexString()).keyup(); };
				pickers.btextfg.spectrum(opts);
				
				opts['change'] = function(color) { fields.etextbg.val(color.toHexString()).keyup(); };
				pickers.btextbg.spectrum(opts);
				
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
					var picker = editor.pickers['b' + idx.substr(1)];
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
						picker.spectrum("set", field.val());
					}
				});
				
			},
//			
//			_buildColorMenu: function(menu, type) {
//				menu.detach();
//				menu.show();
//				var colorList;
//				if (type == 'fg') {
//					colorList = colorUtil.namedColors.reverse();
//				}
//				else {
//					colorList = ['white'].concat(colorUtil.namedColors);
//				}
//				var optstr = '<option></option>';
//				
//				menu.append($(optstr).text("auto").attr('value', 'auto'));
//				//menu.append($(optstr).text("Default").attr('value', 'auto'));
//				colorList.forEach(function(name) {
//					var opt = $(optstr).text(name).attr('value', name);
//					if (type == 'bg')
//						opt.css('background-color', name);
//					else 
//						opt.css('color', name);
//					menu.append(opt);
//				});
//				return menu;
//			},
//			
//			menufg: null,
//			menubg: null,
//			
//			namedColorMap: null,
//			
//			_buildColorMenus: function () {
//				this.menufg = this._buildColorMenu($('#coloroptfg'), 'fg');
//				this.menubg = this._buildColorMenu($('#coloroptbg'), 'bg');
//				if (!this.namedColorMap)
//					this.namedColorMap = colorUtil.buildNamedToHexMap($('.pageactions'));
//			},
//			
//			showMenuFg: function(source, other) {
//				var menu = this.menufg;
//				var fg = source.val();
//				var bg = other;
//				
//				var top = source.position().top + source.height() + 7;
//				var left = source.position().left + 1;
//				
//				menu.css({top: top, left: left});
//				
//				// Check to see if we need to change the background
//				if (bg && bg != 'auto') {
//					//$('option', this.menufg).css('background', bg);
//				}
//				
//				//$('option:first', this.menufg).css('color', )
//				menu.off().change(function(e){
//					source.val(this.value).keyup();
//					menu.detach();
//				});
//				
//				source.after(menu);
//				$('body').mouseup(function(e) {
//				    if (!$(e.target).closest(menu).length){
//						menu.detach();
//				    }
//				});
//				
//				return menu;
//			},
//			
//			showMenuBg: function(source, other) {
//				var menu = this.menubg;
//				var bg = source.val();
//				var fg = other;
//				
//				var top = source.position().top + source.height() + 7;
//				var left = source.position().left + 1;
//				
//				menu.css({top: top, left: left});
//				
//				// Check to see if we need to change the background
//				if (fg && fg != 'auto') {
//					//$('option', this.menubg).css('color', fg);
//				}
//				else {
//					//$('option', this.menubg).css('color', colorUtil.autoColor(this.namedColorMap[bg]));
//				}
//				
//				menu.off().change(function(e){
//					source.val(this.value).keyup();
//					menu.detach();
//				});
//
//				source.after(menu);
//				$('body').mouseup(function(e) {
//				    if (!$(e.target).closest(menu).length){
//						menu.detach();
//				    }
//				});
//				
//				source.after(menu);
//				return menu;
//			}
			
	};
	
	editor._bindButtons();
	//editor._buildColorMenus();
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

