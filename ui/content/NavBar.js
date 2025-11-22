import {useContext} from "react";
import {SiteContext} from "./Site";
import {PageContext} from "./Page";
import Navbar from 'react-bootstrap/Navbar';
import {Nav, NavDropdown} from "react-bootstrap";

/**
 * @typedef NavBarProps
 *
 * @property {String} [brand]           Explicit brand, otherwise the Site name will be used.
 * @property {String} [brandClassName]  CSS class to apply to brand/logo component
 * @property {string} [icon]            Logo icon for branding. When provided, default brand text is blank.
 * @property {string} [expand]          Bootstrap width boundary to expand/collapse the nav bar, use empty string to prevent collapsing.
 * @property {string} [fixed]           Fix the navbar to a viewport location, i.e. 'top', 'bottom'
 */

/**
 * Boostrap navbar for site navigation.
 *
 * @param props{NavBarProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function NavBar({brand, brandClassName, icon, expand, theme, fixed}) {

  const {siteData, outlineData, getChildren} = useContext(SiteContext);
  const {setPageId, pageData, breadcrumbs} = useContext(PageContext);

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
        <NavDropdown.Item
          className={`text-nowrap${isInCurrentPath(props.pageData.PageID) ? ' active' : ''}`}
          onClick={() => {
            setPageId(props.pageData.PageID)
          }}
        >
          {props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
        </NavDropdown.Item>
      ) : (
        <NavDropdown
          title={props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
          id={`nav-dropdown${isInCurrentPath(props.pageData.PageID) ? '-active' : ''}`}
        >
          <>{children.map((item) => (
            <>{item.HasChildren ? (
              <RecursiveDropdown pageData={item}/>
            ) : (
              <NavDropdown.Item
                className={`text-nowrap${pageData?.PageID === item.PageID ? ' active' : ''}`}
                key={item.PageID}
                onClick={() => setPageId(item.PageID)}
              >
                {item.NavTitle ? item.NavTitle : item.PageTitle}
              </NavDropdown.Item>
            )}</>
          ))}</>
        </NavDropdown>
      )}</>
    );
  }

  return (
    <Navbar
      expand={expand ? expand : 'sm'}
      className={`NavBar ${!expand ? 'navbar-expand' : ''}`}
      data-bs-theme={theme ? theme : "light"}
      fixed={fixed ? fixed : undefined}
    >
      <div className="NavBarContents container-fluid">

        <>{(brand || icon) && (
          <Navbar.Brand
            href={'#'}
            onClick={() => {
              setPageId(outlineData?.[0].PageID)
            }}
            className={`NavBarBrand ${brandClassName}`}
          >
            <>{icon && (
              <img
                className="NavBarBrandIcon"
                src={icon}
                alt={typeof brand === 'string' ? brand : siteData?.SiteName}
                height={45}
                style={{marginRight: '10px'}}
              />
            )}</>
            <>{icon && (
              <span className={'NavBarBrandText text-nowrap'}>
                    {typeof brand === 'string' ? brand : siteData?.SiteName}
                  </span>
            )}</>
          </Navbar.Brand>
        )}</>

        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="MainNavigation">
          <Nav>
            {getChildren(0).map((item) => (
              <>{item.HasChildren ? (
                <RecursiveDropdown pageData={item}/>
              ) : (
                <Nav.Link
                  className={`NavItem text-nowrap${isInCurrentPath(item.PageID) ? ' active' : ''}`}
                  key={item.PageID}
                  onClick={() => setPageId(item.PageID)}
                >
                  {item.NavTitle ? item.NavTitle : item.PageTitle}
                </Nav.Link>
              )}</>
            ))}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}
