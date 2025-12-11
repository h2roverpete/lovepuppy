import EditableField from "../editor/EditableField";
import {useCallback, useRef} from "react";
import {useRestApi} from "../../api/RestApi";
import {useEdit} from "../editor/EditProvider";

/**
 * Generate a page section
 * @param sectionData{PageSectionData}
 * @param siteData{SiteData}
 * @constructor
 */
function PageSection({sectionData}) {

  const {insertOrUpdatePageSection} = useRestApi();
  const {canEdit} = useEdit();

  const imageDivStyle = {};
  const imageStyle = {};
  if (sectionData.ImagePosition === 'beside') {
    // align image left or right beside text
    imageDivStyle.position = 'relative';
    imageDivStyle.float = sectionData.ImageAlign;
    imageDivStyle.textAlign = 'center';
  } else {
    // center image above text
    imageDivStyle.display = 'flex';
    imageDivStyle.justifyContent = 'center';
    imageDivStyle.alignItems = 'center';
  }
  if (sectionData.HideImageFrame) {
    // hide frame for this instance of the image
    imageStyle.border = 'none';
    imageStyle.boxShadow = 'none';
  }

  const sectionTitleRef = useRef(null);
  const sectionTitle = (
    <h2
      ref={sectionTitleRef}
      className={'SectionTitle'}
      dangerouslySetInnerHTML={{__html: sectionData.SectionTitle}}
      data-testid={`SectionTitle-${sectionData.PageSectionID}`}
      style={{textAlign: sectionData.TitleAlign, width: '100%'}}
    />
  );
  const onTitleChanged = useCallback(({textContent, textAlign}) => {
    console.debug(`Update section title...`);
    sectionData.SectionTitle = textContent;
    sectionData.TitleAlign = textAlign;
    insertOrUpdatePageSection(sectionData)
      .then(result => console.log(`Updated section title.`))
      .catch(error => console.error(`Error updating section title.`));
  }, []);

  const sectionTextRef = useRef(null);
  const sectionText = (
    <div
      className={`SectionText`}
      style={{textAlign: sectionData.TextAlign}}
      dangerouslySetInnerHTML={{__html: sectionData.SectionText}}
      ref={sectionTextRef}
    />
  );
  const onTextChanged = useCallback(({textContent, textAlign}) => {
    console.debug(`Update section text...`);
    sectionData.SectionText = textContent;
    sectionData.TextAlign = textAlign;
    insertOrUpdatePageSection(sectionData)
      .then(result => console.log(`Updated section text.`))
      .catch(error => console.error(`Error updating section text.`));
  }, []);

  return (
    <div
      className={`PageSection`}
      data-testid={`PageSection-${sectionData.PageSectionID}`}
    >
      {((sectionData.SectionTitle && sectionData.ShowTitle) || canEdit) && (
        <EditableField
          field={sectionTitle}
          fieldRef={sectionTitleRef}
          textContent={sectionData.SectionTitle}
          textAlign={sectionData.TitleAlign}
          callback={onTitleChanged}
        />
      )}
      {sectionData.SectionImage && sectionData.ShowImage && (
        <div
          style={imageDivStyle}
          className={`SectionImage col-12 mb-3 col-sm-auto${sectionData.ImageAlign === 'right' ? ' ms-sm-3' : sectionData.ImageAlign === 'left' ? ' me-sm-4' : ''}`}
          data-testid={`SectionImageDiv-${sectionData.PageSectionID}`}
        >
          <img
            className="img-fluid"
            style={imageStyle}
            src={'images/' + sectionData.SectionImage}
            alt={sectionData.SectionTitle}
            data-testid={`SectionImage-${sectionData.PageSectionID}`}
          />
        </div>
      )}
      {((sectionData.SectionText && sectionData.SectionText.length && sectionData.ShowText) || canEdit) && (
        <EditableField
          field={sectionText}
          fieldRef={sectionTextRef}
          textContent={sectionData.SectionText}
          textAlign={sectionData.TextAlign}
          callback={onTextChanged}
          allowEnterKey={true}
        />
      )}
    </div>
  );
}

export default PageSection;