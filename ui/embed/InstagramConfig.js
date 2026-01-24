import {useEdit} from "../editor/EditProvider";
import {useEffect, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import {usePageContext} from "../content/Page";
import {Accordion, AccordionButton, Button, Col, Row, Form} from "react-bootstrap";

export default function InstagramConfig({extraData}) {

  const {canEdit} = useEdit();
  const [activeKey, setActiveKey] = useState('');
  const [edits, setEdits] = useState({});
  const [touched, setTouched] = useState([]);
  const {Extras} = useRestApi();
  const {refreshPage} = usePageContext();

  useEffect(() => {
    setEdits({...extraData});
  }, [extraData]);

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
    return JSON.stringify(edits) !== JSON.stringify(extraData);
  }

  function isDataValid() {
    return isValidInstagramHandle(edits.InstagramHandle);
  }

  function isValidInstagramHandle(value) {
    return value && /^@[a-zA-Z0-9\-.]+$/.test(value);
  }

  function onUpdate() {
    console.log(`Updating instagram extra.`);
    Extras.insertOrUpdateExtra(edits)
      .then((result) => {
        setEdits(result);
        setActiveKey('');
      })
      .catch((err) => {
        console.error(`Error updating extra.`, err);
      })
  }

  function onRevert() {
    setEdits({...extraData});
    setTouched([]);
  }

  function onRemoveFromPage() {
    console.debug(`Delete extra....`);
    Extras.deleteExtra(extraData.ExtraID).then(() => {
      console.debug(`Extra deleted.`);
      refreshPage();
    }).catch((e) => console.error(`Error deleting extra.`, e));
  }

  const labelCols = 3;

  return (<>{canEdit && (<>
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
          <h5>Instagram Properties</h5>
          <Row>
            <Form.Label
              column={'sm'}
              sm={labelCols}
              htmlFor={'GalleryName'}>Instagram Handle</Form.Label>
            <Col>
              <Form.Control
                size={'sm'}
                id={'GalleryName'}
                isValid={isTouched('InstagramHandle') && isValidInstagramHandle(edits.InstagramHandle)}
                isInvalid={isTouched('InstagramHandle') && !isValidInstagramHandle(edits.InstagramHandle)}
                value={edits.InstagramHandle}
                onChange={(e) => onDataChanged({name: 'InstagramHandle', value: e.target.value})}
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
              <Button
                size={'sm'}
                variant="danger"
                onClick={onRemoveFromPage}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>)}</>)
}