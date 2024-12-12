//   - This file is part of Memento Extension
//  <https://github.com/gerwld/Memento-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present Memento Extension
//   -
//   - Memento Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - Memento Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with Memento Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.

(() => {
  "use strict";
  (() => {
    let interval0, interval1, interval2, interval3, interval4, interval5, interval6, interval7;
    const fonts = [
      "noto_sans",
      "pixelify",
      "montserrat",
      "poppins",
      "merriweather",
      "nunito",
      "gabarito",
      "playfair",
      "roboto",
      "roboto_condensed",
      "caprasimo",
      "inter"
    ];
    const themes = ["light_green", "purple_dark", "kittens"];
    const browser_cr = chrome ? chrome : browser;

    // document.documentElement.style.opacity = 0;

    function splashScreenDelay(delay = 1000) {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.style.opacity = 0;
        setTimeout(() => (document.body.style.opacity = 1), delay);
      })
    }

    // Listen for changes in browser_cr.storage.local
    let prevstate;
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      if (
        changes.formState &&
        changes.formState.newValue &&
        JSON.stringify({ ...changes.formState.newValue }) !== prevstate
      ) {
        prevstate = JSON.stringify({ ...changes.formState.newValue });
        getCurrentState();
      }
    });

    function setTheme(selectedTheme) {
      // Set theme if exists, then delete others
      if (themes.indexOf(selectedTheme) !== -1) {
        setOrRemoveStylesOfItem(`/assets/graphs/themes/${selectedTheme}.css`, true, selectedTheme);
      }
      themes.filter((e) => e !== selectedTheme).forEach((theme) => document.getElementById(theme)?.remove());
    }


    //Calls the same function x count per timeout
    function bombardier(func, timeout, count) {
      let i = 0;
      function executeFunction() {
        if (i < count) {
          func();
          i++;
          setTimeout(executeFunction, timeout);
        }
      }
      executeFunction();
    }


    function setFont(selectedFont) {
      // Set font if exists, then delete others
      if (fonts.indexOf(selectedFont) !== -1) {
        setOrRemoveStylesOfItem(`/assets/graphs/fonts/${selectedFont}.css`, true, selectedFont);
      }
      fonts.filter((e) => e !== selectedFont).forEach((font) => document.getElementById(font)?.remove());
    }

    function setOrRemoveStylesOfItem(assetPath, item, item_id) {
      // Fetch the CSS file and append it
      fetch(browser_cr.runtime.getURL(assetPath))
        .then((response) => response.text())
        .then((css) => {
          let current = document.getElementById(item_id);
          let style = document.createElement("style");
          style.textContent = css;
          style.setAttribute("id", item_id);
          if (item && !current) document.head.appendChild(style);
          else if (!item && current instanceof Node) document.head.removeChild(current);
        }).catch(_ => { });
    }

    function toggleClassicMode(assetPath, state) {
      clearInterval(interval0);
      setOrRemoveStylesOfItem(assetPath, state, "classic_mode");
      function setClassic() { }
      if (state) interval0 = setInterval(setClassic, 200);
      else clearInterval(interval0);
    }

    // Removes all vanity metrics in realtime + hides static
    function toggleVanity(state) {
      clearInterval(interval1);
      setOrRemoveStylesOfItem("/assets/graphs/disable_vanity.css", state, "disable_vanity");
      function toggle() {
        if (state) {
          let allVanityLikes = document.querySelectorAll("button._a9ze");
          allVanityLikes?.forEach((btn) => {
            let val = btn.innerText;
            if (!isNaN(val[0]) || !isNaN(val[val.length - 1])) {
              btn.classList.add("hide_ls2");
            }
          });
        }
      }
      if (state) interval1 = setInterval(toggle, 300);
      else clearInterval(interval1);
    }

    function toggleExplore(state) {
      clearInterval(interval2);
      setOrRemoveStylesOfItem("/assets/graphs/disable_explore.css", state, "disable_explore");
      function redirect() {
        if (state && window.location.href.includes("/explore")) {
          if (window.location?.assign) window.location.assign("/");
          else window.location.href = "/";
          console.log("Memento: Redirect");
          clearInterval(interval2);
        }
      }
      if (state) interval2 = setInterval(redirect, 300);
      else clearInterval(interval2);
    }

    function toggleReels(state) {
      clearInterval(interval3);
      setOrRemoveStylesOfItem("/assets/graphs/disable_reels.css", state, "disable_reels");
      function redirect() {
        if (state && window.location.href.includes("/reels")) {
          if (window.location?.assign) window.location.assign("/");
          else window.location.href = "/";
          console.log("Memento: Redirect");
          clearInterval(interval3);
        }
      }
      if (state) {
        interval3 = setInterval(redirect, 300);
      } else clearInterval(interval3);
    }

    function disableStories(ev_disable_stories, mp_disable_stories) {
      console.log(ev_disable_stories, mp_disable_stories)
      clearInterval(interval4);
      setOrRemoveStylesOfItem("/assets/graphs/ev_disable_stories.css", ev_disable_stories, "ev_disable_stories");
      setOrRemoveStylesOfItem("/assets/graphs/mp_disable_stories.css", mp_disable_stories, "mp_disable_stories");
      function redirect() {
        if (ev_disable_stories && window.location.href.includes("/stories/")) {
          if (window.location?.assign) window.location.assign("/");
          else window.location.href = "/";
          console.log("Memento: Redirect");
          clearInterval(interval4);
        }
      }
      if (ev_disable_stories) {
        interval4 = setInterval(redirect, 300);
      } else clearInterval(interval4);
    }

    // TODO: Make it work as fast as possible without window.location.href usage and Tabs permission.

    // function disableRecomendations(state) {
    //   clearInterval(interval5);


    //   function redirect() {
    //     const followbtn_parent = document.querySelector('.x7a106z.x78zum5.xp1r0qw.xtqikln.x1nhvcw1')
    //       || document.querySelector('.x11fxgd9').querySelector('div')
    //     const followbtn = followbtn_parent?.querySelectorAll('div')[1];

    //     if (state && window.location.href === "https://www.instagram.com/" || window.location.href.includes("://www.instagram.com/?")) {
    //       if (followbtn_parent && !window.location.href.includes("?variant=following")) {
    //         followbtn?.click();
    //         console.log("Memento: Setting Feed to Subscriptions Mode.");
    //       }
    //     }
    //   }

    //   if (state) {
    //     interval5 = setInterval(redirect, 1500);
    //   } else clearInterval(interval5);

    //   const bbRedirect = () => bombardier(redirect, 20, 2000)


    //   document.addEventListener("DOMContentLoaded", bbRedirect, false);
    // }

    function disableRecomendations(state) {
      clearInterval(interval5);
      function redirect() {

        // replace the / links to variant home.
        document.querySelectorAll('a[href="/"]')?.forEach(e => {
          let newLink = e.cloneNode(true);
          newLink.setAttribute("href", "/?variant=following")
          newLink.addEventListener("click", e => {
            e.preventDefault();
            if (window.location.href !== "https://www.instagram.com/?variant=following")
            window.location.href = "https://www.instagram.com/?variant=following";
          })
          e.parentNode.replaceChild(newLink, e);
        })

        if (state && (window.location.href === "https://www.instagram.com/" || window.location.href.indexOf("?variant=home") > -1)) {
          if (window.location?.assign) window.location.assign("/?variant=following");
          else window.location.href = "/?variant=following";
          clearInterval(interval5);
        }
      }

      if (state) {
        interval5 = setInterval(redirect, 300);
      } else {
        clearInterval(interval5);
        document?.querySelectorAll('a[href="/?variant=following"]')?.forEach(e => e.setAttribute("href", "/"))
      }
    }

    function navToMessages(state) {
      clearInterval(interval7);

      function redirect() {
        function checkURL() {
          //when one from that substrings is found
          return ((window.location.href === "https://www.instagram.com/")
              || (window.location.href.indexOf(".com/?variant=") > -1)
              || (window.location.href.indexOf(".com/reels") > -1)
              || (window.location.href.indexOf(".com/explore") > -1))
            //but not that substring
            && window.location.href.indexOf("/direct/") === -1;
        }

        
        if (state && checkURL()) {
          clearInterval(interval7);
          if (window.location?.assign) window.location.assign("/direct/inbox/");
          else window.location.href = "/direct/inbox/";
        }
      }

      if (state) {
        interval7 = setInterval(redirect, 300);
      } else {
        clearInterval(interval7);
      }
    }

    function disableVideos(state) {
      clearInterval(interval6);
      setOrRemoveStylesOfItem("/assets/graphs/block_videos.css", state, "block_videos");
      function redirect() {
        if (state) {
          const posts = document.querySelectorAll("article");
          posts.forEach((article) => {
            const videoTag = article.querySelector("video");
            if (videoTag) {
              article.classList.add("video");
              videoTag.remove();
            }
          });
        }
      }
      if (state) {
        interval6 = setInterval(redirect, 300);
      } else {
        // window.location.href = "/";
        clearInterval(interval6);
      }
    }

    function getCurrentState() {
      browser_cr.storage.local.get("formState", (result) => {
        const state = result.formState.disabled ? { a: true } : result.formState;

        // Styles setters
        // setOrRemoveStylesOfItem("/assets/graphs/mp_disable_feed.css", state.mp_disable_feed, "mp_disable_feed");
        // setOrRemoveStylesOfItem("/assets/graphs/disable_comments.css", state.disable_comments, "disable_comments");
        // setOrRemoveStylesOfItem("/assets/graphs/block_images.css", state.block_images, "block_images");
        // setOrRemoveStylesOfItem("/assets/graphs/counters_gray.css", state.counters_gray, "counters_gray");
        // setOrRemoveStylesOfItem("/assets/graphs/counters_disable.css", state.counters_disable, "counters_disable");
        // setOrRemoveStylesOfItem("/assets/graphs/grayscale.css", state.grayscale, "grayscale");

        // toggleClassicMode("/assets/graphs/classic_mode.css", state.classic_mode);
        // toggleVanity(state.disable_vanity);
        // toggleExplore(state.disable_explore);
        // toggleReels(state.disable_reels);
        // disableVideos(state.block_videos);
        // disableStories(state.ev_disable_stories, state.mp_disable_stories);
        // !state.nav_to_messages_first && disableRecomendations(state.mp_disable_recs);
        // navToMessages(state.nav_to_messages_first)

        // setOrRemoveStylesOfItem("/assets/graphs/square_shaped.css", state.square_shaped, "square_shaped");
        // setTheme(state.theme);
        setFont(state.font);
      });
      // To prevent layout bouncing
      setTimeout(() => {
        // if (document?.body?.style?.opacity)
        //   document.body.style.opacity = "all 0s!important";
        // if (document?.documentElement?.style?.opacity)
        //   document.documentElement.style.opacity = 1;
      }, 300)
    }


    // Listen for changes in browser_cr.storage.local
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      if (
        changes.formState &&
        changes.formState.newValue &&
        changes.formState.oldValue &&
        JSON.stringify({ ...changes.formState.newValue }) !== JSON.stringify({ ...changes.formState.oldValue })
      ) {
        getCurrentState({ ...changes.formState.oldValue });
      }

    });

    getCurrentState();

    //Init get state and do delay
    splashScreenDelay(0);
    document.addEventListener("DOMContentLoaded", getCurrentState, false);

  })();
})(this);
