import {createContext, useContext, useEffect, useState} from "react";
import {SiteContext} from "./Site";

export const PageContext = createContext(
  {
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
      console.debug(`Setting page ${id} from URL.`);
      setPageId(id);
    } else if (outlineData && outlineData.length) {
      // find the first page in the site outline
      const defaultPageId = outlineData[0].PageID
      console.debug(`Setting page ${defaultPageId} from outline.`);
      setPageId(defaultPageId);
    }
  }

  useEffect(() => {
    if (pageId && !pageData) {
      // load specific page ID
      restApi?.getPage(pageId).then((data) => {
        console.debug(`Page data loaded.`);
        setPageData(data);
      })
    }
  }, [restApi, pageData, pageId]);

  useEffect(() => {
    if (pageId && !sectionData) {
      // load page sections
      restApi?.getPageSections(pageId).then((data) => {
        console.debug(`Page sections loaded.`);
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
    setPageId(pageId);
    setPageData(null);
    setSectionData(null);
  }

  // provide context to children
  return (
    <PageContext value={{pageData: pageData, sectionData: sectionData, 'setPageId': setter}}>
      {props.children}
    </PageContext>
  );
}