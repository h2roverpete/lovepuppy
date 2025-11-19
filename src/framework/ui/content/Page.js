import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";

export const PageContext = createContext(
  {
    pageID: null,
    pageData: null,
    sectionData: null,
    setPageId: (pageId) => console.warn(`setPageId not defined.`)
  });

export default function Page(props) {

  const {outlineData, restApi} = useContext(SiteContext);

  const [pageId, setPageId] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [sectionData, setSectionData] = useState(null);

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
      <PageContext value={{pageId: pageId, pageData: pageData, sectionData: sectionData, 'setPageId': setter}}>
        {props.children}
      </PageContext>
    </div>
  );
}