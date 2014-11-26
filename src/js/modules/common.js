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
 * This turns out to be the application common object and needs to be renamed
 */
var labelMap = {

	/**
	 * We will keep the labels map here
	 */
	labels: {},

	/**
	 * @param label     The label name
	 * @param applyTo   'label' or 'text'
	 * @param fg        Foreground colour, could be empty
	 * @param bg        Background colour, could be empty
	 */
	add: function(label, applyTo, fg, bg) {
		if (!applyTo) applyTo = 'label';
		
		this.labels[label] = {'applyTo': applyTo, 'fg': fg, 'bg': bg};
	},
	
	clear: function () {
		this.labels = {};
	},
	
	defaults: function () {
		this.add('next'     , 'label', 'white', 'tomato');
		this.add('high'     , 'label', 'black', 'lightpink');
		this.add('medium'   , 'label', 'black', 'orange');
		this.add('low'      , 'label', 'black', 'skyblue');
		this.add('issue'    , 'label', 'black', 'palegreen');
		this.add('upmc'     , 'label', 'white', 'purple');
		this.add('urgent'   , 'text' , ''     , 'yellow');
	},

	/**
	 * Adds a comma seprated list of colours as labes with the same name
	 * i.e. "red, green, blue" will make #red to be rendered in red background,and so on
	 * param colors can be either a comma separated list (string) or an array 
	 */
	addNamedColors: function (colors) {
		if (!(colors instanceof Array)) {
			colors = colors.split(/\W*,\W*/);
		}
		
		colors.forEach(function(color) {
			this.add(color, 'label', null, color);
		});
	}
};
