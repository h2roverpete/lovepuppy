import {useContext} from "react";
import {PageContext} from "./Page";
import {SiteContext} from "./Site";

export default function Breadcrumbs(props) {

  const {outlineData, siteData} = useContext(SiteContext);
  const {pageData} = useContext(PageContext);
  const breadcrumbs = buildBreadcrumbs(outlineData, pageData?.ParentID);

  return (<>{breadcrumbs.length > 0 && (
    <div className="Breadcrumbs">
      {siteData?.SiteName}
      <>&nbsp;&raquo;&nbsp;</>
      {breadcrumbs.map(page => (
        <span key={page.PageID}>
          {page.PageTitle}
          <>&nbsp;&raquo;&nbsp;</>
        </span>
      ))}
    </div>
  )}</>);
}

/**
 *
 * @param outlineData {[OutlineData]}
 * @param parentId {number}
 */
function buildBreadcrumbs(outlineData, parentId) {
  console.debug(`Build breadcrumbs for ${parentId} from ${outlineData?.length}`);
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

