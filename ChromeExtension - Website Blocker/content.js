chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "isReady") {
  // Send a response to the popup window indicating that the content script is ready
  sendResponse({isReady: true});
  }
  });
chrome.runtime.onMessage.addListener(function(message) {
  if (message.action == "hidePage") {
    // Hide the page by setting the body's display style to "none"
    document.body.style.display = "none";
  }
  if (message.action === "updateBlockedWebsitesList") {
    updateBlockedWebsitesList(message.blockedWebsites);
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Add an event listener to the form submission
  document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Get the value of the website input field
    var websiteInput = document.getElementById("websiteInput").value;
    // Create a URL object from the website input value
    var websiteUrl = new URL(websiteInput);
    // Get a string representation of the URL
    var website = websiteUrl.toString();
    // Send a message to the background script to update the list of blocked websites
    chrome.runtime.sendMessage({action: "blockWebsite", website: website});
  });

  // Add an event listener to the unblock button
  document.getElementById("unblockButton").addEventListener("click", function(event) {
    // Get the value of the website input field
    var website = document.getElementById("websiteInput").value;
    // Send a message to the background script to update the list of blocked websites
    chrome.runtime.sendMessage({action: "unblockWebsite", website: website});
  });
});

// document.addEventListener("DOMContentLoaded", function() {
//   chrome.runtime.sendMessage({ action: "getBlockedWebsites" }, function(blockedWebsites) {
//     // Update the list of blocked websites in the popup window
//     updateBlockedWebsitesList(blockedWebsites);
//   });
// });

function updateBlockedWebsitesList(blockedWebsites) {
  // Clear the current list of blocked websites
  document.getElementById("blocked-websites-list").innerHTML = "";

  // Add the code snippet here
  if (!blockedWebsites) {
    return;
  }

  // Add each blocked website to the list
  blockedWebsites.forEach(function(website) {
    
    var websiteElement = document.createElement("div");
    websiteElement.innerHTML = website;
    document.getElementById("blocked-websites-list").appendChild(websiteElement);
  });
}