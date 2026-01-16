import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import ReactGA from 'react-ga4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {Route, Routes, useNavigate} from "react-router";
import {useRestApi} from "../../api/RestApi";
import Logout from '../../auth/Logout';

/**
 * @typedef ErrorData
 *
 * @property {String} title
 * @property {String} description
 */

export const SiteContext = createContext({
  siteData: null,
  outlineData: null,
  error: null,
  setError: null,
  login: false,
  getChildren: null,
  updateOutlineData: (data) => console.error(`updateOutlineData() not defined.`),
});

/**
 * @typedef SiteProps
 *
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

  useMemo(() => {
    // Google Analytics, if provided.
    if (props.googleId || process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      ReactGA.initialize(props.googleId ? props.googleId : process.env.REACT_APP_GOOGLE_CLIENT_ID);
    }
    return true;
  }, [props.googleId]);

  const [siteData, setSiteData] = useState(null);
  const [outlineData, setOutlineData] = useState(null);
  const [error, __setError__] = useState(null); // use public setter, not __setError__
  const navigate = useNavigate();
  const {getSite, getSiteOutline} = useRestApi();

  /**
   * Display the site in an error state.
   * @param {ErrorData} errorData
   */
  const setError = useCallback((errorData) => {
    // use stringify for deep compare
    if (JSON.stringify(errorData) !== JSON.stringify(error)) {
      __setError__(errorData);
      if (errorData) {
        // if setting non-null error, then redirect navigation
        navigate('/error');
      }
    }
  }, [__setError__, error, navigate]);

  // set error from props if defined
  useEffect(() => {
    if (props.error) {
      setError(props.error)
    }
  }, [props.error, setError]);

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
      getSite().then((data) => {
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
  }, [getSite, siteData, setError]);

  useEffect(() => {
    if (!outlineData) {
      // load site outline
      getSiteOutline().then((data) => {
        console.debug(`Loaded site outline.`);
        setOutlineData(data);
      }).catch(error => {
        setError({
          title: `${error.status} Server Error`,
          description: `Site data could not be loaded.<br>Code: ${error.code}`
        });
        setOutlineData(null);
      });
    }
  }, [getSiteOutline, outlineData, setError]);

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

  /**
   * Refresh a page in the site outline.
   * @param {PageData} pageData
   */
  function updateOutlineData(pageData) {
    console.debug(`Update outline data for page ${pageData.PageID}`)
    if (outlineData) {
      const newOutlineData = [];
      outlineData.map((item) => {
        newOutlineData.push(item);
        if (item.PageID === pageData.PageID) {
          item.PageTitle = pageData.PageTitle;
          item.NavTitle = pageData.NavTitle;
          item.PageHidden = pageData.PageHidden;
        }
        return item;
      })
      setOutlineData(newOutlineData);
    }
  }

  function deletePageFromOutline(pageId) {
    console.debug(`Delete page ${pageId} from outline.`)
    if (outlineData) {
      const newOutlineData = [];
      outlineData.map((item) => {
        if (item.PageID !== pageId) {
          newOutlineData.push(item);
        }
        return item;
      })
      setOutlineData(newOutlineData);
    }
  }

  function addPageToOutline(pageData) {
    console.debug(`Add page ${pageData.PageID} to outline.`)
    if (outlineData) {
      const newOutlineData = [...outlineData, pageData];
      setOutlineData(newOutlineData);
    }
  }

  // provide context to children
  return (
    <div className="Site" data-testid="Site">
      <SiteContext
        value={{
          siteData: siteData,
          outlineData: outlineData,
          error: error,
          setError: setError,
          getChildren: getChildren,
          updateOutlineData: updateOutlineData,
          deletePageFromOutline: deletePageFromOutline,
          addPageToOutline: addPageToOutline,
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={<props.pageElement login={true}/>
            }
          />
          <Route
            path="/logout"
            element={<Logout/>}
          />
          <>{error && (
            // error page display
            <Route
              path="/error"
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

export function useSiteContext() {
  return useContext(SiteContext)
}