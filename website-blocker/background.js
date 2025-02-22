function updateRules() {
  chrome.storage.local.get("blockedSites", function (data) {
    const blockedSites = data.blockedSites || [];

    // Convert sites into declarativeNetRequest rules
    const rules = blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "redirect", redirect: { url: "https://www.google.com" } },
      condition: { urlFilter: site, resourceTypes: ["main_frame"] },
    }));

    // Update dynamic rules
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: Array.from(
          { length: blockedSites.length },
          (_, i) => i + 1
        ),
        addRules: rules,
      },
      () => console.log("Rules updated")
    );
  });
}

// Run when extension starts
chrome.runtime.onInstalled.addListener(updateRules);
chrome.storage.onChanged.addListener(updateRules);
