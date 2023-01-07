// List of blocked websites
let blockedWebsites = [];

// Update the list of blocked websites when a message is received
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "blockWebsite") {
    // Get the current list of blocked websites
    chrome.storage.sync.get(["blockedWebsites"], function(result) {
      blockedWebsites = result.blockedWebsites;
      if (!blockedWebsites) {
        blockedWebsites = [];
      }
      // Add the new website to the list
      blockedWebsites.push(message.website);
      // Update the list of blocked websites in storage
      chrome.storage.sync.set({blockedWebsites: blockedWebsites}, function() {
        // Update the list of blocked URLs in the web request
        updateBlockedWebsites(blockedWebsites);
      });
    });
  } else if (message.action === "unblockWebsite") {
    // Get the current list of blocked websites
    chrome.storage.sync.get(["blockedWebsites"], function(result) {
      blockedWebsites = result.blockedWebsites;
      if (!blockedWebsites) {
        blockedWebsites = [];
      }
      // Remove the website from the list
      var index = blockedWebsites.indexOf(message.website);
      if (index !== -1) {
        blockedWebsites.splice(index, 1);
      }
      // Update the list of blocked websites in storage
      chrome.storage.sync.set({blockedWebsites: blockedWebsites}, function() {
        // Update the list of blocked URLs in the web request
        updateBlockedWebsites(blockedWebsites);
      });
    });
  } else  if (message.action === "getBlockedWebsites") {
    chrome.storage.sync.get(["blockedWebsites"], function(result) {
      sendResponse(result.blockedWebsites);
    });
  }
});

chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === "blockWebsite" || message.action === "unblockWebsite") {
    chrome.storage.sync.get(["blockedWebsites"], function(result) {
      // Update the list of blocked websites in the popup window
      document.addEventListener("DOMContentLoaded", function() {
        // Send a message to the content script to check if it is ready
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "isReady"}, function(response) {
            // If the content script is ready, send the message to update the list of blocked websites
            if (response && response.isReady) {
              chrome.tabs.sendMessage(tabs[0].id, {action: "updateBlockedWebsites", blockedWebsites: result.blockedWebsites});
            }
          });
        });
      });
    });
  }
});


function updateBlockedWebsites(blockedWebsites) {
  // Remove the old web request listener
  chrome.webRequest.onBeforeRequest.removeListener(blocker);

  // If there are no blocked websites, return
  if (blockedWebsites.length === 0) {
    return;
  }

  // Add a new web request listener with the updated list of blocked websites
  chrome.webRequest.onBeforeRequest.addListener(
    blocker,
    {urls: blockedWebsites},
    ["blocking"]
  );
}

function blocker(details) {
  return {cancel: true};
}