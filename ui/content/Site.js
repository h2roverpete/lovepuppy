import {createContext, useEffect, useState} from 'react';
import ReactGA from 'react-ga4';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, useLocation} from "react-router";

export const SiteContext = createContext({
  restApi: null,
  siteData: null,
  outlineData: null,
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

  const [siteData, setSiteData] = useState(null);
  const [outlineData, setOutlineData] = useState(null);

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
      props.restApi?.getSite().then((data) => {
        console.debug(`Loaded site ${data.SiteID}.`);
        setSiteData(data);
      }).catch(error => {
        console.error(`Error loading site: ${error}`);
      })
    }
  }, [props.restApi, siteData]);

  useEffect(() => {
    if (!outlineData) {
      // load site outline
      props.restApi?.getSiteOutline().then((data) => {
        console.debug(`Loaded site ${props.restApi.siteId} outline.`);
        setOutlineData(data);
      })
    }
  }, [props.restApi, outlineData]);

  // provide context to children
  return (
    <div className="Site">
      <SiteContext
        value={{
          restApi: props.restApi,
          siteData: siteData,
          outlineData: outlineData,
          'getChildren': getChildren
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* default route for cfm pages */}
            <Route
              path=""
              element={<props.pageElement/>}
            />
            {/* root route */}
            <Route
              path="/"
              element={<props.pageElement/>}
            />
            {/* legacy route for cfm pages */}
            <Route
              path="/page.cfm"
              element={<props.pageElement/>}
            />
            {outlineData?.map((page) => (
              <Route
                path={page.PageRoute}
                element={<props.pageElement pageId={page.PageID}/>}
              />
            ))}
          </Routes>
        </BrowserRouter>
        {props.children}
      </SiteContext>
    </div>
  )
}