import {useSiteContext} from "../content/Site";
import {useLocation, useNavigate} from "react-router";
import {onMouseMove, onDragOver, onDragStart, onDragLeave, getCursorPercent} from "./DragUtils";
import {useRestApi} from "../../api/RestApi";

export default function SiteOutline() {
  const {outlineData, outline} = useSiteContext();
  const navigate = useNavigate();
  const location = useLocation();
  const {movePageBefore, movePageAfter, makePageChildOf} = useRestApi();

  function onDrop(e, dropData) {
    e.target.style.borderWidth = 0;
    const percent = getCursorPercent(e, "vertical");
    const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
    if (dragData.PageID === dropData.PageID) {
      // dropped on same item
      return;
    }
    if (percent < 0.40) {
      console.debug(`Move page '${dragData.PageTitle}' before page '${dropData.PageTitle}'`);
      // move outline first for UI responsiveness
      outline.movePageBefore(dragData, dropData);
      movePageBefore(dragData.PageID, dropData.PageID)
        .then(() => {
          console.debug(`Page moved.`);
        })
        .catch((err) => {
          console.error(`Error moving page.`, err);
        });
    } else if (percent < 0.60) {
      console.debug(`Make page '${dragData.PageTitle}' child of page '${dropData.PageTitle}'`);
      // move outline first for UI responsiveness
      outline.makeChildOf(dragData, dropData);
      makePageChildOf(dragData.PageID, dropData.PageID)
        .then(() => {
          console.debug(`Page moved.`);
        })
        .catch((err) => {
          console.error(`Error moving page.`, err);
        });
    } else {
      console.debug(`Move page '${dragData.PageTitle}' after page '${dropData.PageTitle}'`);
      // move outline first for UI responsiveness
      outline.movePageAfter(dragData, dropData);
      movePageAfter(dragData.PageID, dropData.PageID)
        .then(() => {
          console.debug(`Page moved.`);
        })
        .catch((err) => {
          console.error(`Error moving page.`, err);
        });
    }
    e.stopPropagation();
    e.preventDefault();
  }

  console.debug(`Show outline. location=${JSON.stringify(location)}`);
  return (
    <div>
      {outlineData?.map((page) => (
        <div
          key={page.PageID}
          style={{
            marginLeft: `${page.OutlineLevel * 20}px`,
            padding: '5px',
            opacity: page.PageHidden ? 0.5 : 1.0,
            background: location.pathname === page.PageRoute ? '#00000020' : 'transparent',
          }}
          className={`small`}
          onClick={() => {
            navigate(page.PageRoute)
          }}
          onMouseMove={(e) => onMouseMove(e)}
          onDragOver={(e) => onDragOver(e, page, 'vertical')}
          onDragStart={(e) => onDragStart(e, page)}
          onDragLeave={(e) => onDragLeave(e)}
          onDrop={(e) => onDrop(e, page)}
          draggable={true}
        >
          {page.PageTitle}
        </div>
      ))}
    </div>
  );
}