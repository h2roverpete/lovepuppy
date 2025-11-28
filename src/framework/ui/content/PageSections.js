import PageSection from './PageSection';
import React, {useContext} from "react";
import {PageContext} from "./Page";

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
  const {pageData, sectionData, error} = useContext(PageContext);
  return (
    <>{error?(
      <div className={'PageSection'} dangerouslySetInnerHTML={{__html:error.description}}></div>
    ):(
      <>{pageData && sectionData && (
        <>
          {pageData && sectionData && sectionData.map(section => (
            <PageSection sectionData={section} key={section.PageSectionID}/>
          ))}
          {props.children}
        </>
      )}</>
    )}</>


  )
}