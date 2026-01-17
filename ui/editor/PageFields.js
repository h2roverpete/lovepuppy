import {useEdit} from "./EditProvider";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {usePageContext} from "../content/Page";
import {useRestApi} from "../../api/RestApi";
import {useSiteContext} from "../content/Site";
import {useNavigate} from "react-router";

/**
 * Edit page metadata fields.
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageFields() {

  const {insertOrUpdatePage, insertOrUpdatePageSection, deletePage} = useRestApi();
  const {canEdit} = useEdit();
  const {pageData, setPageData, setSectionData} = usePageContext();
  const {outline} = useSiteContext()
  const [edits, setEdits] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (pageData) {
      setEdits({
        NavTitle: pageData.NavTitle ? pageData.NavTitle : "",
        PageMetaTitle: pageData.PageMetaTitle ? pageData.PageMetaTitle : "",
        PageMetaDescription: pageData.PageMetaDescription ? pageData.PageMetaDescription : "",
        PageMetaKeywords: pageData.PageMetaKeywords ? pageData.PageMetaKeywords : "",
        PageHidden: pageData.PageHidden,
        PageRoute: pageData.PageRoute,
      });
    }
  }, [pageData]);

  function onDataChanged({name, value}) {
    setEdits({
      ...edits,
      [name]: value
    })
    submitButton.current.classList.remove('disabled');
    revertButton.current.classList.remove('disabled');
  }

  function onSubmit() {
    const data = {
      ...pageData,
      ...edits,
    }
    console.debug(`Updating page: ${JSON.stringify(data)}`);
    insertOrUpdatePage(data).then(() => {
      console.debug(`Updated page.`);
      setEdits({})
      setPageData(data);
      outline.updatePage(data);
    }).catch((error) => {
      console.error(`Error updating page.`, error);
    });
    submitButton.current.classList.add('disabled');
    revertButton.current.classList.add('disabled');
    setCollapsed(true);
  }

  function onRevert() {
    setEdits({});
    setPageData();
    submitButton.current.classList.add('disabled');
    revertButton.current.classList.add('disabled');
  }

  function onAddSection() {
    if (pageData) {
      const data = {
        PageID: pageData.PageID
      }
      console.debug(`Adding page section...`);
      insertOrUpdatePageSection(data)
        .then(() => {
          setSectionData(null)
          setCollapsed(true);
        }).catch((error) => {
        console.error(`Error adding page section.`, error);
      })
    }
  }

  function onDeletePage() {
    console.debug(`Deleting page...`);
    deletePage(pageData.PageID)
      .then(() => {
        console.debug(`Deleted page.`);
        navigate('/');
        outline.deletePage(pageData.PageID);
        setCollapsed(true);
      })
      .catch(e => console.error(`Error deleting page.`, e));
  }

  const submitButton = useRef(null);
  const revertButton = useRef(null);

  return (
    <>{canEdit && (
      <>
        <Modal show={showDeleteConfirmation}>
          <ModalHeader><h5>Delete Page</h5></ModalHeader>
          <ModalBody>Are you sure you want to delete this page? This action can't be undone.</ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              setShowDeleteConfirmation(false);
              onDeletePage();
            }}>Delete</Button>
          </ModalFooter>
        </Modal>
        <div className="accordion" style={{width: "100%", position: "relative", minHeight: '20px'}}>
          <Button
            className="accordion-button collapsed bg-transparent border-none shadow-none"
            data-bs-toggle="collapse"
            data-bs-target="#PageFields"
            style={{padding: '2px 8px 0 0', position: 'absolute', top: 0, right: 0}}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div
            className={`accordion-collapse${collapsed ? ' collapse' : ''}`}
            id={"PageFields"}
            style={{background: '#00000011', marginBottom: '20px'}}
          >
            <div className="accordion-body">
              <div className={'row'}>
                <div className="form-group col-12 col-sm-6">
                  <label
                    htmlFor={'NavTitle'}
                    className="form-control-sm pb-0"
                  >
                    Navigation Title
                  </label>
                  <input
                    className={'form-control form-control-sm'}
                    id={'NavTitle'}
                    name={'NavTitle'}
                    value={edits?.NavTitle}
                    onChange={(e) => onDataChanged({name: 'NavTitle', value: e.target.value})}
                    type="text"
                    style={{fontSize: '10pt'}}
                  />
                </div>

                <div className="form-group col-12 col-sm-6">
                  <label
                    htmlFor={'PageRoute'}
                    className="form-control-sm pb-0"
                  >
                    Page Route
                  </label>
                  <input
                    className={'form-control form-control-sm'}
                    id={'PageRoute'}
                    name={'PageRoute'}
                    value={edits?.PageRoute}
                    onChange={(e) => onDataChanged({name: 'PageRoute', value: e.target.value})}
                    type="text"
                    style={{fontSize: '10pt'}}
                  />
                </div>

              </div>
              <div className="form-group col-12">
                <label
                  htmlFor={'PageMetaTitle'}
                  className="form-control-sm  pb-0"
                >
                  Meta Title
                </label>
                <input
                  className={'form-control form-control-sm'}
                  id={'PageMetaTitle'}
                  value={edits?.PageMetaTitle}
                  onChange={(e) => onDataChanged({name: 'PageMetaTitle', value: e.target.value})}
                  type="text"
                  style={{fontSize: '10pt'}}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor={'PageMetaDescription'}
                  className="form-control-sm pb-0"
                >
                  Meta Description
                </label>
                <input
                  className={'form-control form-control-sm'}
                  id={'PageMetaDescription'}
                  value={edits?.PageMetaDescription}
                  onChange={(e) => onDataChanged({name: 'PageMetaDescription', value: e.target.value})}
                  type="text"
                  style={{fontSize: '10pt'}}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor={'PageMetaKeywords'}
                  className="form-control-sm pb-0"
                >
                  Meta Keywords
                </label>
                <input
                  className={'form-control form-control-sm'}
                  id={'PageMetaKeywords'}
                  value={edits?.PageMetaKeywords}
                  onChange={(e) => onDataChanged({name: 'PageMetaKeywords', value: e.target.value})}
                  type="text"
                  style={{fontSize: '10pt'}}
                />
              </div>
              <div className="form-group mt-2">
                <input
                  type="checkbox"
                  checked={edits?.PageHidden}
                  id={'PageHidden'}
                  onChange={(e) => onDataChanged({name: 'PageHidden', value: e.target.checked})}
                />
                <label className={'form-control-sm'} htmlFor={'PageHidden'}>Hide page from site navigation</label>
              </div>
              <div className={'row mt-2'}>
                <div className="form-group col-6">
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2 mt-2 disabled"
                    onClick={onSubmit}
                    ref={submitButton}
                  >
                    Update
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2 mt-2 disabled"
                    onClick={onRevert}
                    ref={revertButton}
                  >
                    Revert
                  </Button>
                </div>
                <div className="form-group col-6 text-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={onAddSection}
                  >
                    Add Section
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    Delete Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}