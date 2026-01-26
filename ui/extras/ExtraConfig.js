import {useMemo, useState} from "react";
import EditUtil from "../editor/EditUtil";
import {Col, Form, Row} from "react-bootstrap";
import EditorPanel from "../editor/EditorPanel";
import {useEdit} from "../editor/EditProvider";
import {useRestApi} from "../../api/RestApi";
import {usePageContext} from "../content/Page";

export default function ExtraConfig({extraData}) {

  const {canEdit} = useEdit();
  const [edits, setEdits] = useState({});
  const editUtil = useMemo(() => new EditUtil({data: extraData, setEdits: setEdits}), [extraData]);
  const {Extras} = useRestApi();
  const {refreshPage} = usePageContext();

  if (!canEdit) {
    return <></>;
  }

  const labelCols = 2;

  return (
    <EditorPanel
      onUpdate={() => {
        console.log(`Updating extra.`);
        Extras.insertOrUpdateExtra(edits).then((result) => {
          console.log(`Extra updated.`);
          editUtil.update(result);
          refreshPage();
        }).catch((err) => {
          console.error(`Error updating extra.`, err);
        });
      }}
      onDelete={() => {
        console.log(`Deleting extra.`);
        Extras.deleteExtra(extraData.ExtraID).then(() => {
          console.log(`Extra deleted.`);
          refreshPage();
        }).catch((err) => {
          console.error(`Error deleting extra.`, err);
        });
      }}
      isDataValid={() => true}
      editUtil={editUtil}
    >
      <h5>File Properties</h5>
      <Row className="mt-2">
        <Form.Label
          column={'sm'}
          sm={labelCols}
          htmlFor={'CurrentFile'}>Current File</Form.Label>
        <Col>
          <Form.Control
            size={'sm'}
            id={'CurrentFile'}
            value={extraData.ExtraFile}
            readOnly={true}
            disabled={true}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Form.Label
          column={'sm'}
          sm={labelCols}
          htmlFor={'ExtraFile'}>Replace File</Form.Label>
        <Col>
          <Form.Control
            type={'file'}
            size={'sm'}
            id={'ExtraFile'}
            onChange={(e) => {
              editUtil?.onDataChanged({
                  changes: [
                    {name: 'ExtraFile', value: e.target.files[0]},
                    {name: 'ExtraFileMimeType', value: e.target.files[0].type}
                  ]
                }
              );
            }}
          />
        </Col>
      </Row>
      <Row
        className="mt-2"
        hidden={edits.ExtraFileMimeType?.startsWith('text/')}
      >
        <Form.Label
          column={'sm'}
          sm={labelCols}
          htmlFor={'ExtraFilePrompt'}>File Prompt</Form.Label>
        <Col>
          <Form.Control
            size={'sm'}
            id={'ExtraFilePrompt'}
            value={edits.ExtraFilePrompt || ''}
            onChange={(e) => editUtil?.onDataChanged({name: 'ExtraFilePrompt', value: e.target.value})}
          />
        </Col>
      </Row>
    </EditorPanel>
  );
}