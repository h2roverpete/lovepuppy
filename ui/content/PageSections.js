import PageSection from './PageSection';
import React, {useEffect} from "react";
import {usePageContext} from "./Page";
import Login from "../../auth/Login";
import {useEdit} from "../editor/EditProvider";

/**
 * @typedef PageSectionProps
 * @property {[JSX.Element]} children
 */
/**
 * Element to show page content
 *
 * A <div> element with class names "content container"
 *
 * @param props {PageSectionProps}
 * @constructor
 */
export default function PageSections(props) {
  const {pageData, sectionData, error, login} = usePageContext();

  const {canEdit} = useEdit();
  useEffect(() => {
    if (canEdit) {
      // attach drag and drop related window scripts
      window.addEventListener("drop", windowDropHandler);
    }
  }, [canEdit]);

  function windowDropHandler(e) {
    if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
      e.preventDefault();
    }
  }

  return (
    <>{error ? (
      <div className={'PageSection'} dangerouslySetInnerHTML={{__html: error.description}}></div>
    ) : (<>
      {login ? (<>
        <Login/>
      </>) : (<>
        {pageData && sectionData && (<>
          {sectionData.map(section => (<>
            <PageSection
              pageSectionData={section}
              key={section.PageSectionID}
              data-testid={`PageSection-section.PageSectionID`}/>
          </>))}
          {props.children}
        </>)}
      </>)}
    </>)}
    </>)
}