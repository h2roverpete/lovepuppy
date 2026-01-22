import PageFields from "../editor/PageFields";
import PageExtras from "./PageExtras";

/**
 * Element to show page content
 *
 * A <div> element with class names "content container"
 *
 * @param children{[JSX.Element]}   Elements to add at the end of page content.
 * @constructor
 */
export default function PageContent({children}) {

  return (
    <div className="PageContent container-fluid" data-testid="PageContent">
      {children}
      <PageExtras/>
    </div>
  )
}