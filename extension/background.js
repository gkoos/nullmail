const api = typeof browser !== 'undefined' ? browser : chrome;

// Store tab history to track redirects from mailbox pages to /expired
const tabHistory = new Map();

// Monitor tab navigation to detect new email addresses AND track redirects
api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check for redirect to expired page
    if (tab.url.match(/https:\/\/(www\.)?nullmail\.cc\/expired/)) {
      checkForExpiredEmailFromTab(tabId);
    }
    
    // Check for new email addresses
    const emailMatch = tab.url.match(/https:\/\/(www\.)?nullmail\.cc\/([^/?]+@[^/?]+)/);
    if (emailMatch) {
      const email = emailMatch[2];
      addEmailToMenu(email);
      
      // Store this email for this tab in case it expires
      tabHistory.set(tabId, email);
    }
  }
});

// Clean up tab history when tabs are closed
api.tabs.onRemoved.addListener((tabId) => {
  tabHistory.delete(tabId);
});

// Function to check if a redirect to /expired came from a mailbox page
async function checkForExpiredEmailFromTab(tabId) {
  const lastEmail = tabHistory.get(tabId);
  if (lastEmail) {
    await removeEmailFromMenu(lastEmail);
    tabHistory.delete(tabId);
  }
}

// Monitor API requests for expired emails (404s) - for inactive tabs
api.webRequest.onCompleted.addListener(
  async (details) => {
    // Check for email expiry (404 on GET /api/emails/[email])
    if (details.method === 'GET' && 
        details.url.match(/\/api\/emails\/[^/?]+$/) && 
        details.statusCode === 404) {
      
      const email = details.url.split('/').pop();
      await removeEmailFromMenu(email);
    }
  },
  { urls: ["https://www.nullmail.cc/api/emails/*", "https://nullmail.cc/api/emails/*"] }
);

async function addEmailToMenu(email) {
  const result = await api.storage.local.get(['addresses']);
  const addresses = result.addresses || [];
  
  if (!addresses.includes(email)) {
    addresses.push(email);
    await api.storage.local.set({ addresses });
    await createMenus();
  }
}

async function removeEmailFromMenu(email) {
  const result = await api.storage.local.get(['addresses']);
  const addresses = result.addresses || [];
  
  const filteredAddresses = addresses.filter(addr => addr !== email);
  await api.storage.local.set({ addresses: filteredAddresses });
  await createMenus();
}

function createMenus() {
  return new Promise((resolve) => {
    // Detect browser and set appropriate context
    const isFirefox = typeof browser !== 'undefined';
    const contextType = isFirefox ? "browser_action" : "action";
    
    api.contextMenus.removeAll(() => {
      api.contextMenus.create({
        id: "generate",
        title: "Generate Mailbox",
        contexts: [contextType]
      });
      
      api.storage.local.get("addresses", ({ addresses }) => {
        (addresses || []).forEach(addr => {
          api.contextMenus.create({
            id: addr,
            title: addr,
            contexts: [contextType]
          });
        });
        resolve();
      });
    });
  });
}

api.runtime.onInstalled.addListener(createMenus);
api.runtime.onStartup.addListener(createMenus);

api.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "generate") {
    api.tabs.create({ url: "https://www.nullmail.cc/?fromExtension=1" });
  } else {
    // Existing address clicked
    const addr = info.menuItemId;
    api.tabs.create({ url: `https://www.nullmail.cc/${addr}?fromExtension=1` });
  }
});
