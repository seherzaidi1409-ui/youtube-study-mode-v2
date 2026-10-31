
const STYLE_ID = "study-mode-style";

const FILTER_CSS = `
  /* Hide Shorts shelves */
  ytd-reel-shelf-renderer,
  ytd-rich-section-renderer:has(a[href*="/shorts/"]) {
    display: none !important;
  }

  /* Hide Shorts links in navigation */
  ytd-guide-entry-renderer:has(a[href="/shorts"]),
  ytd-mini-guide-entry-renderer:has(a[href="/shorts"]) {
    display: none !important;
  }

  /* Hide suggested videos beside the video player */
  ytd-watch-next-secondary-results-renderer,
  #related {
    display: none !important;
  }

  /* Hide end-screen video suggestions */
  .ytp-endscreen-content,
  .ytp-ce-element {
    display: none !important;
  }
    
  /* Hide the YouTube Home recommendation feed */
  ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
  ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer {
    display: none !important;
  }

`;

function applyStudyMode(enabled) {
  let style = document.getElementById(STYLE_ID);

  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = FILTER_CSS;
  } else if (style) {
    style.remove();
  }
}

function loadStudyMode() {
  chrome.storage.local.get(["studyMode"], (result) => {
    applyStudyMode(result.studyMode === true);
  });
}

loadStudyMode();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.studyMode) {
    applyStudyMode(changes.studyMode.newValue === true);
  }
});

// YouTube dynamically changes pages without refreshing.
const observer = new MutationObserver(() => {
  chrome.storage.local.get(["studyMode"], (result) => {
    if (result.studyMode === true) {
      applyStudyMode(true);
    }
  });
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

document.addEventListener("yt-navigate-finish", loadStudyMode);

console.log("YouTube Study Mode loaded!");
