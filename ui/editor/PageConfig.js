import {useEdit} from "./EditProvider";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useMemo, useRef, useState} from "react";
import {usePageContext} from "../content/Page";
import {useRestApi} from "../../api/RestApi";
import {useSiteContext} from "../content/Site";
import {useNavigate} from "react-router";
import AddExtrasModal from "../extras/AddExtrasModal";
import EditUtil from "./EditUtil";
import EditorPanel from "./EditorPanel";

/**
 * Edit page metadata fields.
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageConfig() {

  const {Pages, PageSections} = useRestApi();
  const {canEdit} = useEdit();
  const {pageData, setPageData, refreshPage} = usePageContext();
  const {Outline, outlineData} = useSiteContext()

  const [edits, setEdits] = useState({});
  const editUtil = useMemo(() => new EditUtil({data: pageData, setEdits: setEdits}), [pageData]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const navigate = useNavigate();
  const [showAddExtras, setShowAddExtras] = useState(false);

  const buttonRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    if (outlineData && pageData) {
      const routeList = [];
      for (const page of outlineData) {
        if (page.PageID !== pageData.PageID) {
          routeList.push(page.PageRoute);
        }
      }
      setRoutes(routeList);
    }
  }, [outlineData, pageData]);

  if (!canEdit) {
    return <></>;
  }

  function isDataValid() {
    return isValidRoute(edits.PageRoute)
  }

  function onUpdate() {
    console.debug(`Updating page...`);
    Pages.insertOrUpdatePage(edits).then((result) => {
      console.debug(`Updated page.`);
      editUtil.update(result)
      Outline.updatePage(result);
      setPageData(result);
    }).catch((error) => {
      console.error(`Error updating page.`, error);
    });
    collapsePanel();
  }

  function onAddSection() {
    if (pageData) {
      const data = {
        PageID: pageData.PageID
      }
      console.debug(`Adding page section...`);
      PageSections.insertOrUpdatePageSection(data)
        .then(() => {
          refreshPage();
        }).catch((error) => {
        console.error(`Error adding page section.`, error);
      })
      collapsePanel();
    }
  }

  function onDelete() {
    console.debug(`Deleting page...`);
    Pages.deletePage(pageData.PageID)
      .then(() => {
        console.debug(`Deleted page.`);
        Outline.deletePage(pageData.PageID);
        navigate('/');
        collapsePanel();
      })
      .catch(e => console.error(`Error deleting page.`, e));
  }

  function isValidRoute(route) {
    return route?.match(/^\/[a-z0-9]+/) && !routes.includes(route);
  }

  function collapsePanel() {
    buttonRef.current?.click();
  }

  return (<>
    <EditorPanel
      editUtil={editUtil}
      position={'fixed'}
      onUpdate={onUpdate}
      onDelete={() => setShowDeleteConfirmation(true)}
      isDataValid={isDataValid}
      panelStyle={{zIndex: 1032}}
      buttonStyle={{position: 'fixed', top: '5px'}}
      bodyStyle={{borderBottom: '1px solid gray'}}
      buttonRef={buttonRef}
      extraButtons={<>
        <Button
          className="me-2"
          size="sm"
          variant="secondary"
          onClick={onAddSection}
        >
          <span className={'d-none d-sm-block'}>Add Section</span>
          <span className={'d-block d-sm-none'}>+Section</span>
        </Button>
        <Button
          className="me-2"
          size="sm"
          variant="secondary"
          onClick={() => setShowAddExtras(true)}
        >
          <span className={'d-none d-sm-block'}>Add Extra</span>
          <span className={'d-block d-sm-none'}>+Extra</span>
        </Button>
      </>}
    >
      <Row><Col><h5>Page Properties</h5></Col></Row>
      <Row>
        <Col sm={4}>
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
            onChange={(e) => editUtil?.onDataChanged({name: 'NavTitle', value: e.target.value})}
          />
        </Col>

        <Col sm={3}>
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
            isValid={editUtil?.isTouched('PageRoute') && isValidRoute(edits.PageRoute)}
            isInvalid={editUtil?.isTouched('PageRoute') && !isValidRoute(edits.PageRoute)}
            value={edits.PageRoute || ''}
            onChange={(e) => editUtil?.onDataChanged({name: 'PageRoute', value: e.target.value})}
          />
        </Col>
        <Col>
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
            onChange={(e) => editUtil?.onDataChanged({name: 'PageMetaTitle', value: e.target.value})}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
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
            onChange={(e) => editUtil?.onDataChanged({name: 'PageMetaDescription', value: e.target.value})}
          />
        </Col>
        <Col sm={6}>
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
            onChange={(e) => editUtil?.onDataChanged({name: 'PageMetaKeywords', value: e.target.value})}
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
            onChange={(e) => editUtil?.onDataChanged({name: 'PageHidden', value: e.target.checked})}
          />
        </Col>
      </Row>
    </EditorPanel>

    <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} style={{zIndex: 2020}}>
      <Modal.Header><h5>Delete Page</h5></Modal.Header>
      <Modal.Body>Are you sure you want to delete this page? This action can't be undone.</Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
        <Button size="sm" variant="danger" onClick={() => {
          setShowDeleteConfirmation(false);
          onDelete();
        }}>Delete</Button>
      </Modal.Footer>
    </Modal>

    <AddExtrasModal
      show={showAddExtras}
      onHide={() => setShowAddExtras(false)}
      onSubmit={() => collapsePanel()}
    />
  </>)
    ;
}