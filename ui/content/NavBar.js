import {useRef, useState} from "react";
import {useSiteContext} from "./Site";
import {usePageContext} from "./Page";
import Navbar from 'react-bootstrap/Navbar';
import {Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router";
import {useAuth} from "../../auth/AuthProvider";
import {useEdit} from "../editor/EditProvider";
import {BsPlus} from "react-icons/bs";
import {useRestApi} from "../../api/RestApi";

/**
 * @typedef NavBarProps
 *
 * @property {String} [brand]           Explicit brand name.
 * @property {String} [brandClassName]  CSS class to apply to brand/logo component
 * @property {string} [icon]            Logo icon for branding. When provided, default brand text is blank.
 * @property {string} [expand]          Bootstrap width boundary to expand/collapse the nav bar, use empty string to prevent collapsing.
 * @property {string} [fixed]           Fix the navbar to a viewport location, i.e. 'top', 'bottom'
 * @property {boolean} [showLogin]      Show a top level element for logging in?
 */

/**
 * Boostrap navbar for site navigation.
 *
 * @param props{NavBarProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function NavBar(props) {

  const {siteData, getChildren, outline} = useSiteContext();
  const {pageData, breadcrumbs} = usePageContext();
  const navigate = useNavigate();
  const togglerRef = useRef(null);
  const {token} = useAuth();
  const {canEdit} = useEdit();
  const {insertOrUpdatePage, movePageAfter, movePageBefore, makePageChildOf} = useRestApi();

  const [showNewPage, setShowNewPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState(null);
  const [newPageRoute, setNewPageRoute] = useState(null);

  function navigateTo(to) {
    if ((togglerRef.current.style.visible || togglerRef.current.style.display !== 'none') && !togglerRef.current.classList.contains("collapsed")) {
      // toggle is active, collapse menu on navigation
      togglerRef.current.click();
    }
    // react-router navigation
    navigate(to);
  }

  function isInCurrentPath(pageId) {
    if (!pageData || !breadcrumbs) {
      return false
    } else if (pageId === pageData.PageID) {
      return true;
    } else {
      for (const page of breadcrumbs) {
        if (page.PageID === pageId) {
          return true;
        }
      }
      return false;
    }
  }

  function RecursiveDropdown(props) {
    const children = getChildren(props.pageData.PageID);
    return (
      <>{children.length === 0 ? (
        // no children to render
        <NavDropdown.Item
          draggable={canEdit}
          onDragStart={(e) => dragStartHandler(e, props.pageData)}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropHandler(e, props.pageData, 'vertical')}
          key={props.pageData.PageID}
          onClick={() => navigateTo(props.pageData.PageRoute)}
          className={`text-nowrap${isInCurrentPath(props.pageData.PageID) ? ' active' : ''}`}
          data-testid={`NavItem-${props.pageData.PageID}`}
        >
          {props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
        </NavDropdown.Item>
      ) : (
        // at least one child, render a dropdown
        <NavDropdown
          draggable={canEdit}
          onDragStart={(e) => dragStartHandler(e, props.pageData)}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropHandler(e, props.pageData, 'horizontal')}
          key={props.pageData.PageID}
          title={props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
          id={`nav-dropdown${isInCurrentPath(props.pageData.PageID) ? '-active' : ''}`}
          data-testid={`NavItem-${props.pageData.PageID}`}
        >
          <>{children.map((item) => (
            <>{getChildren(item.PageID).length > 0 ? (
              // render further dropdown levels
              <RecursiveDropdown pageData={item}/>
            ) : (
              // render this dropdown level
              <NavDropdown.Item
                draggable={canEdit}
                onDragStart={(e) => dragStartHandler(e, item)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, item, 'vertical')}
                className={`text-nowrap${pageData?.PageID === item.PageID ? ' active' : ''}`}
                key={item.PageID}
                onClick={() => navigateTo(item.PageRoute)}
                data-testid={`NavItem-${item.PageID}`}
              >
                {item.NavTitle ? item.NavTitle : item.PageTitle}
              </NavDropdown.Item>
            )}</>
          ))}</>
        </NavDropdown>
      )}</>
    );
  }

  function isValidTitle(title) {
    return title && title.match[/[a-zA-Z]/] !== null;
  }

  function isValidRoute(route) {
    return route && route.match(/^\/[a-z0-9]+$/) !== null;
  }

  const newTitleRef = useRef(null);
  const newRouteRef = useRef(null);
  const newPageHiddenRef = useRef(null);

  function insertNewPage() {
    const data = {
      SiteID: siteData.SiteID,
      ParentID: 0,
      PageTitle: newPageTitle,
      PageRoute: newPageRoute,
      PageHidden: newPageHiddenRef.current.checked
    }
    console.debug(`Insert new page...`);
    insertOrUpdatePage(data)
      .then((result) => {
        console.debug(`Page inserted.`);
        outline.addPage(result);
        navigate(result.PageRoute)
      })
      .catch((e) => {
        console.error(`Error inserting new page.`, e);
      });
  }

  function dragStartHandler(e, data) {
    if (canEdit) {
      console.debug(`Drag start. data = ${JSON.stringify(data)}`);
      if (!e.dataTransfer.getData('application/json')) {
        e.dataTransfer.setData('application/json', JSON.stringify(data));
        e.stopPropagation()
      }
    }
  }

  function dragOverHandler(e) {
    e.preventDefault();
  }

  /**
   * Process a drop event to reorder navigation.
   *
   * @param e                   Drag Event
   * @param dropData {PageData} Data about the page being dropped on.
   * @param direction {String}  Direction of elements: 'vertical' or 'horizontal'
   */
  function dropHandler(e, dropData, direction) {
    if (canEdit) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const width = e.nativeEvent.target.offsetWidth;
      const height = e.nativeEvent.target.offsetHeight;
      const percent = direction === 'vertical' ? y / height : x / width;
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (percent < 0.33) {
        console.debug(`Move page '${dragData.PageTitle}' before page '${dropData.PageTitle}'`);
        // move outline first for UI responsiveness
        outline.movePageBefore(dragData, dropData);
        movePageBefore(dragData.PageID, dropData.PageID)
          .then((result) => {
            console.debug(`Page moved.`);
          })
          .catch((err) => {
            console.error(`Error moving page.`, err);
          });
      } else if (percent < 0.66) {
        console.debug(`Make page '${dragData.PageTitle}' child of page '${dropData.PageTitle}'`);
        // move outline first for UI responsiveness
        outline.makeChildOf(dragData, dropData);
        makePageChildOf(dragData.PageID, dropData.PageID)
          .then((result) => {
            console.debug(`Page moved.`);
          })
          .catch((err) => {
            console.error(`Error moving page.`, err);
          });
      } else {
        console.debug(`Move page '${dragData.PageTitle}' after page '${dropData.PageTitle}'`);
        // move outline first for UI responsiveness
        outline.movePageAfter(dragData, dropData);
        movePageAfter(dragData.PageID, dropData.PageID)
          .then(() => {
            console.debug(`Page moved.`);
          })
          .catch((err) => {
            console.error(`Error moving page.`, err);
          });
      }
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <Navbar
      expand={props.expand ? props.expand : 'sm'}
      className={`NavBar ${!props.expand ? 'navbar-expand' : ''}`}
      data-bs-theme={props.theme ? props.theme : "light"}
      fixed={props.fixed ? props.fixed : undefined}
      data-testid="NavBar"
    >
      <div
        className="NavBarContents
        container-fluid"
        data-testid="NavBarContents"
      >
        <>{(props.brand || props.icon) && (
          <Navbar.Brand
            style={{cursor: 'pointer'}}
            className={`NavBarBrand ${props.brandClassName}`}
            data-testid="NavBarBrand"
          >
            <>{props.icon && (
              <img
                className="NavBarBrandIcon"
                src={props.icon}
                alt={props.brand?.length ? props.brand : siteData?.SiteName}
                height={45}
                style={{marginRight: '10px'}}
                onClick={() => {
                  navigateTo('/')
                }}
                data-testid="NavBarBrandIcon"
              />
            )}</>
            <>{props.brand?.length > 0 && (
              <span
                className={'NavBarBrandText text-nowrap'}
                onClick={() => {
                  navigateTo('/')
                }}
                data-testid="NavBarBrandText"
              >
                {props.brand}
              </span>
            )}</>
          </Navbar.Brand>
        )}</>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          id="NavbarToggle"
          ref={togglerRef}
        />
        <Navbar.Collapse id="MainNavigation">
          <Nav>
            {getChildren(0).map((item) => (
              <div
                key={item.PageID}
              >
                {getChildren(item.PageID).length > 0 ? (
                  <RecursiveDropdown pageData={item}/>
                ) : (
                  <Nav.Link
                    draggable={canEdit}
                    onDragStart={(e) => dragStartHandler(e, item)}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropHandler(e, item, 'horizontal')}
                    onClick={() => navigateTo(item.PageRoute)}
                    className={`NavItem text-nowrap${isInCurrentPath(item.PageID) ? ' active' : ''}`}
                    key={item.PageID}
                    data-testid={`NavItem-${item.PageID}`}
                  >
                    {item.NavTitle ? item.NavTitle : item.PageTitle}
                  </Nav.Link>
                )}
              </div>
            ))}
            <>{props.showLogin === true && (
              <>{token ? (
                <Nav.Link
                  onClick={() => navigateTo('/logout')}
                  className={`NavItem text-nowrap`}
                  key={`Logout`}
                  data-testid={`NavItem-Logout`}
                >
                  Log Out
                </Nav.Link>
              ) : (
                <Nav.Link
                  onClick={() => navigateTo('/login')}
                  className={`NavItem text-nowrap`}
                  key={`Login`}
                  data-testid={`NavItem-Login`}
                >
                  Log In
                </Nav.Link>
              )}</>
            )}</>
          </Nav>
          {canEdit && (
            <>
              <Modal show={showNewPage} onHide={() => setShowNewPage(false)}>
                <ModalHeader><h5>New Page</h5></ModalHeader>
                <ModalBody>
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center text-start mb-2">
                      <label
                        htmlFor={'PageTitle'}
                        className='col-3 col-sm-2 text-nowrap'
                      >
                        Title
                      </label>
                      <input
                        ref={newTitleRef}
                        className={'form-control' + (newPageTitle?.length > 0 ? isValidTitle(newPageTitle) ? ' is-valid' : ' is-invalid' : '')}
                        id={'PageTitle'}
                        name={'PageTitle'}
                        value={newPageTitle}
                        required={true}
                        placeholder={'My Page'}
                        type="text"
                        style={{fontSize: '12pt'}}
                        onChange={(e) => {
                          setNewPageTitle(e.target.value)
                        }}
                      />
                    </div>

                    <div className="d-flex align-items-center text-start">
                      <label
                        htmlFor={'PageRoute'}
                        className='col-3 col-sm-2 text-nowrap'
                      >
                        Route
                      </label>
                      <input
                        ref={newRouteRef}
                        className={'form-control' + (newPageRoute?.length > 0 ? isValidRoute(newPageRoute) ? ' is-valid' : ' is-invalid' : '')}
                        id={'PageRoute'}
                        name={'PageRoute'}
                        placeholder={'/mypage'}
                        required={true}
                        type="text"
                        value={newPageRoute}
                        style={{fontSize: '12pt'}}
                        onChange={(e) => {
                          setNewPageRoute(e.target.value)
                        }}
                      />
                    </div>
                    <div className="d-flex align-items-center text-start">
                      <label className={'col-2'} htmlFor={'PageHidden'}></label>
                      <input
                        type="checkbox"
                        id={'PageHidden'}
                        ref={newPageHiddenRef}
                        className={'me-1'}
                      />
                      <label className={'col-form-label'} htmlFor={'PageHidden'}>Hide page from site navigation</label>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button
                    className={'btn btn-sm btn-primary'}
                    disabled={!(isValidRoute(newPageRoute) && isValidTitle(newPageTitle))}
                    onClick={() => {
                      insertNewPage();
                      setShowNewPage(false);
                    }}
                  >
                    Create New Page
                  </button>
                  <button className={'btn btn-sm btn-secondary'} onClick={() => setShowNewPage(false)}>Cancel
                  </button>
                </ModalFooter>
              </Modal>
              <button
                style={{border: 'none', boxShadow: 'none', margin: '0 0 0 10px', padding: '0 3px', zIndex: 200}}
                className={`btn btn-sm border btn-light`}
                type="button"
                aria-expanded="false"
                onClick={() => {
                  setNewPageTitle(null);
                  setNewPageRoute(null);
                  setShowNewPage(true);
                }}
              ><BsPlus/></button>
            </>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}
