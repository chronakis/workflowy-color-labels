/*
 * This script is loaded with the popup, I think
 */

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
     // "sample_setting": "This is how you use Store.js to remember values"
// });


// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {

  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
    {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'workflowy.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
}); 

