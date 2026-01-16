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

  const {siteData, getChildren, addPageToOutline} = useSiteContext();
  const {pageData, breadcrumbs} = usePageContext();
  const navigate = useNavigate();
  const togglerRef = useRef(null);
  const {token} = useAuth();
  const {canEdit} = useEdit();
  const {insertOrUpdatePage} = useRestApi();

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
          key={props.pageData.PageID}
          title={props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
          id={`nav-dropdown${isInCurrentPath(props.pageData.PageID) ? '-active' : ''}`}
          data-testid={`NavItem-${props.pageData.PageID}`}
        >
          <>{children.map((item) => (
            <>{item.HasChildren ? (
              // render further dropdown levels
              <RecursiveDropdown pageData={item}/>
            ) : (
              // render this dropdown level
              <NavDropdown.Item
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
        addPageToOutline(result);
        navigate(result.PageRoute)
      })
      .catch((e) => {
        console.error(`Error inserting new page.`, e);
      });
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
                {item.HasChildren ? (
                  <RecursiveDropdown pageData={item}/>
                ) : (
                  <Nav.Link
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
                        className={'form-control' + (newPageTitle ? isValidTitle(newPageTitle) ? ' is-valid' : ' is-invalid' : '')}
                        id={'PageTitle'}
                        name={'PageTitle'}
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
                        className={'form-control' + (newPageRoute ? isValidRoute(newPageRoute) ? ' is-valid' : ' is-invalid' : '')}
                        id={'PageRoute'}
                        name={'PageRoute'}
                        placeholder={'/mypage'}
                        required={true}
                        type="text"
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
                style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px', zIndex: 200}}
                className={`btn btn-sm border border-light text-light`}
                type="button"
                aria-expanded="false"
                onClick={() => {
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
