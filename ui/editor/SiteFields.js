import {useSiteContext} from "../content/Site";
import {Col, Form, Row, Button} from "react-bootstrap";
import {useRestApi} from "../../api/RestApi";
import {useMemo, useState} from "react";
import EditUtil from "./EditUtil";

export default function SiteFields(props) {

  const {siteData, setSiteData} = useSiteContext();
  const {Sites} = useRestApi();
  const [edits, setEdits] = useState({});
  const editUtil = useMemo(() => new EditUtil({data: siteData, setEdits: setEdits}), [siteData]);

  function onSubmit() {
    console.debug(`Updating site properties...`);
    Sites.insertOrUpdateSite(edits).then((result) => {
      console.debug(`Site properties updated.`);
      editUtil.update(result);
      setSiteData(result);
    }).catch((err) => {
      console.error(`Error updating site properties.`, err);
    })
  }

  function isDataValid() {
    return edits.SiteName?.length > 0
      && isValidUrl(edits.SiteRootUrl)
      && isValidBucket(edits.SiteBucketName)
  }

  function isValidUrl(url) {
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);
  }

  function isValidBucket(bucketName) {
    return bucketName && /[a-z.]*/.test(bucketName);
  }

  return (<>
    {siteData && (
      <div {...props}>
        <Row>
          <Col>
            <Form.Label column={'sm'} className={'required'} htmlFor={'SiteName'}>Site Name</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteName'}
              isValid={editUtil?.isTouched('SiteName') && edits.SiteName?.length > 0}
              isInvalid={editUtil?.isTouched('SiteName') && !edits.SiteName}
              value={edits.SiteName || ''}
              onChange={(e) => editUtil?.onDataChanged({name: 'SiteName', value: e.target.value})}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label column={'sm'} className={'required'} htmlFor={'SiteRootUrl'}>URL</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteRootUrl'}
              isValid={editUtil?.isTouched('SiteRootUrl') && isValidUrl(edits.SiteRootUrl)}
              isInvalid={editUtil?.isTouched('SiteRootUrl') && !isValidUrl(edits.SiteRootUrl)}
              value={edits.SiteRootUrl || ''}
              onChange={(e) => editUtil?.onDataChanged({name: 'SiteRootUrl', value: e.target.value})}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label column={'sm'} className={'required'} htmlFor={'SiteBucketName'}>S3 Bucket</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteBucketName'}
              isValid={editUtil?.isTouched('SiteRootUrl') && isValidBucket(edits.SiteBucketName)}
              isInvalid={editUtil?.isTouched('SiteRootUrl') && !isValidBucket(edits.SiteBucketName)}
              value={edits.SiteBucketName || ''}
              onChange={(e) => editUtil?.onDataChanged({name: 'SiteBucketName', value: e.target.value})}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Button
              size={'sm'}
              variant={'primary'}
              className={'me-2'}
              onClick={onSubmit}
              disabled={!editUtil?.isTouched() || !isDataValid()}
            >
              Update</Button>
            <Button
              size={'sm'}
              variant={'secondary'}
              disabled={!editUtil?.isTouched()}
              onClick={() => editUtil?.revert()}
            >
              Revert</Button>
          </Col>
        </Row>
      </div>
    )}
  </>)
}