/**
 * Generate a page section
 * @param sectionData{PageSectionData}
 * @param siteData{SiteData}
 * @constructor
 */
function Section({sectionData}) {

  const imageDivStyle = {};
  let imageDivClass = '';
  const imageStyle = {};
  if (sectionData.ImagePosition === 'beside') {
    imageDivStyle.position = 'relative';
    imageDivStyle.float = sectionData.ImageAlign;
    imageStyle[sectionData.ImageAlign === 'left' ? 'marginRight' : 'marginLeft'] = '20px'
    imageDivStyle.marginBottom = '10px';
  } else {
    imageDivStyle.display = 'flex';
    imageDivStyle.justifyContent = 'center';
    imageDivStyle.marginBottom = '20px';
  }
  if (sectionData.HideImageFrame) {
    imageStyle.border='none';
    imageStyle.boxShadow='none';
  }

  return (
    <div
      className={`section`}
      style={{
        marginBottom: '20px'
      }}
    >
      {sectionData.SectionTitle && sectionData.ShowTitle && (
        <h2
          className={'text-' + sectionData.TitleAlign}
          dangerouslySetInnerHTML={{__html: sectionData.SectionTitle}}
        />
      )}
      {sectionData.SectionImage && sectionData.ShowImage && (
        <div
          style={imageDivStyle}
          className={imageDivClass}
        >
          <img
            className="section-image img-fluid"
            style={imageStyle}
            src={'images/' + sectionData.SectionImage}
            alt={sectionData.SectionTitle}
          />
        </div>
      )}
      {sectionData.SectionText && sectionData.SectionText.length && sectionData.ShowText && (
        <div
          className={`page-section text-${sectionData.TextAlign}`}
          dangerouslySetInnerHTML={{__html: sectionData.SectionText}}
        />
      )}
    </div>
  );
}

export default Section;