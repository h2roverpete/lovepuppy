import {PageContext} from "./Page";
import {useContext} from "react";

/**
 * @typedef PageTitleProps
 *
 * @property showTitle {boolean} Always show the title in the tag, regardless of the content settings.
 */

/**
 * Display the page title in an <h1> tag.
 *
 * If the page title has not loaded yet, still displays the
 * tag and reserves its space in the layout.
 *
 * Must be located within the <Page> tag to receive page context.
 *
 * @param props {PageTitleProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageTitle(props) {
  const {pageData} = useContext(PageContext);
  return (
    <>{(pageData?.DisplayTitle || props.showTitle) && (
      <h1 className="PageTitle">{pageData ? pageData.PageTitle : (<>&nbsp;</>)}</h1>
    )}</>
  )
}