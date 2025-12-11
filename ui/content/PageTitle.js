import {PageContext} from "./Page";
import {useCallback, useContext, useRef} from "react";
import {useRestApi} from "../../api/RestApi";
import EditableField from "../editor/EditableField";
import {useEdit} from "../editor/EditProvider";

/**
 * @typedef PageTitleProps
 *
 * @property {boolean} showTitle Always show the title in the tag, regardless of the content settings.
 */

/**
 * Display the page title in an <h1> tag.
 *
 * If the page title has not loaded yet, still displays the
 * tag and reserves its space in the layout.
 *
 * If the site is in a login state, displays "Log In" as the title.
 *
 * Must be located within the <Page> tag to receive page context.
 *
 * @param props {PageTitleProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageTitle(props) {

  const {pageData, error, login} = useContext(PageContext);
  const {insertOrUpdatePage} = useRestApi();
  const {canEdit} = useEdit();

  const onTitleChanged = useCallback(({textContent, textAlign}) => {
    if (pageData) {
      console.debug(`Updating page title: textContent=${textContent}, textAlign=${textAlign}`);
      pageData.PageTitle = textContent;
      pageData.PageTitleAlign = textAlign;
      insertOrUpdatePage(pageData)
        .then((res) => {
          console.debug(`Page title updated: ${JSON.stringify(res)}`);
        })
        .catch((err) => {
          console.error(`Error updating page title: ${err.message}`);
        })
    }
  }, [pageData, insertOrUpdatePage]);

  const titleRef = useRef(null);
  const title = (
    <h1
      className={`PageTitle`}
      style={{
        width: '100%',
        textAlign: pageData?.PageTitleAlign,
      }}
      data-testid="PageTitle"
      ref={titleRef}
    >
      {error?.title ? error.title : login ? `Log In` : pageData?.PageTitle ? pageData.PageTitle : (<>&nbsp;</>)}
    </h1>
  )

  return (
    <>{(pageData?.PageTitle || error?.title || login || canEdit) && (
      <EditableField
        field={title}
        fieldRef={titleRef}
        callback={onTitleChanged}
        textContent={pageData?.PageTitle}
        textAlign={pageData?.PageTitleAlign}
      />
    )}</>
  )
}