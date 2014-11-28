/**
  * stub options file
  */
var stubOptions = {
	options: {
		enabled: true,
		labels: {
				"next": {
					"applyTo": "label",
					"fg": "white",
					"bg": "tomato"
				},
				"high": {
					"applyTo": "label",
					"fg": "black",
					"bg": "lightpink"
				},
				"medium": {
					"applyTo": "label",
					"fg": "black",
					"bg": "orange"
				},
				"low": {
					"applyTo": "label",
					"fg": "black",
					"bg": "skyblue"
				},
				"issue": {
					"applyTo": "label",
					"fg": "black",
					"bg": "palegreen"
				},
				"upmc": {
					"applyTo": "label",
					"fg": "white",
					"bg": "purple"
				},
				"urgent": {
					"applyTo": "text",
					"fg": "",
					"bg": "yellow"
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
