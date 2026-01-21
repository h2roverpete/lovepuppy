import {useEdit} from "./EditProvider";
import {Accordion, AccordionButton, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {usePageContext} from "../content/Page";
import {useRestApi} from "../../api/RestApi";
import {useSiteContext} from "../content/Site";
import {useNavigate} from "react-router";
import EmailField, {isValidEmail} from "../forms/EmailField";

/**
 * Edit page metadata fields.
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageFields() {

  const {insertOrUpdatePage, insertOrUpdatePageSection, deletePage, insertOrUpdateGuestBook} = useRestApi();
  const {canEdit} = useEdit();
  const {pageData, setPageData, setSectionData, refreshPage} = usePageContext();
  const {outline, siteData} = useSiteContext()
  const [edits, setEdits] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);
  const [touchedFields, setTouchedFields] = useState([]);

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
    setTouchedFields([...touchedFields, name]);
  }

  function hasEdits() {
    if (pageData && edits) {
      return JSON.stringify(edits) !== JSON.stringify(pageData);
    } else return false;
  }

  function isTouched(name) {
    return touchedFields.includes(name);
  }

  function isDataValid() {
    return isValidRoute(edits.PageRoute)
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
    collapsePanel();
  }

  function onRevert() {
    setEdits({});
    setPageData();
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

  const [showAddExtras, setShowAddExtras] = useState(false);
  const [extraType, setExtraType] = useState('');
  const [guestBookEmail, setGuestBookEmail] = useState('');

  function onAddExtra() {
    if (extraType && siteData) {
      switch (extraType) {
        case 'gallery':
        case 'guestbook':
          insertOrUpdateGuestBook({
              GuestBookName: `${siteData.SiteName}`,
              GuestBookEmail: guestBookEmail,
              PageID: pageData.PageID,
              ShowName: true,
              ShowEmail: true,
              ShowPhone: true,
              ShowFeedback: true
            }
          ).then(() => {
            console.debug(`Guest book added.`);
            setShowAddExtras(false);
            refreshPage();
          }).catch((error) => {
            console.error(`Error adding guest book.`, error);
          })
          break;
        default:
          console.error(`Unsupported extra type ${extraType}`)
      }
    }
  }

  function extraDataValid() {
    switch (extraType) {
      case 'guestbook':
        return isValidEmail(guestBookEmail);
      default:
        return false;
    }
  }

  return (
    <>{canEdit && pageData && (
      <>
        <Modal show={showDeleteConfirmation}>
          <Modal.Header><h5>Delete Page</h5></Modal.Header>
          <Modal.Body>Are you sure you want to delete this page? This action can't be undone.</Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button size="sm" variant="danger" onClick={() => {
              setShowDeleteConfirmation(false);
              onDeletePage();
            }}>Delete</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddExtras} onHide={() => setShowAddExtras(false)}>
          <Modal.Header><h5>Add an Extra to '{pageData.PageTitle}'</h5></Modal.Header>
          <Modal.Body>
            <Row>
              <Form.Label className='required' column={'sm'} htmlFor={'ExtraType'} sm={'auto'}>Extra to Add</Form.Label>
              <Col>
                <Form.Select
                  id="ExtraType"
                  size={'sm'}
                  value={extraType}
                  onChange={(e) => setExtraType(e.target.value)}
                >
                  <option value={''}>(Select)</option>
                  <option value='gallery'>Photo Gallery</option>
                  <option value='guestbook'>Guest Book</option>
                </Form.Select>
              </Col>
            </Row>
            {extraType === 'guestbook' && (
              <Row className="mt-2">
                <Form.Label className='required' column={'sm'} htmlFor={'GuestBookEmail'} sm={'auto'}>Admin
                  Email</Form.Label>
                <Col>
                  <EmailField
                    id="GuestBookEmail"
                    name="GuestBookEmail"
                    size="sm"
                    onChange={(e) => setGuestBookEmail(e.target.value)}
                    value={guestBookEmail || ''}
                  />
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setShowAddExtras(false)}>Cancel</Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!extraDataValid()}
              onClick={() => {
                onAddExtra();
                setShowAddExtras(false);
                setActiveKey('');
              }}
            >Add Extra</Button>
          </Modal.Footer>
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
                  <Form.Label
                    htmlFor={'NavTitle'}
                    column={'sm'}
                  >
                    Navigation Title
                  </Form.Label>
                  <Form.Control
                    size={'sm'}
                    id={'NavTitle'}
                    name={'NavTitle'}
                    value={edits.NavTitle || ''}
                    onChange={(e) => onDataChanged({name: 'NavTitle', value: e.target.value})}
                  />
                </Col>

                <Col sm={6}>
                  <Form.Label
                    htmlFor={'PageRoute'}
                    column={'sm'}
                  >
                    Page Route
                  </Form.Label>
                  <Form.Control
                    size={'sm'}
                    id={'PageRoute'}
                    name={'PageRoute'}
                    isValid={edits.PageRoute?.length > 0 && isValidRoute(edits.PageRoute)}
                    isInvalid={edits.PageRoute?.length > 0 && !isValidRoute(edits.PageRoute)}
                    value={edits.PageRoute || ''}
                    onChange={(e) => onDataChanged({name: 'PageRoute', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Label
                    column={'sm'}
                    htmlFor={'PageMetaTitle'}
                  >
                    Meta Title
                  </Form.Label>
                  <Form.Control
                    size={'sm'}
                    id={'PageMetaTitle'}
                    value={edits.PageMetaTitle || ''}
                    onChange={(e) => onDataChanged({name: 'PageMetaTitle', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label
                    column={'sm'}
                    htmlFor={'PageMetaDescription'}
                  >
                    Meta Description
                  </Form.Label>
                  <Form.Control
                    size={'sm'}
                    id={'PageMetaDescription'}
                    value={edits.PageMetaDescription || ''}
                    onChange={(e) => onDataChanged({name: 'PageMetaDescription', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label
                    column={'sm'}
                    htmlFor={'PageMetaKeywords'}
                  >
                    Meta Keywords
                  </Form.Label>
                  <Form.Control
                    size={'sm'}
                    id={'PageMetaKeywords'}
                    value={edits.PageMetaKeywords || ''}
                    onChange={(e) => onDataChanged({name: 'PageMetaKeywords', value: e.target.value})}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Check
                    className={'form-control-sm mt-2'}
                    checked={edits.PageHidden || false}
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
                    className="me-2 mt-2"
                    onClick={onSubmit}
                    disabled={!hasEdits() || !isDataValid()}
                  >
                    Update
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={onRevert}
                    disabled={!hasEdits()}
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
                    variant="secondary"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={() => setShowAddExtras(true)}
                  >
                    Add Extra
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