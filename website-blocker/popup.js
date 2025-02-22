document.addEventListener("DOMContentLoaded", function () {
  const list = document.getElementById("blocked-list");
  const input = document.getElementById("website-input");
  const addButton = document.getElementById("add-button");

  function updateList() {
    chrome.storage.local.get("blockedSites", function (data) {
      list.innerHTML = "";
      (data.blockedSites || []).forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.addEventListener("click", function () {
          removeWebsite(site);
        });

        li.appendChild(removeButton);
        list.appendChild(li);
      });
    });
  }

  function removeWebsite(site) {
    chrome.storage.local.get("blockedSites", function (data) {
      const sites = (data.blockedSites || []).filter((s) => s !== site);
      chrome.storage.local.set({ blockedSites: sites }, updateList);
    });
  }

  addButton.addEventListener("click", function () {
    const site = input.value.trim();
    if (!site) return;

    chrome.storage.local.get("blockedSites", function (data) {
      const sites = data.blockedSites || [];
      if (!sites.includes(site)) {
        sites.push(site);
        chrome.storage.local.set({ blockedSites: sites }, updateList);
      }
    });

    input.value = ""; // Clear input field
  });

  updateList();
});
