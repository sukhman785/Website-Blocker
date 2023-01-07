# Website-Blocker
Website blocker is a Google Chrome extension that allows users to block access to specific websites. The extension works by intercepting web requests and cancelling them if the website is on the user's blocked list.

# How it works
The extension has three main components: the background script, the content script, and the popup window. The background script is responsible for maintaining the list of blocked websites and updating the web request to block the websites. The content script is injected into every page and listens for a message from the background script to hide the page if it is on the list of blocked websites. The popup window allows the user to view and modify the list of blocked websites.

# Technologies used

- Chrome extension API
- JavaScript
- HTML/CSS

# To use the extension, follow these steps:

1. Download and install the extension from the Chrome web store.
2. Open the extension's popup window by clicking on the extension icon in the top right of your browser.
3. Enter the website you want to block in the form and click "Block".
4. To unblock a website, select it from the list of blocked websites and click "Unblock".

# Future improvements:

- Add an overlay image to display when a website is blocked.
- Fix bugs in the blocked websites list in the popup window.
- Update the extension to work with manifest version 3 when support for version 2 is removed.
