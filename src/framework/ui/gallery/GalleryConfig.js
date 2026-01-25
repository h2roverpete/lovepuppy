import {useEdit} from "../editor/EditProvider";
import {AccordionButton, Accordion, Row, Form, Col, Button, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import {usePageContext} from "../content/Page";
import DateField from "../forms/DateField";

export default function GalleryConfig({galleryConfig, extraId}) {
  const {canEdit} = useEdit();
  const [activeKey, setActiveKey] = useState('');
  const [edits, setEdits] = useState({});
  const [touched, setTouched] = useState([]);
  const {Galleries, Extras} = useRestApi();
  const {refreshPage} = usePageContext();

  useEffect(() => {
    setEdits({...galleryConfig});
  }, [galleryConfig]);

  function onDataChanged({name, value}) {
    setEdits({...edits, [name]: value});
    setTouched([...touched, name]);
  }

  function isTouched(name) {
    if (name) {
      return touched.includes(name);
    }
  }

  function isDataChanged() {
    return JSON.stringify(edits) !== JSON.stringify(galleryConfig);
  }

  function isDataValid() {
    return edits.GalleryName?.length > 0;
  }

  function onUpdate() {
    console.log(`Updating gallery.`);
    Galleries.insertOrUpdateGallery(edits)
      .then((result) => {
        setEdits(result);
        setActiveKey('');
      })
      .catch((err) => {
        console.error(`Error updating gallery.`, err);
      })
  }

  function onRevert() {
    setEdits({...galleryConfig});
    setTouched([]);
  }

  function onRemoveFromPage() {
    Extras.deleteExtra(extraId).then(() => {
      refreshPage();
    })
  }

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function onDeleteGallery() {
    console.debug(`Delete gallery....`);
    Galleries.deleteGallery(galleryConfig.GalleryID).then(() => {
      console.debug(`Gallery deleted.`);
      if (extraId) {
        Extras.deleteExtra(extraId).then(() => {
          console.debug(`Gallery extra deleted.`);
          refreshPage();
        }).catch(err => console.error(`Error deleting gallery extra.`, err));
      }
    }).catch(err => console.error(`Error deleting gallery.`, err));
  }

  const labelCols = 3;

  return (<>{canEdit && (<>
    <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
      <Modal.Header><h5>Delete Gallery</h5></Modal.Header>
      <Modal.Body>Are you sure you want to delete '{galleryConfig?.GalleryName}' gallery? This action can't be
        undone.</Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
        <Button size="sm" variant="danger" onClick={onDeleteGallery}>Delete
        </Button>
      </Modal.Footer>
    </Modal>
    <Accordion
      activeKey={activeKey}
    >
      <Accordion.Item
        style={{width: "100%", position: "relative", background: 'transparent', border: 'none'}}
        eventKey={'config'}
      >
        <AccordionButton
          style={{
            padding: '0 8px 0 0',
            top: '0',
            left: '0',
            border: 'none',
            background: 'transparent',
            boxShadow: 'none'
          }}
          onClick={() => setActiveKey(activeKey === 'config' ? '' : 'config')}
        />
        <Accordion.Body
          style={{background: '#e0e0e0f0', marginBottom: '20px'}}
        >
          <h5>Gallery Properties</h5>
          <Row>
            <Form.Label
              column={'sm'}
              sm={labelCols}
              htmlFor={'GalleryName'}>Gallery Name</Form.Label>
            <Col>
              <Form.Control
                size={'sm'}
                id={'GalleryName'}
                isValid={isTouched('GalleryName') && edits.GalleryName.length > 0}
                isInvalid={isTouched('GalleryName') && edits.GalleryName.length === 0}
                value={edits.GalleryName}
                onChange={(e) => onDataChanged({name: 'GalleryName', value: e.target.value})}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Form.Label
              column={'sm'}
              sm={labelCols}
              htmlFor={'GalleryDescription'}>Short Description</Form.Label>
            <Col>
              <Form.Control
                as={'textarea'}
                size={'sm'}
                id={'GalleryDescription'}
                rows={1}
                value={edits.GalleryDescription}
                onChange={(e) => onDataChanged({name: 'GalleryDescription', value: e.target.value})}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Form.Label
              column={'sm'}
              sm={labelCols}
              htmlFor={'GalleryLongDescription'}>Long Description</Form.Label>
            <Col>
              <Form.Control
                as={'textarea'}
                size={'sm'}
                id={'GalleryLongDescription'}
                rows={3}
                value={edits.GalleryLongDescription}
                onChange={(e) => onDataChanged({name: 'GalleryLongDescription', value: e.target.value})}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Form.Label
              column={'sm'}
              sm={labelCols}
              htmlFor={'GalleryDate'}>Gallery Date</Form.Label>
            <Col>
              <DateField
                name={'GalleryDate'}
                size={'sm'}
                id={'GalleryDate'}
                value={edits.GalleryDate}
                onChange={onDataChanged}
              />
            </Col>
          </Row>
          <Row className={'mt-4'}>
            <Col>
              <Button
                className="me-2"
                size={'sm'}
                variant="primary"
                onClick={onUpdate}
                disabled={!isDataValid() || !isDataChanged()}
              >
                Update
              </Button>
              <Button
                size={'sm'}
                variant="secondary"
                onClick={onRevert}
                disabled={!isDataChanged()}
              >
                Revert
              </Button>
            </Col>
            <Col style={{textAlign: 'end'}}>
              {extraId && (
                <Button
                  className="me-2"
                  size={'sm'}
                  variant="secondary"
                  onClick={onRemoveFromPage}
                >
                  Remove from Page
                </Button>
              )}
              <Button
                size={'sm'}
                variant="danger"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Gallery
              </Button>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>)}</>)
}