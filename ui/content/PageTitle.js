import {PageContext} from "./Page";
import {useContext} from "react";

export default function PageTitle() {
  const pageContext = useContext(PageContext);
  return (<>
    {pageContext.pageData && pageContext.pageData.DisplayTitle && (
      <h1>{pageContext.pageData.PageTitle}</h1>
    )}
  </>)
}