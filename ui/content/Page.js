import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";
import {useRestApi} from "../../api/RestApi";
import PageConfig from "../editor/PageConfig";

export const PageContext = createContext(
  {}
);

/**
 * @typedef PageProps
 *
 * @property {[JSX.Element]} children   Child elements.
 * @property {number} [pageId]          Specific page ID to display.
 * @property {ErrorData} [error]        Error information to display.
 * @property {boolean} [login]          User is logging in or out.
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

  const {outlineData, error, setError} = useContext(SiteContext);
  const [pageId, __setPageId__] = useState(props.pageId);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const {Pages} = useRestApi();

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

  if (props.login && pageId !== 0) {
    // clear page contents if login is true
    setPageId(0);
  }

  useEffect(() => {
    if (pageId && !pageData) {
      // load page data
      Pages.getPage(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} data.`);
        setPageData(data); // update state
      })
    }
  }, [Pages.getPage, pageData, pageId]);

  useEffect(() => {
    if (pageId && !sectionData) {
      // load page sections
      Pages.getPageSections(pageId).then((data) => {
        console.debug(`Loaded page ${pageId} sections.`);
        setSectionData(data); // update state
      })
    }
  }, [Pages.getPageSections, pageId, sectionData]);

  useEffect(() => {
    if (pageData && outlineData && !breadcrumbs) {
      // build breadcrumb data
      setBreadcrumbs(buildBreadcrumbs(outlineData, pageData.ParentID)); // update state
    }
  }, [pageData, outlineData, breadcrumbs])

  /**
   * Update a page section that has been edited.
   * @param newData {PageSectionData} Data for section that was updated.
   */
  function updatePageSection(newData) {
    for (let i = 0; i < sectionData.length; i++) {
      if (sectionData[i].PageSectionID === newData.PageSectionID) {
        console.debug(`Updating data for page section ${newData.PageSectionID}.`);
        // need new array to trigger updates
        const newSectionData = [...sectionData];
        newSectionData[i] = newData;
        setSectionData(newSectionData);
        break;
      }
    }
  }

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

  function refreshPage() {
    console.debug(`Refresh page.`);
    setPageData({...pageData})
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
          login: props.login === true,
          error: errorData,
          setPageData: setPageData,
          setSectionData: setSectionData,
          updatePageSection: updatePageSection,
          refreshPage: refreshPage
        }}
      >
        <PageConfig/>
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

export function usePageContext() {
  return useContext(PageContext)
}