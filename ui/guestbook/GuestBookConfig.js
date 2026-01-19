import {useGuestBook} from "./GuestBook";
import {useEdit} from "../editor/EditProvider";
import {
  Accordion,
  AccordionButton, AccordionItem,
  Button, Col,
  Form,
  Row
} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import EmailField from "../forms/EmailField";
import {useRestApi} from "../../api/RestApi";

export default function GuestBookConfig() {
  const {guestBookConfig, setGuestBookConfig} = useGuestBook();
  const {canEdit} = useEdit();
  const {insertOrUpdateGuestBook} = useRestApi();

  const [edits, setEdits] = useState({
    GuestBookName: '',
    GuestBookEmail: '',
    GuestBookCCEmail: '',
    GuestBookMessage: '',
    ShowName: false,
    ShowEmail: false,
    ShowCompany: false,
    ShowAddress: false,
    ShowDayPhone: false,
    ShowEveningPhone: false,
    ShowFax: false,
    ShowContactInfo: false,
    ShowMailingList: false,
    MailingListDefault: false,
    ShowFeedback: false,
    ShowLodgingFields: false,
    TextCaption: '',
    DoneMessage: '',
    AgainMessage: '',
    SubmitButtonName: '',
    AlwaysEmail: false,
  });
  const [activeKey, setActiveKey] = useState(null);

  const submitButton = useRef(null);
  const revertButton = useRef(null);

  useEffect(() => {
    if (guestBookConfig) {
      setEdits({...guestBookConfig});
      if (submitButton.current) submitButton.current.disabled = true;
      if (revertButton.current) revertButton.current.disabled = true;
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
    submitButton.current.disabled = false;
    revertButton.current.disabled = false;
  }

  function onSubmit() {
    console.debug(`Updating guest book config...`);
    insertOrUpdateGuestBook(edits)
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
      submitButton.current.disabled = true;
      revertButton.current.disabled = true;
    }
  }

  return (
    <>{canEdit && (
      <Accordion
        activeKey={activeKey}
      >
        <Accordion.Item
          style={{width: "100%", position: "relative", background: 'transparent', border: 'none'}}
          eventKey={'config'}
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
            onClick={() => togglePanel('config')}
          />
          <Accordion.Body
            style={{background: '#00000022', marginBottom: '20px'}}
          >
            <Row><Col><h5>Guest Book Properties</h5></Col></Row>
            <Row>
              <Col>
                <Form.Label
                  size={"sm"}
                  htmlFor={'GuestBookName'}
                  column={'sm'}
                >
                  Guest Book Name
                </Form.Label>
                <Form.Control
                  size={"sm"}
                  id={'GuestBookName'}
                  value={edits.GuestBookName}
                  onChange={(e) => onDataChanged({name: 'GuestBookName', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Label
                  column={'sm'}
                  htmlFor={'GuestBookEmail'}
                >
                  Send Feedback To
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
                  Copy Feedback To
                </Form.Label>
                <EmailField
                  size={'sm'}
                  id={'GuestBookCCEmail'}
                  value={edits.GuestBookCCEmail}
                  onChange={(e) => onDataChanged({name: 'GuestBookCCEmail', value: e.target.value})}
                />
              </Col>
            </Row>
            <Form.Group>
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
                value={edits.GuestBookMessage}
                onChange={(e) => onDataChanged({name: 'GuestBookMessage', value: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
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
                value={edits.DoneMessage}
                onChange={(e) => onDataChanged({name: 'DoneMessage', value: e.target.value})}
              />
            </Form.Group>
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
                  value={edits.SubmitButtonName}
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
                  value={edits.AgainMessage}
                  onChange={(e) => onDataChanged({name: 'AgainMessage', value: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Check
                  checked={edits.AlwaysEmail}
                  className={'form-control-sm'}
                  label={'Always send email, even without feedback'}
                  onChange={(e) => onDataChanged({name: 'AlwaysEmail', value: e.target.checked})}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm={2}>
                <Form.Label column={'sm'}>Show Inputs:</Form.Label>
              </Col>
              <Col sm={3}>
                <Form.Check
                  inline
                  checked={edits.ShowName}
                  className={'form-control-sm'}
                  label={'Name'}
                  onChange={(e) => onDataChanged({name: 'ShowName', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowAddress}
                  className={'form-control-sm'}
                  label={'Address'}
                  onChange={(e) => onDataChanged({name: 'ShowAddress', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowEmail}
                  className={'form-control-sm'}
                  label={'Email'}
                  onChange={(e) => onDataChanged({name: 'ShowEmail', value: e.target.checked})}
                />
              </Col>
              <Col sm={3}>
                <Form.Check
                  checked={edits.ShowDayPhone}
                  className={'form-control-sm'}
                  label={'Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowDayPhone', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowMailingList}
                  className={'form-control-sm'}
                  label={'Mailing List'}
                  onChange={(e) => onDataChanged({name: 'ShowMailingList', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowFeedback}
                  className={'form-control-sm'}
                  label={'Feedback'}
                  onChange={(e) => onDataChanged({name: 'ShowFeedback', value: e.target.checked})}
                />
              </Col>
              <Col>
                <Form.Check
                  checked={edits.ShowEveningPhone}
                  className={'form-control-sm'}
                  label={'Mobile Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowEveningPhone', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowFax}
                  className={'form-control-sm'}
                  label={'Alternate Phone'}
                  onChange={(e) => onDataChanged({name: 'ShowFax', value: e.target.checked})}
                />
                <Form.Check
                  checked={edits.ShowLodgingFields}
                  className={'form-control-sm'}
                  label={'Lodging Fields'}
                  onChange={(e) => onDataChanged({name: 'ShowLodgingFields', value: e.target.checked})}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  checked={edits.MailingListDefault}
                  className={'form-control-sm'}
                  label={'Mailing list checked by default'}
                  disabled={!edits.ShowMailingList}
                  onChange={(e) => onDataChanged({name: 'MailingListDefault', value: e.target.checked})}
                  />
              </Col>
            </Row>
            <Accordion defaultActiveKey={null} className={'mt-2'}>
              <AccordionItem
                eventKey={'custom'}
                style={{background: 'transparent', border: 'none'}}
              >
                <AccordionButton
                  style={{background: 'transparent', boxShadow: 'none', padding: 0}}
                >
                  <h5>Custom Field Configuration</h5>
                </AccordionButton>
                <Accordion.Body>
                  <Row>
                    <Col sm={12}>

                    </Col>
                  </Row>
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2 mt-2"
                  onClick={onSubmit}
                  ref={submitButton}
                >
                  Update
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2 mt-2"
                  onClick={onRevert}
                  ref={revertButton}
                >
                  Revert
                </Button>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )}
    </>
  )
    ;
}