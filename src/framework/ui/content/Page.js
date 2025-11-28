import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";
import {useLocation} from "react-router";
import ReactGA from "react-ga4";

export const PageContext = createContext(
  {
    pageID: null,
    pageData: null,
    sectionData: null,
    breadcrumbs: null,
    error: null,
  });

/**
 * @typedef PageProps
 *
 * @property {[JSX.Element]} children
 * @property {ErrorData} error
 */

/**
 * Page component, generates a <div> and provides
 * page related context data to children.
 *
 * @param props {PageProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Page(props) {

  const {outlineData, restApi, error} = useContext(SiteContext);
  const [pageError, setError] = useState(props.error);
  const [pageId, setPageId] = useState(props.pageId);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (error) {
      // pass error from site context and clear page data
      setError(error);
      setter(0);
    } else if (props.error) {
      // pass error from props and clear page data
      setError(props.error);
      setter(0);
    }
  }, [props.error, error]);

  if (pageId && props.pageId && props.pageId !== pageId) {
    // set new page ID from props
    setter(props.pageId);
  }

  // Google Analytics for page views
  const location = useLocation();
  useEffect(() => {
    if (pageData) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
        title: pageData.PageTitle
      });
    }
  }, [location, pageData]);

  if (!pageId && !props.pageId && !pageError) {
    // no explicit page id: check URL params for page id
    const params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('pageid'));
    if (id > 0) {
      setter(id);
    } else if (outlineData && outlineData.length) {
      // find the first page in the site outline
      const defaultPageId = outlineData[0].PageID
      setter(defaultPageId);
    }
  }

  useEffect(() => {
    if (pageId && !pageData) {
      // load page data
      restApi?.getPage(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} data.`);
        setPageData(data);
      }).catch((error) => {
        setError({
          title: `${error.status} Server Error`,
          description: `Page data could not be loaded.<br>Code: ${error.code}`
        });
        setPageData(null);
      })
    }
  }, [restApi, pageData, pageId]);

  useEffect(() => {
    if (pageId && !sectionData) {
      // load page sections
      restApi?.getPageSections(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} sections.`);
        setSectionData(data);
      })
    }
  }, [restApi, pageData, pageId, sectionData]);

  useEffect(() => {
    if (pageData && outlineData) {
      setBreadcrumbs(buildBreadcrumbs(outlineData, pageData.ParentID));
    }
  }, [pageData, outlineData])

  /**
   * Setter function for changing page ID.
   * Clears out page and section data on new Page ID.
   *
   * @param pageId {number} new page ID.
   */
  function setter(pageId) {
    console.debug(`Set page ID to ${pageId}.`);
    setPageId(pageId);
    setPageData(null);
    setSectionData(null);
    setError(null);
  }

  // provide context to children
  return (
    <div className="Page">
      <PageContext
        value={{
          pageId: pageId,
          pageData: pageData,
          sectionData: sectionData,
          breadcrumbs: breadcrumbs,
          error: pageError,
        }}
      >
        {props.children}
      </PageContext>
    </div>
  );
}

/**
 * Build breadcrumb array.
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
