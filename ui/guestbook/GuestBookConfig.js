import {useGuestBook} from "./GuestBook";
import {useEdit} from "../editor/EditProvider";
import {Accordion, AccordionButton, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import EmailField, {isValidEmail} from "../forms/EmailField";
import {useRestApi} from "../../api/RestApi";
import CustomFieldsConfig from "./CustomFieldsConfig";
import {usePageContext} from "../content/Page";

export default function GuestBookConfig({extraId}) {
  const {guestBookConfig, setGuestBookConfig} = useGuestBook();
  const {canEdit} = useEdit();
  const {GuestBooks, Extras} = useRestApi();
  const {refreshPage} = usePageContext();

  const [edits, setEdits] = useState({});
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    if (guestBookConfig) {
      setEdits({...guestBookConfig});
    }
  }, [guestBookConfig]);

  function collapsePanel() {
    setActiveKey(null);
  }

  function togglePanel(key) {
    setActiveKey(activeKey !== key ? key : null);
  }

  function onDataChanged({name, value}) {
    setEdits({
      ...edits,
      [name]: value
    })
  }

  function hasEdits() {
    if (guestBookConfig && edits) {
      return JSON.stringify(edits) !== JSON.stringify(guestBookConfig);
    } else return false;
  }

  function isDataValid() {
    return edits.GuestBookName?.length > 0 && isValidEmail(edits.GuestBookEmail) && areCustomFieldsValid()
  }

  function areCustomFieldsValid() {
    for (let i = 0; i <= 8; i++) {
      if (edits[`Custom${i}Type`]?.length > 0 && !edits[`Custom${i}Label`]) {
        return false;
      }
    }
    return true;
  }

  function onSubmit() {
    console.debug(`Updating guest book config...`);
    GuestBooks.insertOrUpdateGuestBook(edits)
      .then(response => {
        console.debug(`Guest book config updated.`);
        setGuestBookConfig(response);
        collapsePanel();
      })
      .catch(error => {
        console.error(`Error updating guest book config.`, error);
      })
  }

  function onRevert() {
    console.debug(`Revert form.`);
    if (guestBookConfig) {
      setEdits({...guestBookConfig});
    }
  }

  function onDeleteExtra() {
    if (extraId) {
      console.debug(`Deleting extra ${extraId} from page.`);
      Extras.deleteExtra(extraId).then(() => {
        console.debug(`Extra deleted.`);
        refreshPage();
      }).catch(error => {
        console.error(`Error deleting extra.`, error);
      })
    }
  }

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  /**
   * Enable another custom field.
   */
  function addCustomField() {
    for (let i = 1; i <= 8; i++) {
      if (!edits[`Custom${i}Type`]) {
        console.debug(`Adding custom field at position ${i}`);
        setEdits({
          ...edits,
          [`Custom${i}Label`]: '',
          [`Custom${i}Type`]: 'text',
          [`Custom${i}Options`]: '',
          [`Custom${i}Required`]: false,
        });
        break;
      }
    }
  }

  /**
   * How many custom fields are in use?
   * @returns {number} Index of last custom field
   */
  function lastCustomField() {
    let last = 0;
    for (let i = 1; i <= 8; i++) {
      if (edits[`Custom${i}Type`]) {
        last = i;
      }
    }
    return last;
  }

  return (<>
    {canEdit && (<>
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header><h5>Delete Guest Book</h5></Modal.Header>
        <Modal.Body>Are you sure you want to delete the guest book? This action can't be undone.</Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
          <Button size="sm" variant="danger" onClick={() => {
            GuestBooks.deleteGuestBook(guestBookConfig?.GuestBookID).then(() => {
              console.debug('Guest book deleted.');
              if (extraId) {
                Extras.deleteExtra(extraId).then(() => {
                  console.debug('Guest book extra deleted.');
                  setShowDeleteConfirmation(false);
                  refreshPage();
                }).catch(err => console.error('Guest book extra delete error.', err));
              }
            }).catch(err => {
              console.error('Guest book delete error.', err);
            })
          }}>Delete</Button>
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
            onClick={() => togglePanel('config')}
          />
          <Accordion.Body
            style={{background: '#e0e0e0f0', marginBottom: '20px'}}
          >
            <Row><Col><h5>Guest Book Properties</h5></Col></Row>
            <Row>
              <Col>
                <Form.Label
                  size={"sm"}
                  htmlFor={'GuestBookName'}
                  column={'sm'}
                  className="required"
                >
                  Guest Book Name (used for email titles)
                </Form.Label>
                <Form.Control
                  size={"sm"}
                  id={'GuestBookName'}
                  value={edits.GuestBookName || ''}
                  isInvalid={edits.GuestBookName?.length === 0}
                  isValid={edits.GuestBookName?.length > 0}
                  onChange={(e) => onDataChanged({name: 'GuestBookName', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Label
                  column={'sm'}
                  htmlFor={'GuestBookEmail'}
                  className="required"
                >
                  Send Feedback Emails To
                </Form.Label>
                <EmailField
                  id={'GuestBookEmail'}
                  size={'sm'}
                  value={edits.GuestBookEmail}
                  onChange={(e) => onDataChanged({name: 'GuestBookEmail', value: e.target.value})}
                />
              </Col>
              <Col sm={6}>
                <Form.Label
                  htmlFor={'GuestBookCCEmail'}
                  column={'sm'}
                >
                  CC Feedback Emails To
                </Form.Label>
                <EmailField
                  size={'sm'}
                  id={'GuestBookCCEmail'}
                  value={edits.GuestBookCCEmail}
                  onChange={(e) => onDataChanged({name: 'GuestBookCCEmail', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  checked={edits.AlwaysEmail || false}
                  className={'form-control-sm'}
                  label={'Always send email to admins, even without feedback'}
                  onChange={(e) => onDataChanged({name: 'AlwaysEmail', value: e.target.checked})}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label
                  size={"sm"}
                  htmlFor={'GuestBookMessage'}
                  column={'sm'}
                >
                  Before Submit Message
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  size={"sm"}
                  id={'GuestBookMessage'}
                  value={edits.GuestBookMessage || ''}
                  placeholder={'Please enter your information below.'}
                  onChange={(e) => onDataChanged({name: 'GuestBookMessage', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label
                  size={"sm"}
                  htmlFor={'DoneMessage'}
                  column={'sm'}
                >
                  After Submit Message
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  size={"sm"}
                  id={'DoneMessage'}
                  value={edits.DoneMessage || ''}
                  placeholder={'Your information has been submitted.'}
                  onChange={(e) => onDataChanged({name: 'DoneMessage', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Label
                  size={"sm"}
                  htmlFor={'SubmitButtonName'}
                  column={'sm'}
                >
                  Submit Button Label
                </Form.Label>
                <Form.Control
                  size={"sm"}
                  id={'SubmitButtonName'}
                  value={edits.SubmitButtonName || ''}
                  placeholder={'Submit'}
                  onChange={(e) => onDataChanged({name: 'SubmitButtonName', value: e.target.value})}
                />
              </Col>
              <Col sm={6}>
                <Form.Label
                  size={"sm"}
                  htmlFor={'AgainMessage'}
                  column={'sm'}
                >
                  Submit Again Button Label
                </Form.Label>
                <Form.Control
                  size={"sm"}
                  id={'AgainMessage'}
                  value={edits.AgainMessage || ''}
                  placeholder={'Submit Again'}
                  onChange={(e) => onDataChanged({name: 'AgainMessage', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm={6}>
                <Form.Label
                  size={"sm"}
                  htmlFor={'TextCaption'}
                  column={'sm'}
                >
                  Feedback Prompt
                </Form.Label>
                <Form.Control
                  size={"sm"}
                  id={'TextCaption'}
                  value={edits.TextCaption || ''}
                  placeholder={'Questions or Comments'}
                  disabled={!edits.ShowFeedback}
                  onChange={(e) => onDataChanged({name: 'TextCaption', value: e.target.value})}
                />
              </Col>
              <Col sm={6}>
                <Form.Label
                  size={"sm"}
                  htmlFor={"LabelCols"}
                  column={'sm'}
                >
                  Label Width
                </Form.Label>
                <Form.Select
                  id={'LabelCols'}
                  value={edits.LabelCols || '2'}
                  size={"sm"}
                  onChange={(e) => onDataChanged({name: 'LabelCols', value: parseInt(e.target.value)})}
                >
                  <option value={'2'}>2 Columns</option>
                  <option value={'3'}>3 Columns</option>
                  <option value={'4'}>4 Columns</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-2">
              <Form.Label column={'sm'} sm={2}>Show Inputs:</Form.Label>
              <Col sm={3}>
                <Form.Check
                  checked={edits.ShowName || false}
                  className={'form-control-sm'}
                  label={'Name'}
                  onChange={(e) => onDataChanged({name: 'ShowName', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowDayPhone || false}
                  className={'form-control-sm'}
                  label={'Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowDayPhone', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowEmail || false}
                  className={'form-control-sm'}
                  label={'Email'}
                  onChange={(e) => onDataChanged({name: 'ShowEmail', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowFeedback || false}
                  className={'form-control-sm'}
                  label={'Feedback'}
                  onChange={(e) => onDataChanged({name: 'ShowFeedback', value: e.target.checked})}
                />
              </Col>
              <Col sm={3}>
                <Form.Check
                  checked={edits.ShowAddress || false}
                  className={'form-control-sm'}
                  label={'Address'}
                  onChange={(e) => onDataChanged({name: 'ShowAddress', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowContactInfo || false}
                  className={'form-control-sm'}
                  label={'Contact Method'}
                  onChange={(e) => onDataChanged({name: 'ShowContactInfo', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowMailingList || false}
                  className={'form-control-sm'}
                  label={'Mailing List'}
                  onChange={(e) => onDataChanged({name: 'ShowMailingList', value: e.target.checked})}
                />
              </Col>
              <Col>
                <Form.Check
                  checked={edits.ShowEveningPhone || false}
                  className={'form-control-sm'}
                  label={'Mobile Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowEveningPhone', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowFax || false}
                  className={'form-control-sm'}
                  label={'Alternate Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowFax', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowLodgingFields || false}
                  className={'form-control-sm'}
                  label={'Lodging Fields'}
                  onChange={(e) => onDataChanged({name: 'ShowLodgingFields', value: e.target.checked})}
                />
              </Col>
            </Row>

            {edits.ShowMailingList && (
              <Row className="mt-2">
                <Col>
                  <Form.Check
                    checked={edits.MailingListDefault || false}
                    className={'form-control-sm'}
                    label={'Mailing list checked by default'}
                    onChange={(e) => onDataChanged({name: 'MailingListDefault', value: e.target.checked})}
                  />
                </Col>
              </Row>
            )}
            <CustomFieldsConfig guestBookConfig={edits} onChange={onDataChanged}/>
            <Row className="mt-4">
              <Col xs={'auto'}>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={onSubmit}
                  disabled={!hasEdits() || !isDataValid()}
                >
                  Update
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onRevert}
                  disabled={!hasEdits()}
                >
                  Revert
                </Button>
              </Col>
              <Col style={{textAlign: 'end'}}>
                <Button
                  className="me-2"
                  variant="secondary"
                  size="sm"
                  disabled={lastCustomField() >= 8}
                  onClick={addCustomField}
                >Add a Field</Button>
                {extraId && (
                  <Button
                    className="me-2"
                    variant="secondary"
                    size="sm"
                    onClick={() => onDeleteExtra()}
                  >Remove from Page</Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirmation(true)}
                >Delete Guest Book</Button>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>)}
  </>);
}