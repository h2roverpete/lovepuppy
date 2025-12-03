/**
 * Generate a page section
 * @param sectionData{PageSectionData}
 * @param siteData{SiteData}
 * @constructor
 */
function PageSection({sectionData}) {

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

  return (
    <div
      className={`PageSection`}
      data-testid={`PageSection-${sectionData.PageSectionID}`}
    >
      {sectionData.SectionTitle && sectionData.ShowTitle && (
        <h2
          className={'SectionTitle text-' + sectionData.TitleAlign}
          dangerouslySetInnerHTML={{__html: sectionData.SectionTitle}}
          data-testid={`SectionTitle-${sectionData.PageSectionID}`}
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
      {sectionData.SectionText && sectionData.SectionText.length && sectionData.ShowText && (
        <div
          className={`SectionText text-${sectionData.TextAlign}`}
          dangerouslySetInnerHTML={{__html: sectionData.SectionText}}
        />
      )}
    </div>
  );
}

export default PageSection;