import {useContext} from "react";
import {SiteContext} from "./Site";
import {PageContext} from "./Page";

/**
 * Simple navigation bar, top level only.
 *
 * @param props
 * @constructor
 */
export default function SimpleNavBar(props) {

  const {outlineData} = useContext(SiteContext);
  const {pageData, setPageId} = useContext(PageContext);

  return (
    <div className="navbar">
      {outlineData && outlineData.map(page => (
        <span
          key={page.PageID}
          className={'navitem' + (page.PageID === pageData.PageID ? ' current' : '')}
          onClick={() => setPageId(page.PageID)}
        >
          {page.NavTitle}
        </span>
      ))}
    </div>)
}