import {Accordion, AccordionButton, Button, Col, Row} from "react-bootstrap";
import {useState} from "react";
import {useEdit} from "./EditProvider";

/**
 *
 */

/**
 * Display a collapsable editing panel
 *
 * @param onUpdate {MouseEventHandler}    Callback when Update button is clicked.
 * @param onDelete {MouseEventHandler}    Callback when Delete button is clicked.
 * @param isDataValid {function}          Callback to check if data is valid.
 * @param editUtil {EditUtil}             Edit utility to manage changes.
 * @param [extraButtons] {JSX.Element}    Extra buttons for the bottom of the panel.
 * @param children {[JSX.Element]}        Child elements, i.e. Rows and Cols and form controls.
 * @param [position] {String}             Position attribute for the panel, i.e. 'fixed' or 'relative'
 * @param [buttonStyle] {Object}          Additional styles for the collapse/expand button.
 * @param [buttonRef] {RefObject}         Reference to the collapse/expand button.
 * @param [panelStyle] {Object}           Additional styles for the panel container.
 * @param [bodyStyle] {Object}            Additional styles for the panel body.
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditorPanel(
  {
    onUpdate,
    onDelete,
    isDataValid,
    editUtil,
    children,
    position,
    buttonStyle,
    buttonRef,
    panelStyle,
    bodyStyle,
    extraButtons
  }
) {
  const [activeKey, setActiveKey] = useState('');

  const {canEdit} = useEdit();
  if (!canEdit) {
    return <></>
  }
  return (
    <Accordion
      activeKey={activeKey}
      style={{width: '100%'}}
      className={'EditorPanel'}
    >
      <Accordion.Item
        style={{
          width: "100%",
          position: position ? position : 'relative',
          background: 'transparent',
          border: 'none',
          ...panelStyle,
        }}
        eventKey={'config'}
      >
        <AccordionButton
          style={{
            padding: '0 8px 0 0',
            top: '0',
            left: '0',
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
            ...buttonStyle,
          }}
          ref={buttonRef}
          onClick={() => setActiveKey(activeKey === 'config' ? '' : 'config')}
        />
        <Accordion.Body
          style={{
            background: '#e0e0e0f0',
            marginBottom: '20px',
            ...bodyStyle,
          }}
        >
          {children}
          <Row className={'mt-4'}>
            <Col xs={'auto'} className={'pe-0'}>
              {onUpdate && isDataValid && (
                <Button
                  className="me-2"
                  size={'sm'}
                  variant="primary"
                  onClick={onUpdate}
                  disabled={!isDataValid() || !editUtil?.isDataChanged()}
                >
                  Update
                </Button>
              )}
              {editUtil && (
                <Button
                  size={'sm'}
                  variant="secondary"
                  onClick={() => editUtil.revert()}
                  disabled={!editUtil.isDataChanged()}
                >
                  Revert
                </Button>
              )}
            </Col>
            <Col style={{textAlign: 'end'}} className={'ps-0'}>
              {extraButtons}
              {onDelete && (
                <Button
                  size={'sm'}
                  variant="danger"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}