
export const displaySearchbar = ({ hideSearchbar, engine }) => {
  const searchElement = document.querySelector("#searchbar-element");
  const searchInput = searchElement.querySelector("input");
  let prevValue;
  let searchURL;


  searchElement.addEventListener("submit", (event) => {
    event.preventDefault();


    const value = searchInput.value;

    if (!hideSearchbar && value != prevValue && value != "") {
      prevValue = value;

      // == If URL: navigate directly
      if ((value.startsWith("http://") || value.startsWith("https://"))
        && value.indexOf(".") !== -1) {
        window.location.href = value;
      }
      // == Else: search in specified engine
      else {
        const query = encodeURIComponent(value);
        switch (engine) {
          case "bing":
            searchURL = `https://www.bing.com/search?q=${query}`;
            break;
          case "duckduckgo":
            searchURL = `https://duckduckgo.com/?q=${query}`;
            break;
          case "brave":
            searchURL = `https://search.brave.com/search?q=${query}`;
            break;
          default:
            searchURL = `https://www.google.com/search?q=${query}`;
            break;
        }
        // == Else: if searchURL correct, navigate to it & set fetching
        if (searchURL.startsWith("https://")) {
          searchElement.classList.add("fetch");
          window.location.href = searchURL;
        }
      }
    }
  })


  // * Change placeholder based on engine *//
  switch (engine) {
    case "bing":
      searchInput.placeholder = 'Search Bing or type a URL';
      break;
    case "duckduckgo":
      searchInput.placeholder = 'Search DuckDuckGo or type a URL';
      break;
    case "bing":
      searchInput.placeholder = 'Search Bing or type a URL';
      break;
    case "brave":
      searchInput.placeholder = 'Search Brave or type a URL';
      break;
    default:
      searchInput.placeholder = 'Search Google or type a URL';
      break;
  }


  // * Hide or show component part *//
  if (hideSearchbar) {
    searchElement.classList.add("hidden");
    return null;
  }
  else searchElement.classList.remove("hidden");

};