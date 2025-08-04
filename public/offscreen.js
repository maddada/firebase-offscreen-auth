const FIREBASE_HOSTING_URL = "https://sharptabs.com/extension-auth"; // Replace with your Firebase hosting URL
debugger
// Create iframe pointing to our extension-specific authentication page
const iframe = document.createElement("iframe");
iframe.src = "https://sharptabs.com/extension-auth";
iframe.style.width = "500px";
iframe.style.height = "600px";
iframe.style.border = "none";

// Add load event listener to debug iframe loading
iframe.onload = () => {
    console.log("[GOOGLE AUTH] Iframe loaded successfully");
};

iframe.onerror = (error) => {
    console.error("[GOOGLE AUTH] Iframe failed to load:", error);
};

console.log("[GOOGLE AUTH] Appending iframe to document body...");
document.body.appendChild(iframe);
console.log("[GOOGLE AUTH] Iframe appended, waiting for authentication messages...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAuth" && message.target === "offscreen") {
        function handleIframeMessage({ data }) {
            try {
                debugger
                const parsedData = JSON.parse(data);
                window.removeEventListener("message", handleIframeMessage);
                sendResponse(parsedData.user);
            } catch (e) {
                console.error("Error parsing iframe message:", e);
            }
        }

        window.addEventListener("message", handleIframeMessage);
        iframe.contentWindow.postMessage({ initAuth: true }, FIREBASE_HOSTING_URL);
        return true; // Indicates we will send a response asynchronously
    }
});
