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
    imageDivStyle.position = 'relative';
    imageDivStyle.float = sectionData.ImageAlign;
    imageDivStyle.textAlign = 'center';
  } else {
    imageDivStyle.display = 'flex';
    imageDivStyle.justifyContent = 'center';
    imageDivStyle.alignItems = 'center';
  }
  if (sectionData.HideImageFrame) {
    imageStyle.border='none';
    imageStyle.boxShadow='none';
  }

  return (
    <div
      className={`PageSection`}
    >
      {sectionData.SectionTitle && sectionData.ShowTitle && (
        <h2
          className={'SectionTitle text-' + sectionData.TitleAlign}
          dangerouslySetInnerHTML={{__html: sectionData.SectionTitle}}
        />
      )}
      {sectionData.SectionImage && sectionData.ShowImage && (
        <div
          style={imageDivStyle}
          className={`SectionImage col-12 mb-3 col-sm-auto${sectionData.ImageAlign === 'right' ? ' ms-sm-3' : sectionData.ImageAlign === 'left' ? ' me-sm-4' : ''}`}
        >
          <img
            className="img-fluid"
            style={imageStyle}
            src={'images/' + sectionData.SectionImage}
            alt={sectionData.SectionTitle}
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