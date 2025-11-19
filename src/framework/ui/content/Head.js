import {useContext} from "react";
import {PageContext} from "./Page";
import {SiteContext} from "./Site";

/**
 * Element to display elements in page head.
 * Needs to be a child of the <Page> tag.
 *
 * Uses Helmet to propagate data to the <head> elements.
 *
 * @constructor
 */
export default function Head() {

  const {pageData} = useContext(PageContext);
  const {siteData} = useContext(SiteContext);

  const title = pageData && siteData ? pageData.PageMetaTitle ? pageData.PageMetaTitle : `${siteData.SiteName} - ${pageData.PageTitle}` : `Loading...`;

  return (
    <>
      {pageData ? (
        <>
          <title>{title}</title>
          <meta name="description" content={pageData.PageMetaDescription}/>
          <meta name="keywords" content={pageData.PageMetaKeywords}/>
        </>
      ) : (
        <>
          <title>Loading...</title>
        </>
      )
      }
    </>
  )
}