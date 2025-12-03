import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";
import {useLocation} from "react-router";
import ReactGA from "react-ga4";

export const PageContext = createContext(
  {
    pageId: null,
    pageData: null,
    sectionData: null,
    breadcrumbs: null,
    error: null,
  });

/**
 * @typedef PageProps
 *
 * @property {[JSX.Element]} children   Child elements.
 * @property {number} [pageId]          Specific page ID to display.
 * @property {ErrorData} [error]        Error information to display.
 */

/**
 * Page component.
 * Generates a container <div> for styling and display.
 * Provides page related data in a PageContext to children.
 *
 * @param props {PageProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Page(props) {

  const {outlineData, restApi, error, setError} = useContext(SiteContext);
  const [pageId, __setPageId__] = useState(props.pageId);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  let errorData;
  if (error) {
    // pass error from site context
    errorData = error;
  } else if (props.error) {
    // pass error from props
    errorData = props.error;
  }

  if (props.pageId && props.pageId !== pageId) {
    // set new page ID from props
    setPageId(props.pageId);
  }

  // Google Analytics for page views
  const location = useLocation();
  useEffect(() => {
    if (pageData) {
      ReactGA.send( {
        hitType: 'pageview',
        path: location.pathname + location.search,
        title: pageData.PageTitle
      });
    }
  }, [location, pageData]);

  useEffect(() => {
    if (pageId && !pageData) {
      // load page data
      restApi?.getPage(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} data.`);
        setPageData(data); // update state
      })
    }
  }, [restApi, pageData, pageId]);

  useEffect(() => {
    if (pageId && !sectionData) {
      // load page sections
      restApi?.getPageSections(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} sections.`);
        setSectionData(data); // update state
      })
    }
  }, [restApi, pageData, pageId, sectionData]);

  useEffect(() => {
    if (pageData && outlineData && !breadcrumbs) {
      // build breadcrumb data
      setBreadcrumbs(buildBreadcrumbs(outlineData, pageData.ParentID)); // update state
    }
  }, [pageData, outlineData])

  /**
   * Function for changing page ID.
   * Clears out extra page related data when Page ID is changed.
   *
   * @param pageId {number} new page ID.
   */
  function setPageId(pageId) {
    console.debug(`Set page ID to ${pageId}.`);
    __setPageId__(pageId); // call private state setter
    setPageData(null);
    setSectionData(null);
    setBreadcrumbs(null);
    setError(null);
  }

  // provide context to children
  return (
    <div className="Page" data-testid="Page">
      <PageContext
        value={{
          pageId: pageId,
          pageData: pageData,
          sectionData: sectionData,
          breadcrumbs: breadcrumbs,
          error: errorData,
        }}
      >
        {props.children}
      </PageContext>
    </div>
  );
}

/**
 * Build breadcrumb array from site outline.
 *
 * @param outlineData {[OutlineData]}
 * @param parentId {number}
 */
function buildBreadcrumbs(outlineData, parentId) {
  const breadcrumbs = [];
  if (outlineData && parentId) {
    for (let i = outlineData.length - 1; i >= 0; i--) {
      if (outlineData[i].PageID === parentId) {
        breadcrumbs.push(outlineData[i]);
        parentId = outlineData[i].ParentID;
      }
    }
  }
  return breadcrumbs.sort((a, b) => {
    return b?.OutlineSeq - a?.OutlineSeq
  });
}
