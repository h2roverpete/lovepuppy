import EmailField, {isValidEmail} from "../forms/EmailField";
import {useRestApi} from "../../api/RestApi";
import {useSiteContext} from "../content/Site";
import {usePageContext} from "../content/Page";
import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {usePageSectionContext} from "../content/PageSection";

/**
 * @callback Callback
 * Callback function with no params.
 */

/**
 * Modal dialog for adding content extras.
 *
 * @param show    {Boolean}
 * @param onHide  {Callback}
 * @param onSubmit {Callback}
 * @returns {JSX.Element}
 * @constructor
 */
export default function AddExtrasModal({show, onHide, onSubmit}) {

  const {siteData} = useSiteContext();
  const {pageData} = usePageContext();
  const {pageSectionData} = usePageSectionContext();
  const {GuestBooks, Galleries, Extras} = useRestApi();

  // data for extras
  const [extraData, setExtraData] = useState({});
  const [guestBookData, setGuestBookData] = useState({});

  // lists of existing extras
  const [guestBookList, setGuestBookList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    if (siteData) {
      // insert page ID when it becomes available, if section ID not defined
      onDataChanged({name: 'SiteID', value: siteData.SiteID});
    }
  }, [siteData]);

  useEffect(() => {
    if (pageData) {
      // insert page ID when it becomes available, if section ID not defined
      onDataChanged({name: 'PageID', value: pageData.PageID});
    }
  }, [pageData]);

  useEffect(() => {
    if (pageSectionData) {
      // insert page section ID if it becomes available
      onDataChanged({name: 'PageSectionID', value: pageSectionData.PageSectionID});
    }
  }, [pageSectionData]);

  useEffect(() => {
    // load list of existing galleries
    if (Galleries) {
      Galleries.getGalleries().then((result) => {
        console.debug(`List of ${result.length} galleries loaded.`);
        setGalleryList(result);
      }).catch((err) => {
        console.error(`Error getting gallery list.`, err);
      })
    }
  }, [Galleries]);

  // load list of existing guest books
  useEffect(() => {
    if (GuestBooks) {
      GuestBooks.getGuestBooks().then((result) => {
        console.debug(`List of ${result.length} guest books loaded.`);
        setGuestBookList(result);
      }).catch((err) => {
        console.error(`Error getting guest book list.`, err);
      })
    }
  }, [GuestBooks]);

  function onAddExtra() {
    if (extraData.ExtraID) {
      console.warn(`Extra already added.`);
      return;
    }
    switch (extraData.ExtraType) {
      case 'gallery':
        if (extraData.GalleryID) {
          console.debug(`Adding gallery extra.`);
          Extras.insertOrUpdateExtra({
            ExtraType: extraData.ExtraType,
            SiteID: extraData.SiteID,
            PageID: extraData.PageID,
            PageSectionID: extraData.PageSectionID,
            GalleryID: extraData.GalleryID
          }).then(() => {
            console.debug(`Extra added.`);
            onHide?.();
            onSubmit?.();
            setExtraData({});
          }).catch((err) => {
            console.error(`Error adding extra.`, err);
          });
        } else {
          Galleries.insertOrUpdateGallery({GalleryName: siteData.SiteName}).then((result) => {
            console.debug(`Gallery added.`);
            Extras.insertOrUpdateExtra({
              ExtraType: extraData.ExtraType,
              SiteID: extraData.SiteID,
              PageID: extraData.PageID,
              PageSectionID: extraData.PageSectionID,
              GalleryID: result.GalleryID
            }).then(() => {
              console.debug(`Extra added.`);
              setExtraData(result);
              onHide?.();
              onSubmit?.();
              setExtraData({});
            }).catch((err) => {
              console.error(`Error adding extra.`, err);
            });
          }).catch((err) => {
            console.error(`Error adding gallery.`, err);
          });
        }
        break;
      case 'guestbook':
        if (!extraData.GuestBookID) {
          GuestBooks.insertOrUpdateGuestBook({
            GuestBookName: guestBookData.GuestBookName,
            GuestBookEmail: guestBookData.GuestBookEmail,
            SiteID: siteData.SiteID,
            ShowName: true,
            ShowEmail: true,
            ShowPhone: true,
            ShowFeedback: true
          }).then((result) => {
            console.debug(`Guest book added.`);
            Extras.insertOrUpdateExtra({
              ExtraType: extraData.ExtraType,
              SiteID: extraData.SiteID,
              PageID: extraData.PageID,
              PageSectionID: extraData.PageSectionID,
              GuestBookID: result.GuestBookID
            }).then(() => {
              console.debug(`Extra added.`);
              onHide?.();
              onSubmit?.();
              setExtraData({});
            }).catch((err) => {
              console.error(`Error adding extra.`, err);
            });
          }).catch((error) => {
            console.error(`Error adding guest book.`, error);
          })
        } else {
          // create an Extra for an existing guest book
          Extras.insertOrUpdateExtra({
            ExtraType: extraData.ExtraType,
            SiteID: extraData.SiteID,
            PageID: extraData.PageID,
            PageSectionID: extraData.PageSectionID,
            GuestBookID: extraData.GuestBookID
          }).then((result) => {
            console.debug(`Extra added.`);
            setExtraData(result);
            onHide?.();
            onSubmit?.();
            setExtraData({});
          }).catch((err) => {
            console.error(`Error adding extra.`, err);
          });
        }
        break;
      default:
        console.error(`Unsupported extra type ${extraData.ExtraType}`)
    }
  }

  function isDataValid() {
    switch (extraData.ExtraType) {
      case 'guestbook':
        if (!extraData.GuestBookID) {
          return isValidEmail(guestBookData.GuestBookEmail) && guestBookData.GuestBookName.length > 0;
        } else {
          return extraData.GuestBookID > 0;
        }
      case 'gallery':
        return extraData.GalleryID === undefined || extraData.GalleryID > 0;
      case 'instagram':
        return isValidInstagramHandle(extraData.InstagramHandle);
      default:
        return false;
    }
  }

  function isValidInstagramHandle(value) {
    return value && /^@[a-zA-Z0-9]+$/.test(value);
  }

  function onDataChanged({name, value}) {
    console.debug(`onDataChanged: name=${name}, value=${value}`);
    const newData = {...extraData};
    if ((value === undefined || value === null) && extraData[name]) {
      delete newData[name];
    } else {
      newData[name] = value;
    }
    setExtraData(newData);
    console.debug(`Extra data: ${JSON.stringify(newData)}`);
  }

  function onCancel() {
    setExtraData({});
    onHide?.();
  }

  const labelCols = 4;

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header><h5>Add an Extra to '{pageData.PageTitle}'</h5></Modal.Header>
      <Modal.Body>
        <Row>
          <Form.Label
            className='required'
            column={'sm'}
            htmlFor={'ExtraType'}
            sm={labelCols}
          >
            Extra to Add
          </Form.Label>
          <Col>
            <Form.Select
              id="ExtraType"
              size={'sm'}
              value={extraData.ExtraType}
              onChange={(e) => onDataChanged({name: 'ExtraType', value: e.target.value})}
            >
              <option value={''}>(Select)</option>
              <option value='gallery'>Photo Gallery</option>
              <option value='guestbook'>Guest Book</option>
              <option value='instagram'>Instagram Gallery</option>
              <option value='html'>HTML File</option>
            </Form.Select>
          </Col>
        </Row>
        {extraData.ExtraType === 'guestbook' && (<>
          <Row className="mt-2">
            <Col sm={labelCols}></Col>
            <Col>
              <Form.Check
                type='radio'
                name={'NewGuestBook'}
                className='form-control-sm'
                label='Create new guest book'
                checked={extraData.GuestBookID === undefined}
                onChange={() => {
                  onDataChanged({name: 'GuestBookID', value: undefined});
                }}
              />
              <Form.Check
                type='radio'
                name={'NewGuestBook'}
                value={'true'}
                className='form-control-sm'
                label='Use existing guest book'
                checked={extraData.GuestBookID !== undefined}
                onChange={() => {
                  onDataChanged({name: 'GuestBookID', value: 0});
                }}
              />
            </Col>
          </Row>
          {extraData.GuestBookID === undefined ? (<>
            <Row className="mt-2">
              <Form.Label className='required' column={'sm'} htmlFor={'GuestBookName'} sm={labelCols}>
                Guest Book Name</Form.Label>
              <Col>
                <Form.Control
                  id="GuestBookName"
                  name="GuestBookEmail"
                  size="sm"
                  isValid={guestBookData.GuestBookName != null && guestBookData.GuestBookName.length > 0}
                  isInvalid={guestBookData.GuestBookName != null && guestBookData.GuestBookName.length === 0}
                  onChange={(e) => setGuestBookData({...guestBookData, GuestBookName: e.target.value})}
                  value={guestBookData.GuestBookName || ''}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Form.Label className='required' column={'sm'} htmlFor={'GuestBookEmail'} sm={labelCols}>Admin
                Email</Form.Label>
              <Col>
                <EmailField
                  id="GuestBookEmail"
                  name="GuestBookEmail"
                  size="sm"
                  onChange={(e) => setGuestBookData({...guestBookData, GuestBookEmail: e.target.value})}
                  value={guestBookData.GuestBookEmail}
                />
              </Col>
            </Row>
          </>) : (<>
            <Row className="mt-2">
              <Form.Label
                className='required'
                column={'sm'}
                htmlFor={'GuestBook'}
                sm={labelCols}
              >Guest Book
              </Form.Label>
              <Col>
                <Form.Select
                  id="GuestBook"
                  name="GuestBookEmail"
                  size="sm"
                  onChange={(e) => onDataChanged({name: 'GuestBookID', value: parseInt(e.target.value)})}
                  value={extraData.GuestBookID}
                >
                  <option key={''} value={0}>(Select a guest book)</option>
                  {guestBookList.map((guestBook) => (
                    <option key={guestBook.GuestBookID} value={guestBook.GuestBookID}>{guestBook.GuestBookName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </>)}
        </>)}
        {extraData.ExtraType === 'gallery' && (<>
          <Row className="mt-2">
            <Col sm={labelCols}></Col>
            <Col>
              <Form.Check
                type='radio'
                name={'NewGallery'}
                className='form-control-sm'
                label='Create new gallery'
                checked={extraData.GalleryID === undefined}
                onChange={() => {
                  onDataChanged({name: 'GalleryID', value: undefined});
                }}
              />
              <Form.Check
                type='radio'
                name={'NewGallery'}
                value={'true'}
                className='form-control-sm'
                label='Use existing gallery'
                checked={extraData.GalleryID !== undefined}
                onChange={() => {
                  onDataChanged({name: 'GalleryID', value: 0});
                }}
              />
            </Col>
          </Row>
          {extraData.GalleryID !== undefined && (
            <Row className="mt-2">
              <Form.Label
                className='required'
                column={'sm'}
                htmlFor={'Gallery'}
                sm={labelCols}
              >Gallery
              </Form.Label>
              <Col>
                <Form.Select
                  id="Gallery"
                  size="sm"
                  onChange={(e) => onDataChanged({name: 'GalleryID', value: parseInt(e.target.value)})}
                  value={extraData.GalleryID}
                >
                  <option key={''} value={0}>(Select a gallery)</option>
                  {galleryList.map((gallery) => (
                    <option key={gallery.GalleryID} value={gallery.GalleryID}>{gallery.GalleryName}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}
        </>)}
        {extraData.ExtraType === 'instagram' && (
          <Row className="mt-2">
            <Form.Label
              className='required'
              column={'sm'}
              htmlFor={'InstagramHandle'}
              sm={labelCols}
            >
              Instagram Handle
            </Form.Label>
            <Col>
              <Form.Control
                id="InstagramHandle"
                name="InstagramHandle"
                size="sm"
                placeholder="@myhandle"
                isValid={extraData.InstagramHandle && isValidInstagramHandle(extraData.InstagramHandle)}
                isInvalid={extraData.InstagramHandle && !isValidInstagramHandle(extraData.InstagramHandle)}
                onChange={(e) => onDataChanged({name: 'InstagramHandle', value: e.target.value})}
                value={extraData.InstagramHandle || ''}
              />
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button
          size="sm"
          variant="primary"
          disabled={!isDataValid()}
          onClick={() => {
            onAddExtra();
            onHide?.();
            onSubmit?.();
          }}
        >Add Extra</Button>
      </Modal.Footer>
    </Modal>
  );

}