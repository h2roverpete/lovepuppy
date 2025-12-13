import EditableField from "../editor/EditableField";
import {useCallback, useRef, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import {useEdit} from "../editor/EditProvider";
import {BsArrowsMove, BsPencil} from "react-icons/bs";
import {Button, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import {usePageContext} from "./Page";

/**
 * Generate a page section
 * @param sectionData{PageSectionData}
 * @constructor
 */
function PageSection({pageSectionData}) {

  const {insertOrUpdatePageSection, deletePageSection} = useRestApi();
  const {canEdit} = useEdit();
  const {sectionData, setSectionData} = usePageContext();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const imageDivStyle = {};
  const imageStyle = {};
  if (pageSectionData.ImagePosition === 'beside') {
    // align image left or right beside text
    imageDivStyle.position = 'relative';
    imageDivStyle.float = pageSectionData.ImageAlign;
    imageDivStyle.textAlign = 'center';
  } else {
    // center image above text
    imageDivStyle.display = 'flex';
    imageDivStyle.justifyContent = 'center';
    imageDivStyle.alignItems = 'center';
  }
  if (pageSectionData.HideImageFrame) {
    // hide frame for this instance of the image
    imageStyle.border = 'none';
    imageStyle.boxShadow = 'none';
  }

  const sectionTitleRef = useRef(null);
  const sectionTitle = (
    <h2
      ref={sectionTitleRef}
      className={'SectionTitle'}
      dangerouslySetInnerHTML={{__html: pageSectionData.SectionTitle}}
      data-testid={`SectionTitle-${pageSectionData.PageSectionID}`}
      style={{textAlign: pageSectionData.TitleAlign, width: '100%'}}
    />
  );
  const onTitleChanged = useCallback(({textContent, textAlign}) => {
    if (textContent != null) {
      console.debug(`Update section title...`);
      pageSectionData.SectionTitle = textContent;
      pageSectionData.TitleAlign = textAlign;
      insertOrUpdatePageSection(pageSectionData)
        .then(() => console.log(`Updated section title.`))
        .catch(error => console.error(`Error updating section title.`, error));
    }
    setEditingTitle(false);
  }, [pageSectionData, insertOrUpdatePageSection]);

  const sectionTextRef = useRef(null);
  const sectionText = (
    <div
      className={`SectionText`}
      style={{textAlign: pageSectionData.TextAlign}}
      dangerouslySetInnerHTML={{__html: pageSectionData.SectionText}}
      ref={sectionTextRef}
    />
  );

  const onTextChanged = useCallback(({textContent, textAlign}) => {
    if (textContent != null) {
      console.debug(`Update section text...`);
      pageSectionData.SectionText = textContent;
      pageSectionData.TextAlign = textAlign;
      insertOrUpdatePageSection(pageSectionData)
        .then(() => console.log(`Updated section text.`))
        .catch(error => console.error(`Error updating section text.`, error));
    }
    setEditingText(false);
  }, [pageSectionData, insertOrUpdatePageSection]);

  function deleteSection() {
    if (pageSectionData) {
      deletePageSection(pageSectionData.PageID, pageSectionData.PageSectionID)
        .then(result => {
          console.log(`Page section deleted.`)
          let newSections = [];
          for (const section of sectionData) {
            if (section.PageSectionID !== result.PageSectionID) {
              newSections.push(section)
            }
          }
          setSectionData(newSections);
        })
        .catch(error => {
          console.error(`Error deleting page section.`, error)
        });
    }
  }

  function onMoveUp() {
    if (sectionData && pageSectionData) {
      let before;
      let current;
      for (const section of sectionData) {
        if (section.PageSectionID === pageSectionData.PageSectionID) {
          current = section;
          break;
        } else {
          before = section;
        }
      }
      if (current && before) {
        let seq = current.PageSectionSeq;
        current.PageSectionSeq = before.PageSectionSeq;
        before.PageSectionSeq = seq;
        const newSectionData = [...sectionData];
        newSectionData.sort((a, b) => a.PageSectionSeq - b.PageSectionSeq);
        console.debug(`Moving section up...`);
        insertOrUpdatePageSection(before)
          .then(() => {
            insertOrUpdatePageSection(current)
              .then(() => {
                console.debug(`Section moved up.`);
                setSectionData(newSectionData);
              })
              .catch(error => console.error(`Error moving page section up.`, error));
          })
          .catch(error => console.error(`Error moving page section up.`, error));
      } else {
        console.error(`Section sequence error, can't move up.`);
      }
    }
  }

  function onMoveDown() {
    if (sectionData && pageSectionData) {
      let current;
      let next;
      for (const section of sectionData) {
        if (section.PageSectionID === pageSectionData.PageSectionID) {
          current = section;
        } else if (current) {
          next = section;
          break;
        }
      }
      if (current && next) {
        let seq = current.PageSectionSeq;
        current.PageSectionSeq = next.PageSectionSeq;
        next.PageSectionSeq = seq;
        const newSectionData = [...sectionData];
        newSectionData.sort((a, b) => a.PageSectionSeq - b.PageSectionSeq);
        console.debug(`Moving section down...`);
        insertOrUpdatePageSection(next)
          .then(() => {
            insertOrUpdatePageSection(current)
              .then(() => {
                console.debug(`Section moved down.`);
                setSectionData(newSectionData);
              })
              .catch(error => console.error(`Error moving page section down.`, error));
          })
          .catch(error => console.error(`Error moving page section down.`, error));
      } else {
        console.error(`Section sequence error, can't move down.`);
      }
    }
  }

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

  return (
    <>
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <ModalBody>Are you sure you want to delete this section? This action cannot be undone.</ModalBody>
        <ModalFooter>
          <button className={'btn btn-sm btn-primary'} onClick={() => {
            deleteSection();
            setShowDeleteConfirmation(false)
          }}>Delete
          </button>
          <button className={'btn btn-sm btn-secondary'} onClick={() => setShowDeleteConfirmation(false)}>Cancel
          </button>
        </ModalFooter>
      </Modal>
      <div
        className={`PageSection`}
        style={{position: 'relative'}}
        data-testid={`PageSection-${pageSectionData.PageSectionID}`}
      >
        <EditableField
          field={sectionTitle}
          fieldRef={sectionTitleRef}
          textContent={pageSectionData.SectionTitle}
          textAlign={pageSectionData.TitleAlign}
          callback={onTitleChanged}
          editing={editingTitle}
        />
        {pageSectionData.SectionImage && (
          <div
            style={{...imageDivStyle, position: 'relative'}}
            className={`SectionImage col-12 mb-3 col-sm-auto${pageSectionData.ImageAlign === 'right' ? ' ms-sm-3' : pageSectionData.ImageAlign === 'left' ? ' me-sm-4' : ''}`}
            data-testid={`SectionImageDiv-${pageSectionData.PageSectionID}`}
          >
            <img
              className="img-fluid"
              style={imageStyle}
              src={'images/' + pageSectionData.SectionImage}
              alt={pageSectionData.SectionTitle}
              data-testid={`SectionImage-${pageSectionData.PageSectionID}`}
            />
            {canEdit && (
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
                </div>
              </div>
            )}
          </div>
        )}
        <EditableField
          field={sectionText}
          fieldRef={sectionTextRef}
          textContent={pageSectionData.SectionText}
          textAlign={pageSectionData.TextAlign}
          callback={onTextChanged}
          allowEnterKey={true}
          editing={editingText}
        />
        {(canEdit && !editingText && !editingTitle) && (
          <div
            className="dropdown"
            style={{position: 'absolute', top: '2px', right: '2px', zIndex: 100}}
          >
            <button
              style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px', zIndex: 200}}
              className={`btn btn-sm border border-secondary text-dark bg-white`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ><BsPencil/></button>
            <div className="dropdown-menu" style={{cursor: 'pointer', zIndex: 300}}>
              <span className="dropdown-item" onClick={() => setEditingTitle(true)}>Edit Section Title</span>
              <span className="dropdown-item" onClick={() => setEditingText(true)}>Edit Section Text</span>
              {pageSectionData.PageSectionSeq > 1 && (
                <span className="dropdown-item" onClick={onMoveUp}>Move Up</span>
              )}
              {pageSectionData.PageSectionSeq < sectionData.length && (
                <span className="dropdown-item" style={{marginLeft: '0'}} onClick={onMoveDown}>Move
                  Down</span>
              )}
              <span className="dropdown-item" onClick={() => setShowDeleteConfirmation(true)}> Delete Section</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PageSection;