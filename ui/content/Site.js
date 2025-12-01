import {createContext, useEffect, useMemo, useState} from 'react';
import ReactGA from 'react-ga4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {Route, Routes} from "react-router";
import RestAPI from "../../api/api.mjs";

/**
 * @typedef ErrorData
 *
 * @property {String} title
 * @property {String} description
 */

export const SiteContext = createContext({
  restApi: null,
  siteData: null,
  outlineData: null,
  error: null,
  setError: () => console.error(`setError function not defined.`),
  getChildren: () => console.error(`Site context function getChildren() is undefined.`)
});

/**
 * @typedef SiteProps
 *
 * @property {RestAPI} restApi            Configured REST API.
 * @property {string} googleId            ID for Google tracking tag.
 * @property {JSX.Element} pageElement    Element to use for displaying page contents.
 * @property {[JSX.Element]} children     Child elements.
 */

/**
 * Main container element of content framework.
 * Performs routing for page rendering.
 * Provides SiteContext to child elements.
 *
 * @param props {SiteProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Site(props) {

  // initialize Google Analytics if provided.
  if (props.googleId) {
    ReactGA.initialize(props.googleId);
  }

  const restApi = useMemo(() => {
    return props.restApi ? props.restApi : new RestAPI(
      parseInt(process.env.REACT_APP_SITE_ID),
      process.env.REACT_APP_BACKEND_HOST,
      process.env.REACT_APP_API_KEY
    );
  }, [props.restApi]);

  const [siteData, setSiteData] = useState(null);
  const [outlineData, setOutlineData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Use the site outline to get child pages.
   * Provided as a utility for users of the Site context.
   *
   * @param pageId {number}         Page ID to get children from.
   * @param [showHidden] {boolean}  Return hidden pages? (default=false)
   * @returns {[OutlineData]}
   */
  function getChildren(pageId, showHidden) {
    const result = [];
    if (outlineData) {
      outlineData.map((item) => {
        if (item.ParentID === pageId && ((!item.PageHidden) || showHidden)) {
          result.push(item);
        }
        return item;
      })
    }
    return result;
  }

  useEffect(() => {
    if (!siteData) {
      // load site data
      restApi?.getSite().then((data) => {
        console.debug(`Loaded site ${data.SiteID}.`);
        setSiteData(data);
      }).catch(error => {
        setError({
          title: `${error.status} Server Error`,
          description: `Site data could not be loaded.<br>Code: ${error.code}`
        });
        setSiteData(null);
      });
    }
  }, [restApi, siteData]);

  useEffect(() => {
    if (!outlineData) {
      // load site outline
      restApi?.getSiteOutline().then((data) => {
        console.debug(`Loaded site ${restApi.siteId} outline.`);
        setOutlineData(data);
      }).catch(error => {
        setError({
          title: `${error.status} Server Error`,
          description: `Site data could not be loaded.<br>Code: ${error.code}`
        });
        setOutlineData(null);
      });
    }
  }, [restApi, outlineData]);

  let redirect;
  if (props.redirects && window.location.pathname === '/') {
    // search for page redirect matches
    for (const item of props.redirects) {
      if (item.hostname === window.location.hostname) {
        console.debug(`Redirecting ${item.hostname} to page ${item.pageId}.`);
        redirect = item;
      }
    }
  }

  const params = new URLSearchParams(window.location.search);
  let cfmPageId = parseInt(params.get('pageid'));

  // provide context to children
  return (
    <div className="Site" data-testid="Site">
      <SiteContext
        value={{
          restApi: restApi,
          siteData: siteData,
          outlineData: outlineData,
          error: error,
          setError: setError,
          getChildren: getChildren
        }}
      >
        <Routes>
          <>{error && (
            // error page display
            <Route
              path="*"
              element={<props.pageElement error={error}/>
              }
            />
          )}</>
          <>{outlineData && (
            <>
              <>{cfmPageId && (
                // legacy coldfusion page
                <Route
                  path="/page.cfm"
                  element={<props.pageElement pageId={cfmPageId}/>}
                />
              )}</>
              <>{redirect ? (
                // redirect root for an alternate domain
                <Route
                  path="/"
                  element={<props.pageElement pageId={redirect.pageId}/>}
                />
              ) : (
                // normal root, first item in outline
                <Route
                  path="/"
                  element={<props.pageElement pageId={outlineData[0].PageID}/>}
                />
              )}</>
              {outlineData.map((page) => (
                // all pages in site outline
                <Route
                  path={page.PageRoute}
                  element={<props.pageElement pageId={page.PageID}
                  />}
                />
              ))}
              {/* catchall to display 404 errors when route not matched */}
              <Route
                path="*"
                element={<props.pageElement
                  error={{
                    title: "404 Not Found",
                    description: "The content you are looking for was not found. Please select a topic on the navigation bar to browse the site."
                  }}/>}
              />
            </>
          )}</>
          {props.children}
        </Routes>
      </SiteContext>
    </div>
  )
}