import {BsArrowsMove} from "react-icons/bs";
import {useRestApi} from "../../api/RestApi";
import {usePageContext} from "./Page";
import {useEdit} from "../editor/EditProvider";
import {useSiteContext} from "./Site";

/**
 * Insert an editable page section image.
 * Should be inserted before section text if position is "above",
 * otherwise it should be inserted after the section text.
 *
 * @param pageSectionData {PageSectionData} Database record for page section.
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageSectionImage({pageSectionData}) {

  const {insertOrUpdatePageSection, deleteSectionImage} = useRestApi();
  const {sectionData, setSectionData} = usePageContext();
  const {canEdit} = useEdit();
  const {siteData} = useSiteContext();

  function setImageAlign(align) {
    pageSectionData.ImageAlign = align;
    console.debug(`Updating image alignment...`);
    insertOrUpdatePageSection(pageSectionData)
      .then(() => console.debug(`Updated image alignment.`))
      .catch(error => console.error(`Error updating image alignment.`, error));
    setSectionData([...sectionData]);
  }

  function setImagePosition(position) {
    pageSectionData.ImagePosition = position;
    console.debug(`Updating image position...`);
    insertOrUpdatePageSection(pageSectionData)
      .then(() => console.debug(`Updated image position.`))
      .catch(error => console.error(`Error updating image position.`, error));
    setSectionData([...sectionData]);
  }

  function hideImageFrame(hide) {
    pageSectionData.HideImageFrame = hide;
    console.debug(`Updating image frame...`);
    insertOrUpdatePageSection(pageSectionData)
      .then(() => console.debug(`Updated image frame.`))
      .catch(error => console.error(`Error updating image frame.`, error));
    setSectionData([...sectionData]);
  }

  function deleteImage() {
    console.debug(`Deleting section image...`);
    deleteSectionImage(pageSectionData.PageID, pageSectionData.PageSectionID)
      .then(() => {
        console.debug(`Deleted section image.`)
        pageSectionData.SectionImage = null;
        setSectionData([...sectionData]);
      })
      .catch(error => console.error(`Error deleting section image.`, error));
  }

  const imageDivStyle = { position: 'relative' };
  let imageDivClassName = 'SectionImage mb-3 col-12';
  const imageStyle = {};
  let imageClassName = 'img-fluid';
  if (pageSectionData.ImagePosition === 'beside') {
    // align image left or right beside text
    imageDivClassName += ' col-sm-7'
    imageDivStyle.position = 'relative';
    imageDivStyle.float = pageSectionData.ImageAlign;
    imageDivStyle.textAlign = 'center';
    if (pageSectionData.ImageAlign === 'right') {
      imageDivClassName += ' ms-sm-3';
    } else if (pageSectionData.ImageAlign === 'left') {
      imageDivClassName += ' me-sm-4';
    }
  } else {
    // center image
    imageDivClassName += ' col-sm-auto'
    imageDivStyle.display = 'flex';
    imageDivStyle.justifyContent = 'center';
    imageDivStyle.alignItems = 'center';
  }
  if (pageSectionData.HideImageFrame) {
    // hide frame for this instance of the image
    imageStyle.border = 'none';
    imageStyle.boxShadow = 'none';
  }

  return (
    <>{pageSectionData?.SectionImage && (
      <div
        style={{...imageDivStyle, position: 'relative'}}
        className={imageDivClassName}
        data-testid={`SectionImageDiv-${pageSectionData.PageSectionID}`}
      >
        <img
          className={imageClassName}
          style={imageStyle}
          src={`${siteData.SiteRootUrl}/images/` + pageSectionData.SectionImage}
          alt={pageSectionData.SectionTitle}
          data-testid={`SectionImage-${pageSectionData.PageSectionID}`}
        />
        {canEdit && (
          <>
            <div
              className="dropdown"
              style={{position: 'absolute', bottom: '0', right: '2px', zIndex: 100}}
            >
              <button
                style={{zIndex: 200, border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
                className={`btn btn-sm border border-secondary text-dark bg-white`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ><BsArrowsMove/></button>
              <div className="dropdown-menu" style={{cursor: 'pointer', zIndex: 300}}>
                {pageSectionData.ImageAlign !== 'left' && (
                  <span className="dropdown-item" onClick={() => setImageAlign('left')}>Align Left</span>)}
                {pageSectionData.ImageAlign !== 'center' && pageSectionData.ImageAlign === 'above' && (
                  <span className="dropdown-item" onClick={() => setImageAlign('center')}>Align Center</span>)}
                {pageSectionData.ImageAlign !== 'right' && (
                  <span className="dropdown-item" onClick={() => setImageAlign('right')}>Align Right</span>)}
                {pageSectionData.ImagePosition !== 'above' && (
                  <span className="dropdown-item" onClick={() => setImagePosition('above')}>Above Text</span>)}
                {pageSectionData.ImagePosition !== 'beside' && (
                  <span className="dropdown-item" onClick={() => setImagePosition('beside')}>Beside Text</span>)}
                {pageSectionData.HideImageFrame ?
                  (<span className="dropdown-item" onClick={() => hideImageFrame(false)}>Show Image Frame</span>) :
                  (<span className="dropdown-item" onClick={() => hideImageFrame(true)}>Hide Image Frame</span>)
                }
                <span className="dropdown-item" onClick={() => deleteImage()}>Delete Image</span>
              </div>
            </div>
          </>
        )}
      </div>
    )}</>
  )
}