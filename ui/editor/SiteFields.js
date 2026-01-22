import {useSiteContext} from "../content/Site";
import {Col, Form, Row, Button} from "react-bootstrap";
import {useRestApi} from "../../api/RestApi";
import {useEffect, useState} from "react";

export default function SiteFields() {
  const {siteData, setSiteData} = useSiteContext();
  const {insertOrUpdateSite} = useRestApi();
  const [edits, setEdits] = useState({});
  const [touched, setTouched] = useState([]);

  useEffect(() => {
    if (siteData) {
      setEdits({...siteData});
    }
  }, [siteData])

  function onDataChanged({name, value}) {
    setEdits({...edits, [name]: value});
    setTouched([...touched, name]);
  }

  function onSubmit() {
    console.debug(`Updating site properties...`);
    insertOrUpdateSite(edits).then((result) => {
      console.debug(`Site properties updated.`);
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
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
  }

  function isValidBucket(bucketName) {
    return bucketName && /[a-z.]*/.test(bucketName);
  }

  function isEdited(name) {
    if (siteData) {
      if (!name) {
        return touched.length > 0;
      } else {
        return touched.includes(name);
      }
    } else {
      return false;
    }
  }

  function onRevert() {
    setEdits({...siteData});
    setTouched([]);
  }

  return (<>
    {siteData && (
      <div>
        <Row>
          <Col>
            <Form.Label column={'sm'} htmlFor={'SiteName'}>Site Name</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteName'}
              isValid={isEdited('SiteName') && edits.SiteName?.length > 0}
              isInvalid={isEdited('SiteName') && !edits.SiteName}
              value={edits.SiteName || ''}
              onChange={(e) => onDataChanged({name: 'SiteName', value: e.target.value})}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label column={'sm'} htmlFor={'SiteRootUrl'}>URL</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteRootUrl'}
              isValid={isEdited('SiteRootUrl') && isValidUrl(edits.SiteRootUrl)}
              isInvalid={isEdited('SiteRootUrl') && !isValidUrl(edits.SiteRootUrl)}
              value={edits.SiteRootUrl || ''}
              onChange={(e) => onDataChanged({name: 'SiteRootUrl', value: e.target.value})}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label column={'sm'} htmlFor={'SiteBucketName'}>S3 Bucket</Form.Label>
            <Form.Control
              size={'sm'}
              id={'SiteBucketName'}
              isValid={isEdited('SiteBucketName') && isValidBucket(edits.SiteBucketName)}
              isInvalid={isEdited('SiteBucketName') &&  !isValidBucket(edits.SiteBucketName)}
              value={edits.SiteBucketName || ''}
              onChange={(e) => onDataChanged({name: 'SiteBucketName', value: e.target.value})}
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
              disabled={!isEdited() || !isDataValid()}
            >
              Update</Button>
            <Button
              size={'sm'}
              variant={'secondary'}
              disabled={!isEdited()}
              onClick={() => onRevert()}
            >
              Revert</Button>
          </Col>
        </Row>
      </div>
    )}
  </>)
}