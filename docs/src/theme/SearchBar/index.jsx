import React, { useRef, useCallback, useState, useEffect } from "react";
import clsx from "clsx";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from '@docusaurus/useGlobalData';
import useIsBrowser from "@docusaurus/useIsBrowser";
import { HighlightSearchResults } from "./HighlightSearchResults";
const Search = props => {
  const initialized = useRef(false);
  const searchBarRef = useRef(null);
  const [indexReady, setIndexReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { siteConfig = {} } = useDocusaurusContext();
  const pluginConfig = (siteConfig.plugins || []).find(plugin => Array.isArray(plugin) && typeof plugin[0] === "string" && plugin[0].includes("docusaurus-lunr-search"))
  const isBrowser = useIsBrowser();
  const { baseUrl } = siteConfig;
  const assetUrl = pluginConfig && pluginConfig[1]?.assetUrl || baseUrl;
  const initAlgolia = (searchDocs, searchIndex, DocSearch, options) => {
    new DocSearch({
      searchDocs,
      searchIndex,
      baseUrl,
      inputSelector: "#search_input_react",
      // Override algolia's default selection event, allowing us to do client-side
      // navigation and avoiding a full page refresh.
      handleSelected: (_input, _event, suggestion) => {
        const url = suggestion.url || "/";
        // Use an anchor tag to parse the absolute url into a relative url
        // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
        const a = document.createElement("a");
        a.href = url;
        _input.setVal(''); // clear value
        _event.target.blur(); // remove focus

        // Get the highlight word from the suggestion.
        let wordToHighlight = '';
        if (options.highlightResult) {
          try {
            const matchedLine = suggestion.text || suggestion.subcategory || suggestion.title;
            const matchedWordResult = matchedLine.match(new RegExp('<span.+span>\\w*', 'g'));
            if (matchedWordResult && matchedWordResult.length > 0) {
              const tempDoc = document.createElement('div');
              tempDoc.innerHTML = matchedWordResult[0];
              wordToHighlight = tempDoc.textContent;
            }
          } catch (e) {
            console.log(e);
          }
        }

        history.push(url, {
          highlightState: { wordToHighlight },
        });
      },
      maxHits: options.maxHits
    });
  };

  const pluginData = usePluginData('docusaurus-lunr-search');
  const getSearchDoc = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${assetUrl}${pluginData.fileNames.searchDoc}`).then((content) => content.json())
      : Promise.resolve({});

  const getLunrIndex = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${assetUrl}${pluginData.fileNames.lunrIndex}`).then((content) => content.json())
      : Promise.resolve([]);

  const loadAlgolia = () => {
    if (!initialized.current) {
      Promise.all([
        getSearchDoc(),
        getLunrIndex(),
        import("docusaurus-lunr-search/src/theme/SearchBar/DocSearch"),
        import("docusaurus-lunr-search/src/theme/SearchBar/algolia.css")
      ]).then(([searchDocFile, searchIndex, { default: DocSearch }]) => {
        const { searchDocs, options } = searchDocFile;
        if (!searchDocs || searchDocs.length === 0) {
          return;
        }
        initAlgolia(searchDocs, searchIndex, DocSearch, options);
        setIndexReady(true);
      });
      initialized.current = true;
    }
  };

  const toggleSearchIconClick = useCallback(
    e => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle && props.handleSearchBarToggle(!props.isSearchBarExpanded);
    },
    [props.isSearchBarExpanded]
  );

  let placeholder
  if (isBrowser) {
    loadAlgolia();
    placeholder = window.navigator.platform.startsWith("Mac") ?
      'Search ⌘+K' : 'Search Ctrl+K'
  }

  // auto focus search bar on page load
  useEffect(() => {
    if (props.autoFocus && indexReady) {
      searchBarRef.current.focus();
    }
  }, [indexReady]);

  // Close mobile search on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const openMobileSearch = useCallback(() => {
    setMobileOpen(true);
    loadAlgolia();
    setTimeout(() => searchBarRef.current?.focus(), 50);
  }, []);

  const closeMobileSearch = useCallback(() => {
    setMobileOpen(false);
    if (searchBarRef.current) {
      searchBarRef.current.value = '';
      searchBarRef.current.blur();
    }
  }, []);

  return (
    <div className={clsx("navbar__search", { "navbar__search--mobile-open": mobileOpen })} key="search-box">
      <lt-icon-button
        class="navbar__search-toggle navbar__header-btn"
        label="Open search"
        icon="search"
        size="sm"
        round
        onClick={openMobileSearch}
      />
      <span
        aria-label="expand searchbar"
        role="button"
        className={clsx("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder={indexReady ? placeholder : 'Loading...'}
        aria-label="Search"
        className={clsx(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded }
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        onKeyDown={(e) => { if (e.key === 'Escape') closeMobileSearch(); }}
        ref={searchBarRef}
        disabled={!indexReady}
      />
      {mobileOpen && (
        <lt-icon-button
          class="navbar__search-close navbar__header-btn"
          label="Close search"
          icon="xmark"
          size="sm"
          round
          onClick={closeMobileSearch}
        />
      )}
      <HighlightSearchResults />
    </div>
  );
};

export default Search;
