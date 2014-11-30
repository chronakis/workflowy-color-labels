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

var colorUtil = {
		/**
		 * Gets a string such as rgb(r, g, b) or rgba(r, g, b, a)
		 * and returns an array of numbers in the form of {r, g, b}
		 */
		rgbTextToArray: function(rgbText) {
			var m = /^\s*rgba?\(([^,]+?),([^,]+?),([^,]+?)(?:,([^,]+?))?\)\s*$/i.exec(rgbText);
			if (!m)
				return null;
			var res = {
		    	r: parseFloat(m[1]),
		    	g: parseFloat(m[2]),
		    	b: parseFloat(m[3])
			};
			if (m[4])
				res['a'] = parseFloat(m[4]);
			
			return res;
		},
		
		/**
		 * Takes a hex color and converts it to an array of {r, g, b}
		 */
		hexToArray: function(hex) {
		    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		        return r + r + g + g + b + b;
		    });

		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		},
		
		colorToArray: function(color) {
			if (color.match(/\s*rgba?\(/i))
				return this.rgbTextToArray(color);
			else
				return this.hexToArray(color);
		},
		
		/**
		 * Turns an rgb color to perceived brightness
		 * @param RGBArray An array of three or four values
		 *                 [R, G, B]   : Values in 0..255
		 *                 [R, G, B, A]: RGB values in  0..255, Alpha in 0..1
		 * @return The perceived brightness between 0..255
		 */
		brightness: function(rgba) {
		   var R = rgba.r;
		   var G = rgba.g;
		   var B = rgba.b;
		   //var a = rgba.a;
		   
		   var res = Math.floor(Math.sqrt(
				      R * R * .241 + 
				      G * G * .691 + 
				      B * B * .068));
		   
		   // I should do something clever here about alpha,
		   // but there is no way of knowing the color of the element behind
		   return res;
		},
		
		/** Taks an {r, g, b} array and returns a hex */
		arrayToHex: function(arr) {
			return '#'
			+ this._intToHex(arr.r)
			+ this._intToHex(arr.g)
			+ this._intToHex(arr.b);
		},

		/**
		 * Gets a named color and returns it as an rgb array {r, g, b}
		 * @param named
		 * @param blockElm
		 * @returns
		 */
		namedToArray: function(named, blockElm) {
			var initBG = blockElm.css('background-color');
			blockElm.css('background-color', named);
			var bgRGB = blockElm.css('background-color');
			blockElm.css('background-color', initBG);
			return this.colorToArray(bgRGB);
		},
		
		/**
		 * Gets a color string and returns the suggested foreground
		 * @param background Any valid css color string
		 */
		autoColor: function (background) {
			var b = this.brightness(this.colorToArray(background));
			return b < this._thressold ? this._lightColor : this._darkColor;
		},
	
		_lightColor : 'white',
		_darkColor  : 'black',
		_thressold  : 130,
		
		/** int to hex with leading zeros */
		_intToHex: function(i) {
		    var hex = i.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		},
		
		/** The named colors in nice order */
		namedColors:[
		            "yellow", "lightyellow", "lemonchiffon", "lightgoldenrodyellow", "papayawhip", "moccasin",
		         	"peachpuff", "palegoldenrod", "khaki", "darkkhaki", "gold", "none", "cornsilk", "blanchedalmond",
		         	"bisque", "navajowhite", "wheat", "burlywood", "tan", "rosybrown", "sandybrown", "goldenrod",
		         	"darkgoldenrod", "Peru", "chocolate", "saddlebrown", "sienna", "brown", "maroon", "lightgrey",
		         	"none", "darkolivegreen", "olive", "olivedrab", "yellowgreen", "limegreen", "lime", "lawngreen",
		         	"chartreuse", "greenyellow", "springgreen", "mediumspringgreen", "lightgreen", "palegreen",
		         	"darkseagreen", "mediumseagreen", "seagreen", "forestgreen", "green", "darkgreen", "none",
		         	"mediumaquamarine", "aqua", "cyan", "lightcyan", "paleturquoise", "aquamarine", "turquoise",
		         	"mediumturquoise", "darkturquoise", "lightseagreen", "cadetblue", "darkcyan", "teal", "lightgrey",
		         	"none", "lightsteelblue", "powderblue", "lightblue", "skyblue", "lightskyblue", "deepskyblue",
		         	"dodgerblue", "cornflowerblue", "steelblue", "royalblue", "blue", "mediumblue", "darkblue", "navy",
		         	"midnightblue", "none", "lavender", "thistle", "plum", "violet", "orchid", "fuchsia", "Magenta",
		         	"mediumorchid", "mediumpurple", "blueviolet", "darkviolet", "darkorchid", "darkmagenta", "purple",
		         	"indigo", "darkslateblue", "slateblue", "mediumslateblue", "lightgrey", "none", "white", "snow",
		         	"honeydew", "mintcream", "azure", "aliceblue", "ghostwhite", "whitesmoke", "seashell", "beige",
		         	"oldlace", "floralwhite", "ivory", "antiquewhite", "linen", "lavenderblush", "mistyrose", "none",
		         	"gainsboro", "lightgrey", "silver", "darkgray", "gray", "dimgray", "lightslategray", "slategray",
		         	"darkslategray", "black"
		         ],
		         
		buildNamedToHexMap: function(blockElm) {
			var res = {};
			this.namedColors.forEach(function(i){
				var bgArr = colorUtil.namedToArray(i, blockElm);
				res[i] = colorUtil.arrayToHex(bgArr);
			});
			return res;
		}
}


/**
 * This turns out to be the application common object and needs to be renamed
 * DEPRECATED, Check if it is used anywehre and delete it
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
