import PageSection from './PageSection';
import React, {useContext} from "react";
import {PageContext} from "./Page";

/**
 * Element to show page content
 *
 * A <div> element with class names "content container"
 *
 * @param children{[JSX.Element]}   Elements to add at the end of page content.
 * @constructor
 */
export default function PageSections({children}) {
  const {pageData, sectionData} = useContext(PageContext);
  return (
    <>
      {pageData && sectionData && (
        <>
          {pageData && sectionData && sectionData.map(section => (
            <PageSection sectionData={section} key={section.PageSectionID}/>
          ))}
          {children}
        </>
      )}
    </>
  )
}