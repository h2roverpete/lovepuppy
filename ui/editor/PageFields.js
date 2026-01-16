import {useEdit} from "./EditProvider";
import {Button} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {usePageContext} from "../content/Page";
import {useRestApi} from "../../api/RestApi";
import {useSiteContext} from "../content/Site";
import {useNavigate} from "react-router";

/**
 * Edit page metadata fields.
 * @returns {JSX.Element}
 * @constructor
 */
export default function PageFields() {

  const {insertOrUpdatePage, insertOrUpdatePageSection, deletePage} = useRestApi();
  const {canEdit} = useEdit();
  const {pageData, setPageData, setSectionData} = usePageContext();
  const {outline} = useSiteContext()
  const [edits, setEdits] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (pageData) {
      setEdits({
        NavTitle: pageData.NavTitle ? pageData.NavTitle : "",
        PageMetaTitle: pageData.PageMetaTitle ? pageData.PageMetaTitle : "",
        PageMetaDescription: pageData.PageMetaDescription ? pageData.PageMetaDescription : "",
        PageMetaKeywords: pageData.PageMetaKeywords ? pageData.PageMetaKeywords : "",
        PageHidden: pageData.PageHidden,
        PageRoute: pageData.PageRoute,
      });
    }
  }, [pageData]);

  function onDataChanged({name, value}) {
    setEdits({
      ...edits,
      [name]: value
    })
    submitButton.current.classList.remove('disabled');
    revertButton.current.classList.remove('disabled');
  }

  function onSubmit() {
    const data = {
      ...pageData,
      ...edits,
    }
    console.debug(`Updating page: ${JSON.stringify(data)}`);
    insertOrUpdatePage(data).then(() => {
      console.debug(`Updated page.`);
      setEdits({})
      setPageData(data);
      outline.updatePage(data);
    }).catch((error) => {
      console.error(`Error updating page.`, error);
    });
    submitButton.current.classList.add('disabled');
    revertButton.current.classList.add('disabled');
    setCollapsed(true);
  }

  function onRevert() {
    setEdits({});
    setPageData();
    submitButton.current.classList.add('disabled');
    revertButton.current.classList.add('disabled');
  }

  function onAddSection() {
    if (pageData) {
      const data = {
        PageID: pageData.PageID
      }
      console.debug(`Adding page section...`);
      insertOrUpdatePageSection(data)
        .then(() => {
          setSectionData(null)
          setCollapsed(true);
        }).catch((error) => {
        console.error(`Error adding page section.`, error);
      })
    }
  }

  function onDeletePage() {
    console.debug(`Deleting page...`);
    deletePage(pageData.PageID)
      .then(() => {
        console.debug(`Deleted page.`);
        navigate('/');
        outline.deletePage(pageData.PageID);
        setCollapsed(true);
      })
      .catch(e => console.error(`Error deleting page.`, e));
  }

  const submitButton = useRef(null);
  const revertButton = useRef(null);

  return (
    <>{canEdit && (
      <div className="accordion" style={{width: "100%", position: "relative", minHeight: '20px'}}>
        <Button
          className="accordion-button collapsed bg-transparent border-0 shadow-none"
          data-bs-toggle="collapse"
          data-bs-target="#PageFields"
          style={{padding: '8px', position: 'absolute', top: -25, right: 0}}
          onClick={()=>setCollapsed(!collapsed)}
        />
        <div
          className={`accordion-collapse${collapsed?' collapse':''}`}
          id={"PageFields"}
          style={{background: '#00000011', marginBottom: '20px'}}
        >
          <div className="accordion-body">
            <div className={'row'}>
              <div className="form-group col-12 col-sm-6">
                <label
                  htmlFor={'NavTitle'}
                  className="form-control-sm pb-0"
                >
                  Navigation Title
                </label>
                <input
                  className={'form-control form-control-sm'}
                  id={'NavTitle'}
                  name={'NavTitle'}
                  value={edits?.NavTitle}
                  onChange={(e) => onDataChanged({name: 'NavTitle', value: e.target.value})}
                  type="text"
                  style={{fontSize: '10pt'}}
                />
              </div>

              <div className="form-group col-12 col-sm-6">
                <label
                  htmlFor={'PageRoute'}
                  className="form-control-sm pb-0"
                >
                  Page Route
                </label>
                <input
                  className={'form-control form-control-sm'}
                  id={'PageRoute'}
                  name={'PageRoute'}
                  value={edits?.PageRoute}
                  onChange={(e) => onDataChanged({name: 'PageRoute', value: e.target.value})}
                  type="text"
                  style={{fontSize: '10pt'}}
                />
              </div>

            </div>
            <div className="form-group col-12">
              <label
                htmlFor={'PageMetaTitle'}
                className="form-control-sm  pb-0"
              >
                Meta Title
              </label>
              <input
                className={'form-control form-control-sm'}
                id={'PageMetaTitle'}
                value={edits?.PageMetaTitle}
                onChange={(e) => onDataChanged({name: 'PageMetaTitle', value: e.target.value})}
                type="text"
                style={{fontSize: '10pt'}}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor={'PageMetaDescription'}
                className="form-control-sm pb-0"
              >
                Meta Description
              </label>
              <input
                className={'form-control form-control-sm'}
                id={'PageMetaDescription'}
                value={edits?.PageMetaDescription}
                onChange={(e) => onDataChanged({name: 'PageMetaDescription', value: e.target.value})}
                type="text"
                style={{fontSize: '10pt'}}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor={'PageMetaKeywords'}
                className="form-control-sm pb-0"
              >
                Meta Keywords
              </label>
              <input
                className={'form-control form-control-sm'}
                id={'PageMetaKeywords'}
                value={edits?.PageMetaKeywords}
                onChange={(e) => onDataChanged({name: 'PageMetaKeywords', value: e.target.value})}
                type="text"
                style={{fontSize: '10pt'}}
              />
            </div>
            <div className="form-group mt-2">
              <input
                type="checkbox"
                checked={edits?.PageHidden}
                id={'PageHidden'}
                onChange={(e) => onDataChanged({name: 'PageHidden', value: e.target.checked})}
              />
              <label className={'form-control-sm'} htmlFor={'PageHidden'}>Hide page from site navigation</label>
            </div>
            <div className={'row mt-2'}>
              <div className="form-group col-6">
                <button
                  className="btn btn-primary btn-sm me-2 disabled"
                  onClick={onSubmit}
                  ref={submitButton}
                >
                  Update
                </button>
                <button
                  className="btn btn-secondary btn-sm me-2 disabled"
                  onClick={onRevert}
                  ref={revertButton}
                >
                  Revert
                </button>
              </div>
              <div className="form-group col-6 text-end">
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={onAddSection}
                >
                  Add Section
                </button>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={onDeletePage}
                >
                  Delete Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}