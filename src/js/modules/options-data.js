var emptyOption = {
		name: "newtag",
		tag: false,
		tagfg: null,
		tagbg: null,
		tagnu: null,
		text: null,
		textfg: null,
		textbg: null
};

/**
 * stub options file
 */
var stubOptions = {
	options: {
		enabled: true,
		labels: {
				"next": {
					name: "next",
					tag: true,
					tagfg: null,
					tagbg: "tomato",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"high": {
					name: "high",
					tag: true,
					tagfg: null,
					tagbg: "lightpink",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"medium": {
					name: "medium",
					tag: true,
					tagfg: null,
					tagbg: "orange",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"low": {
					name: "low",
					tag: true,
					tagfg: null,
					tagbg: "skyblue",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"issue": {
					name: "issue",
					tag: true,
					tagfg: "black",
					tagbg: "palegreen",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
				},
				"upmc": {
					name: "upmc",
					tag: true,
					tagfg: null,
					tagbg: "purple",
					tagnu: null,
					text: false,
					textfg: null,
					textbg: null
					
				},
				"mark": {
					name: "mark",
					tag: false,
					tagfg: 'blue',
					tagbg: null,
					tagnu: null,
					text: true,
					textfg: null,
					textbg: "yellow"					
				}
			}
		}
};

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
