import {useContext} from "react";
import {SiteContext} from "./Site";
import {PageContext} from "./Page";
import Navbar from 'react-bootstrap/Navbar';
import {Container, Nav, NavDropdown} from "react-bootstrap";

/**
 * @typedef NavBarProps
 *
 * @property {String} [brand]   Explicit brrand, otherwise the Site name will be used.
 * @property {Image} [icon]     Logo icon for branding.
 */
/**
 * Full-blown Boostrap navbar for hierarchical navigation.
 *
 * @param props{NavBarProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function NavBar(props) {

  const {siteData, outlineData, getChildren} = useContext(SiteContext);
  const {setPageId, pageData} = useContext(PageContext);

  function RecursiveDropdown(props) {
    const children = getChildren(props.pageData.PageID);
    return (
      <>{children.length === 0 ? (
        <NavDropdown.Item
          id="basic-nav-dropdown"
          onClick={() => {
            setPageId(props.pageData.PageID)
          }}
        >
          {props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
        </NavDropdown.Item>
      ) : (
        <NavDropdown
          title={props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle}
          id="basic-nav-dropdown"
        >
          <>{children.map((item) => (
            <>{item.HasChildren ? (
              <RecursiveDropdown pageData={item}/>
            ) : (
              <NavDropdown.Item
                className={`${pageData?.PageID === item.PageID ? ' active' : ''}`}
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

  const children = getChildren?.(0);
  return (
    <Navbar
      expand={props.expand ? props.expand : 'sm'}
      className={`NavBar ${!props.expand ? 'navbar-expand' : ''}`}
      data-bs-theme={props.theme ? props.theme : "light"}
      fixed={props.fixed ? props.fixed : undefined}
    >
      <div className="NavBarContents container-fluid">

        <>{(props.brand || props.icon) && (
          <Navbar.Brand
            href={'#'}
            onClick={() => {
              setPageId(outlineData?.[0].PageID)
            }}
            className={`NavBarBrand ${props.brandClassName}`}
          >
            <>{props.icon && (
              <img
                className="NavBarBrandIcon"
                src={props.icon}
                alt={typeof props.brand === 'string' ? props.brand : siteData?.SiteName}
                height={45}
                style={{marginRight: '10px'}}
              />
            )}</>
            <>{props.icon && (
              <span className={'NavBarBrandText'}>
                    {typeof props.brand === 'string' ? props.brand : siteData?.SiteName}
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
                  className={`NavItem${pageData?.PageID === item.PageID ? ' active' : ''}`}
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
