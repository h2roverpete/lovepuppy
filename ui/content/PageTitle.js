import {PageContext} from "./Page";
import {useContext, useEffect, useRef, useState} from "react";
import {Permission, useAuth} from "../../auth/AuthProvider";
import EditButton from "../editor/EditButton";
import {useRestApi} from "../../api/RestApi";

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

  const {pageData, error, login} = useContext(PageContext);

  const {hasPermission, isAuthenticated} = useAuth();
  const [admin, setAdmin] = useState(false);
  const {insertOrUpdatePage} = useRestApi();

  useEffect(() => {
    // check admin permissions
    hasPermission(Permission.ADMIN).then((res) => {
      setAdmin(res);
    });
  }, [isAuthenticated, hasPermission, setAdmin]);

  const titleElement = useRef(null);
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing(!editing);
  }

  useEffect(() => {
    if (editing) {
      // focus when editing
      titleElement.current?.focus();
    }
  }, [editing]);

  function onKeyDown(evt) {
    // end editing and update on enter
    console.debug(`onKeyDown: ${evt.key}`);
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (titleElement.current?.textContent !== pageData.PageTitle) {
        console.debug(`Updating page...`);
        pageData.PageTitle = titleElement.current?.textContent;
        insertOrUpdatePage(pageData)
          .then((res) => {
            console.debug(`Page updated: ${JSON.stringify(res)}`);
          })
          .catch((err) => {
            console.error(`Error updating page: ${err.message}`);
          })
      }
      toggleEditing();
    }
    if (evt.key === 'Escape') {
      evt.preventDefault();
      titleElement.current.textContent = pageData.PageTitle;
      toggleEditing();
    }
  }

  return (
    <>{(pageData?.DisplayTitle || props.showTitle || error?.title || login) && (
      <div style={{position: 'relative'}}>
        <h1
          className="PageTitle"
          data-testid="PageTitle"
          ref={titleElement}
          contentEditable={editing}
          style={{position: 'relative'}}
          onKeyDown={onKeyDown}
        >
          {error?.title ? error.title : login ? `Log In` : pageData?.PageTitle ? pageData.PageTitle : (<>&nbsp;</>)}
        </h1>
        <EditButton onClick={toggleEditing} editable={admin} editing={editing}/>
      </div>
    )}</>
  )
}