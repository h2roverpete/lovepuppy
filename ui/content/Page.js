import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";

export const PageContext = createContext(
  {
    pageID: null,
    pageData: null,
    sectionData: null,
    breadcrumbs: null,
    setPageId: (pageId) => console.warn(`setPageId not defined.`)
  });

/**
 * @typedef PageProps
 * @property {[JSX.Element]} children
 */
/**
 * Page component, generates a <div> and provides
 * page related context data to children.
 *
 * @param props {PageProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Page({children}) {

  const {outlineData, restApi} = useContext(SiteContext);

  const [pageId, setPageId] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  if (!pageId) {
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
      // load specific page ID
      restApi?.getPage(pageId).then((data) => {
        console.debug(`Loaded page ${pageId}.`);
        setPageData(data);
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
   *
   * @param pageId {number} new pgae ID.
   */
  function setter(pageId) {
    console.debug(`Set page ID to ${pageId}.`);
    setPageId(pageId);
    setPageData(null);
    setSectionData(null);
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
          'setPageId': setter
        }}
      >
        {children}
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
  console.debug(`buildBreadcrumbs for ${parentId}`);
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
