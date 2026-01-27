import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";
import {useRestApi} from "../../api/RestApi";
import PageConfig from "../editor/PageConfig";
import FormEditor from "../editor/FormEditor";
import AddExtrasModal from "../extras/AddExtrasModal";

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

  const {outlineData, error} = useContext(SiteContext);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const {Pages, Extras} = useRestApi();
  const [showAddExtraModal, setShowAddExtraModal] = useState(false);
  const [extraPageSectionId, setExtraPageSectionId] = useState(0);
  const [extras, setExtras] = useState([]);

  let errorData;
  if (error) {
    // pass error from site context
    errorData = error;
  } else if (props.error) {
    // pass error from props
    errorData = props.error;
  }

  useEffect(() => {
    if (props.pageId) {
      // load page data
      Pages.getPage(props.pageId).then((data) => {
        console.debug(`Loaded page ${props.pageId} data.`);
        setPageData(data); // update state
      })
    }
  }, [props.pageId]);

  useEffect(() => {
    if (pageData) {
      // load page sections
      Pages.getPageSections(pageData.PageID).then((data) => {
        console.debug(`Loaded page ${pageData.PageID} sections.`);
        setSectionData(data); // update state
      })
      // load extras
      Extras.getPageExtras(pageData.PageID).then((data) => {
        console.debug(`Loaded page ${pageData.PageID} extras.`);
        setExtras(data); // update state
      })
    }
  }, [pageData]);

  useEffect(() => {
    if (pageData && outlineData) {
      // build breadcrumb data
      setBreadcrumbs(buildBreadcrumbs(outlineData, pageData.ParentID)); // update state
    }
  }, [pageData, outlineData])

  /**
   * Update a page section that has been edited.
   * @param newData {PageSectionData} Data for section that was updated.
   */
  function updatePageSection(newData) {
    for (let i = 0; i < sectionData.length; i++) {
      if (sectionData[i].PageSectionID === newData.PageSectionID) {
        console.debug(`Updating data for page section ${newData.PageSectionID}.`);
        const newSectionData = [...sectionData];
        newSectionData[i] = newData;
        newSectionData.sort((a, b) => a.PageSectionSeq - b.PageSectionSeq);
        setSectionData(newSectionData);
        break;
      }
    }
  }

  function refreshPage() {
    console.debug(`Refresh page.`);
    setPageData({...pageData})
  }

  function addExtraModal({pageSectionId}) {
    setShowAddExtraModal(true);
    setExtraPageSectionId(pageSectionId);
  }

  // provide context to children
  return (
    <div className="Page" data-testid="Page">
      <PageContext
        value={{
          pageData: pageData,
          sectionData: sectionData,
          breadcrumbs: breadcrumbs,
          login: props.login === true,
          error: errorData,
          setPageData: setPageData,
          setSectionData: setSectionData,
          updatePageSection: updatePageSection,
          refreshPage: refreshPage,
          addExtraModal: addExtraModal,
          extras: extras,
        }}
      >
        <FormEditor>
          <AddExtrasModal
            show={showAddExtraModal}
            onHide={() => setShowAddExtraModal(false)}
            pageSectionId={extraPageSectionId}
          />
        </FormEditor>
        <FormEditor>
          <PageConfig/>
        </FormEditor>
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