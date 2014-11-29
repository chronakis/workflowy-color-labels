/**
 * Random phrases
 */
var loremIpsoum = {
		random: function () {
			return this.phrases[Math.floor((Math.random() * this.phrases.length))];
		},
		
		phrases: [
                   "Nullam a ex eu nisl vestibulum rutrum sit amet.",
                   "Donec at accumsan neque. Suspendisse potenti.",
                   "Suspendisse tempus suscipit elit, feugiat volutpat.",
                   "Praesent mollis lobortis felis dignissim dapibus.",
                   "Vestibulum vel orci nulla. Mauris ullamcorper massa.",
                   "Ut sit amet volutpat urna. Quisque gravida, erat.",
                   "Etiam luctus, sapien eget finibus pellentesque.",
                   "Quisque odio risus, elementum in pretium sed."
                   ]
};

/**
 * stub options file
 */
var stubOptions = {
	options: {
		enabled: true,
		labels: {
				"next": {
					"applyTo": "label",
					"fg" : "white",
					"bg" : "tomato",
					// New stuff
					tag: true,
					tagfg: null,
					tagbg: "tomato",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"high": {
					"applyTo": "label",
					"fg": "black",
					"bg": "lightpink",
					// New stuff
					tag: true,
					tagfg: null,
					tagbg: "lightpink",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"medium": {
					"applyTo": "label",
					"fg": "black",
					"bg": "orange",
					// New stuff
					tag: true,
					tagfg: null,
					tagbg: "orange",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"low": {
					"applyTo": "label",
					"fg": "black",
					"bg": "skyblue",
					// New stuff
					tag: true,
					tagfg: null,
					tagbg: "skyblue",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"issue": {
					"applyTo": "label",
					"fg": "black",
					"bg": "palegreen",
					// New stuff
					tag: true,
					tagfg: "black",
					tagbg: "palegreen",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"upmc": {
					"applyTo": "label",
					"fg": "white",
					"bg": "purple",
					// New stuff
					tag: true,
					tagfg: null,
					tagbg: "purble",
					tagnounder: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"urgent": {
					"applyTo": "text",
					"fg": "",
					"bg": "yellow",
					// New stuff
					tag: false,
					tagfg: null,
					tagbg: null,
					tagnounder: null,
					text: true,
					textfg: null,
					textbg: "yellow"					
				}
			}
		},
		
	// Just name your colour
	namedColorsFg: ["red", "yellow", "blue", "orange"],
	
	// For simplicity, we use only normal (black) and inverted (white)
	namedColorsBg: [
		{bg: "tomato",    inv: true},
		{bg: "lightpink", inv: false},
		{bg: "yellow",    inv: false}
	]
};

var colorList = [
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
	"darkslategray", "black"];


/*
 * Legacy options
 */
function legacyBindings() {
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
	
	//Not used, but it took me some time to find about it, so I leave it here
	//	// Send message to content to reload
	//	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	//	  chrome.tabs.sendMessage(tabs[0].id, {action: "saved"}, function(response) {
	//		console.log("Reply was: " + response.reply);
	//	  });
	//	});		
		
		window.close();
	};
	
	document.getElementById("cancel").onclick = function() {
		chrome.storage.sync.get("options", loadCallback);
	};
	
	document.getElementById("validate").onclick = function() {
		try{
			JSON.parse(rawColorsText.value);
			alert("Valid JSON!");
		}
		catch(err) {
			alert("Not a valid JSON syntax.\n\nPlease consider restoring defaults or last saved version");
		}
	};
	
	document.getElementById("restore").onclick = function() {
		enabledCheck.checked = true;
		labelMap.clear();
		labelMap.defaults();
		//labelMap.addSimpleColors(arColors);
		rawColorsText.value = JSON.stringify(labelMap.labels, null, '\t');
	};
}


