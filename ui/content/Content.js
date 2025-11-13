import Section from './Section';
import Title from './Title';
import {useEffect, useState} from "react";

/**
 * Element to show page content
 *
 * A <div> element with class names "content container"
 *
 * @param api{Api}                  Content database.
 * @param siteData{SiteData}        Site data.
 * @param pageData{PageData}        Page data.
 * @param children{[JSX.Element]}   Elements to add at the end of page content.
 * @constructor
 */
function Content({api, siteData, pageData, children}) {

    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        if (pageData) {
            api.getPageSections(pageData.PageID).then((data) => {
                setSectionData(data);
            })
        }
    }, [pageData, api]);

    return (
        <div className="content">
            {pageData && sectionData && (
                <div className="container">
                    <Title pageData={pageData}/>
                    <div>{pageData && sectionData && sectionData.map(section => (
                        <Section sectionData={section} key={section.PageSectionID}/>
                    ))}</div>
                    {children}
                </div>
            )}
        </div>
    )
}

export default Content;