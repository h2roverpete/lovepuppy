import {PageContext} from "./Page";
import {useContext} from "react";

/**
 * @typedef PageTitleProps
 *
 * @property {boolean} showTitle Always show the title in the tag, regardless of the content settings.
 * @property {ErrorData} error
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
  const {pageData, error} = useContext(PageContext);
  return (
    <>{(pageData?.DisplayTitle || props.showTitle || error?.title) && (
      <h1
        className="PageTitle">{error?.title ? error.title : pageData ? pageData.PageTitle : (<>&nbsp;</>)}</h1>
    )}</>
  )
}