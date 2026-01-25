import {useEdit} from "../editor/EditProvider";
import {useRestApi} from "../../api/RestApi";
import {usePageContext} from "../content/Page";
import {Col, Row, Form} from "react-bootstrap";
import EditorPanel from "../editor/EditorPanel";
import EditUtil from "../editor/EditUtil";
import {useMemo, useState} from "react";

export default function InstagramConfig({extraData}) {

  const {canEdit} = useEdit();
  const [edits, setEdits] = useState({});
  const editUtil = useMemo(() => new EditUtil({data: extraData, setEdits: setEdits}), [extraData]);
  const {Extras} = useRestApi();
  const {refreshPage} = usePageContext();

  if (!canEdit) {
    return <></>;
  }

  function isValidInstagramHandle(value) {
    return value && /^@[a-zA-Z0-9\-.]+$/.test(value);
  }

  function onUpdate() {
    console.log(`Updating instagram extra.`);
    Extras.insertOrUpdateExtra(edits)
      .then(() => {
        refreshPage();
      })
      .catch((err) => {
        console.error(`Error updating extra.`, err);
      })
  }

  function onDelete() {
    console.debug(`Delete extra....`);
    Extras.deleteExtra(extraData.ExtraID).then(() => {
      console.debug(`Extra deleted.`);
      refreshPage();
    }).catch((e) => console.error(`Error deleting extra.`, e));
  }

  const labelCols = 3;
  return (
    <EditorPanel
      editUtil={editUtil}
      onDelete={onDelete}
      onUpdate={onUpdate}
      isDataValid={()=>isValidInstagramHandle(edits.InstagramHandle)}
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
            isValid={editUtil?.isTouched('InstagramHandle') && isValidInstagramHandle(edits.InstagramHandle)}
            isInvalid={editUtil?.isTouched('InstagramHandle') && !isValidInstagramHandle(edits.InstagramHandle)}
            value={edits.InstagramHandle || ''}
            onChange={(e) => editUtil?.onDataChanged({name: 'InstagramHandle', value: e.target.value})}
          />
        </Col>
      </Row>
    </EditorPanel>
  )
}