// ---- Rate extension popup ---- //

(() => {
  "use strict";
  (() => {
    const APPEAR_TIMEOUT = 100 * 1000 * 60;
    const MAX_CLOSE_COUNT = 1;
    const browser_cr = chrome ? chrome : browser;
    const STORE_LINKS = {
      "chrome": "https://chromewebstore.google.com/detail/memento-minimalistic-home/feiooleecmhaceomemdjchnkahocjgjg",
      "firefox": "https://addons.mozilla.org/en-US/firefox/addon/SpoPlus/reviews/",
      "edge": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews",
      "opera": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews"
    }

    function detectBrowser() {
      const agent = navigator.userAgent;
      if (agent.includes("Edg")) return "edge";
      if (agent.includes("OPR")) return "opera";
      if (agent.includes("Chrome")) return "chrome";
      if (agent.includes("Firefox")) return "firefox";

      // Default to Chrome
      return "chrome";
    }

    const initRateMePopup = async () => {
      const browser = detectBrowser();

      const isThreeDaysLeftFromInstall = async () => {
        // return true;
        const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
        const result = await new Promise((resolve) =>
          chrome.storage.local.get("formState", (result) => resolve(result))
        );
        const timestamp = result?.formState?.timestamp;

        if (timestamp == null || isNaN(timestamp)) {
          return true; // treat missing or invalid timestamps as "3 days left"
        }
        return (timestamp + THREE_DAYS_IN_MS) < Date.now();
      };
      
      if (browser && STORE_LINKS[browser] && await isThreeDaysLeftFromInstall()) {
        browser_cr.storage.local.get('closeCount', function (data) {

          if (!data.closeCount) {
            browser_cr.storage.local.set({ 'closeCount': 0 });
          }


          if (!data.closeCount || data.closeCount < MAX_CLOSE_COUNT) {
            const notification = document.createElement('div');
            notification.setAttribute('id', "ext_show");
            const logo = browser_cr.runtime.getURL('assets/icons/icon128.png');
            notification.innerHTML = `
            <div><div class="groupl">${logo ? `<img src = "${logo}" alt = "logo" /> ` : ''}
            <h1>It would really help.</h1></div><p>If you enjoy using this start page,
            would you mind rate it on the webstore,
            then?</p><a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink" data-action="RATE">Rate it</a><div class="cls"><span id="closeNotification" data-action="CLOSE" style="cursor: pointer;">No,
            Thanks</span></div></div><style id="43ggfdbt5rf">#ext_show img,
            #ext_show p {
              user-select: none;
              pointer-events: none;
            }

            #ext_show h1 {
              display: block;
              text-align: left;
              color: #ffffff !important;
              font-weight: 600;
              font-size: 21px;
              line-height: 21px;
              margin: 0;
            }

            #ext_show .groupl {
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px 0 10px -5px;
            }

            #ext_show h1.first {
              margin-bottom: 5px;
            }

            #ext_show p {
              max-width: 290px;
              font-size: 14px;
              font-size: 12.8px;
              font-weight: 400;
              margin: 8px 0 16px;
              color: #868b90 !important;
              line-height: 140%;
              text-align: center;
            }

            #ext_show a {
              text-decoration: none !important;
              display: block;
              border: 1px solid rgb(68, 86, 91, 0.5);
              border-radius: 22px;
              padding: 7px 10px;
              margin: 10px auto;
              max-width: 270px;
              background-color: rgba(255, 255, 255, 0.16) !important;
              color: white !important;
              text-align: center;
              font-size: 14px;
              font-size: 14.5px;
            }

            #ext_show a:hover {
              text-decoration: none;
              background-color: rgba(255, 255, 255, 0.1) !important;
            }

            #ext_show a:focus {
              text-decoration: none;
            }

            #ext_show>div {
              transform: scale(1);
              box-shadow: rgba(0, 0, 0, 0.8) 0px 8px 24px;
              z-index: 100000 !important;
              font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
              width: 296px;
              position: fixed;
              top: 10px;
              right: 10px;
              background-color: #161515 !important;
              background-color: rgb(22, 21, 21, 0.96) !important;
              padding: 5px 12px 8px;
              box-sizing: border-box;
              border: 1px solid rgb(68, 86, 91, 0.5);
              z-index: 100;
              border-radius: 12px
            }

            #ext_show * {
            text-shadow: none!important;
            font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif!important;
            }

            #ext_show img {
              margin-right: 10px;
              height: 33px;
              width: auto;
              max-width: 40px;
            }

            #ext_show .cls {
              display: flex;
              justify-content: center;
            }

            #closeNotification {
              display: inline-block;
              margin: 0 auto;
              padding-left: 4px;
              text-align: center;
              font-size: 11px;
              font-size: 10.5px;
              color: #72767a !important;
            }

            #closeNotification:hover {
              text-decoration: underline;
            }

            </style>
              `;

            const appendPopup = () => {
              // Append the notification to the body
              document.body.appendChild(notification);

              // Event listener to the close button
              const closeBtn = document.getElementById('closeNotification');
              if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                  // browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                  notification.style.display = 'none';
                });
              }

              // set closeCount -= 1 even if not closed
              if (data.closeCount) {
                browser_cr.storage.local.set({ 'closeCount': closeCount - 1 });
              }

              // Event listener to the rate link
              const rateLink = document.getElementById('rateLink');
              if (rateLink) {
                rateLink.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                  notification.style.display = 'none';
                });
              }

              // }
            }
            setTimeout(appendPopup, APPEAR_TIMEOUT);
          }
        });
      }
    };
    //Init get state and do delay
    document.addEventListener("DOMContentLoaded", initRateMePopup, false);
  })();
})(this);