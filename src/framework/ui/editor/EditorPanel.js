import {Accordion, AccordionButton, Button, Col, Row} from "react-bootstrap";
import {useState} from "react";

export default function EditorPanel({onUpdate, onDelete, isDataValid, editUtil, children}) {
  const [activeKey, setActiveKey] = useState('');
  return (
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
          {children}
          <Row className={'mt-4'}>
            <Col>
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
                  onClick={()=>editUtil.revert()}
                  disabled={!editUtil.isDataChanged()}
                >
                  Revert
                </Button>
              )}
            </Col>
            <Col style={{textAlign: 'end'}}>
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