import {useEdit} from "./EditProvider";
import {
  Accordion,
  AccordionButton,
  Button,
  Col, FormCheck, FormControl, FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "react-bootstrap";
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
  const [edits, setEdits] = useState({
    NavTitle: '',
    PageMetaTitle: '',
    PageMetaDescription: '',
    PageMetaKeywords: '',
    PageHidden: '',
    PageRoute: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (pageData) {
      setEdits({...pageData});
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

  function collapsePanel() {
    setActiveKey(null);
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
    collapsePanel();
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
          collapsePanel();
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
        collapsePanel();
      })
      .catch(e => console.error(`Error deleting page.`, e));
  }

  function isValidRoute(route) {
    return route?.match(/^\/[a-z0-9]+/);
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
            <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button size="sm" variant="danger" onClick={() => {
              setShowDeleteConfirmation(false);
              onDeletePage();
            }}>Delete</Button>
          </ModalFooter>
        </Modal>
        <Accordion
          style={{width: "100%", position: "relative", minHeight: '20px'}}
          activeKey={activeKey}
        >
          <Accordion.Item
            style={{width: "100%", position: "relative", background: 'transparent', border: 'none'}}
            eventKey={'0'}
          >
            <AccordionButton
              style={{
                position: 'absolute',
                padding: '0 8px 0 0',
                top: '0',
                left: '0',
                border: 'none',
                background: 'transparent',
                boxShadow: 'none'
              }}
              onClick={() => setActiveKey(activeKey ? null : '0')}
            />
            <Accordion.Body
              style={{background: '#00000022', marginBottom: '20px'}}
            >
              <Row><Col><h5>Page Properties</h5></Col></Row>
              <Row>
                <Col sm={6}>
                  <FormLabel
                    htmlFor={'NavTitle'}
                    column={'sm'}
                  >
                    Navigation Title
                  </FormLabel>
                  <FormControl
                    size={'sm'}
                    id={'NavTitle'}
                    name={'NavTitle'}
                    value={edits?.NavTitle}
                    onChange={(e) => onDataChanged({name: 'NavTitle', value: e.target.value})}
                  />
                </Col>

                <Col sm={6}>
                  <FormLabel
                    htmlFor={'PageRoute'}
                    column={'sm'}
                  >
                    Page Route
                  </FormLabel>
                  <FormControl
                    size={'sm'}
                    id={'PageRoute'}
                    name={'PageRoute'}
                    required={true}
                    isValid={edits?.PageRoute?.length > 0 && isValidRoute(edits.PageRoute)}
                    isInvalid={edits?.PageRoute?.length > 0 && !isValidRoute(edits.PageRoute)}
                    value={edits?.PageRoute}
                    onChange={(e) => onDataChanged({name: 'PageRoute', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormLabel
                    column={'sm'}
                    htmlFor={'PageMetaTitle'}
                  >
                    Meta Title
                  </FormLabel>
                  <FormControl
                    size={'sm'}
                    id={'PageMetaTitle'}
                    value={edits?.PageMetaTitle}
                    onChange={(e) => onDataChanged({name: 'PageMetaTitle', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormLabel
                    column={'sm'}
                    htmlFor={'PageMetaDescription'}
                  >
                    Meta Description
                  </FormLabel>
                  <FormControl
                    size={'sm'}
                    id={'PageMetaDescription'}
                    value={edits?.PageMetaDescription}
                    onChange={(e) => onDataChanged({name: 'PageMetaDescription', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormLabel
                    column={'sm'}
                    htmlFor={'PageMetaKeywords'}
                  >
                    Meta Keywords
                  </FormLabel>
                  <FormControl
                    size={'sm'}
                    id={'PageMetaKeywords'}
                    value={edits?.PageMetaKeywords}
                    onChange={(e) => onDataChanged({name: 'PageMetaKeywords', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormCheck
                    className={'form-control-sm mt-2'}
                    checked={edits?.PageHidden}
                    id={'PageHidden'}
                    label={'Hide page from site navigation'}
                    onChange={(e) => onDataChanged({name: 'PageHidden', value: e.target.checked})}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
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
                </Col>
                <Col sm={6} align="end">
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
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    )}
    </>
  );
}