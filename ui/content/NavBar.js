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
    return (
      <NavDropdown title={props.pageData.NavTitle ? props.pageData.NavTitle : props.pageData.PageTitle} id="basic-nav-dropdown">
        <>{getChildren(props.pageData.PageID).map((item) => (
          <>{item.HasChildren ? (
            <RecursiveDropdown pageData={item}/>
          ) : (
            <NavDropdown.Item
              key={item.PageID}
              onClick={() => setPageId(item.PageID)}
            >
              {item.NavTitle ? item.NavTitle : item.PageTitle}
            </NavDropdown.Item>
          )}</>
        ))}</>
      </NavDropdown>
    );
  }

  const children = getChildren?.(0);
  console.debug(`Navbar found ${children.length} items.`);
  return (
    <>
      {outlineData && (
        <Navbar
          expand={props.expand ? props.expand : 'md'}
          className="NavBar"
          data-bs-theme={props.theme ? props.theme : "light"}
          fixed={props.fixed ? props.fixed : undefined}
        >
          <Container className="NavBarContents">
            <Navbar.Brand href={'#'} onClick={() => {
              setPageId(outlineData?.[0].PageID)
            }}>
              <>{props.icon && (
                <img
                  src={props.icon}
                  alt={props.brand ? props.brand : siteData?.SiteName}
                  height={45}
                  style={{marginRight: '10px'}}
                />
              )}</>
              <span className={'NavBarBrand'}>
                  {props.brand ? props.brand : siteData?.SiteName}
              </span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="MainNavigation">
              <Nav className="me-auto">
                {getChildren(0).map((item) => (
                  <>{item.HasChildren ? (
                    <RecursiveDropdown pageData={item}/>
                  ) : (
                    <Nav.Link
                      key={item.PageID}
                      onClick={() => setPageId(item.PageID)}
                    >
                      {item.NavTitle ? item.NavTitle : item.PageTitle}
                    </Nav.Link>
                  )}</>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  )
}
