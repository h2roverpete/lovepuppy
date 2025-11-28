import {createContext, useEffect, useMemo, useState} from 'react';
import ReactGA from 'react-ga4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {BrowserRouter, Route, Routes} from "react-router";
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
 * Element to provide SiteContext to child elements.
 *
 * @param props {SiteProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Site(props) {

  // Google Analytics, if provided.
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

  // provide context to children
  return (
    <div className="Site">
      <SiteContext
        value={{
          restApi: restApi,
          siteData: siteData,
          outlineData: outlineData,
          error: error,
          'getChildren': getChildren
        }}
      >
        {/* only register routes after outline is loaded */}
        <BrowserRouter>
          <>{outlineData && (
            <Routes>
              {/* root route */}
              <Route
                path="/"
                element={<props.pageElement pageId={outlineData[0].PageID}/>}
              />
              {/* legacy route for cfm pages */}
              <Route
                path="/page.cfm"
                element={<props.pageElement/>}
              />
              {outlineData?.map((page) => (
                <Route
                  path={page.PageRoute}
                  element={<props.pageElement pageId={page.PageID}
                  />}
                />
              ))}
              {/* route to explicit error page */}
              <Route
                path="/error"
                element={<props.pageElement error={{title: "Error", description: "An error occurred."}}/>}
              />
              {/* catchall displays 404 errors when route not matched */}
              <Route
                path="*"
                element={<props.pageElement
                  error={{title: "404 Not Found", description: "The content you are looking for was not found."}}/>}
              />
            </Routes>
          )}</>
          <>{error && (
            <Routes>
              {/* pass error state to page module for display */}
              <Route
                path="*"
                element={<props.pageElement error={error}/>}
              />
            </Routes>
          )}</>
          {props.children}
        </BrowserRouter>
      </SiteContext>
    </div>
  )
}