import Page from "framework/ui/content/Page";
import Head from "framework/ui/content/Head";
import NavBar from "framework/ui/content/NavBar";
import PageContent from "framework/ui/content/PageContent";
import Breadcrumbs from "framework/ui/content/Breadcrumbs";
import PageTitle from "framework/ui/content/PageTitle";
import PageSections from "framework/ui/content/PageSections";
import Copyright from "framework/ui/content/Copyright";
import logo from "./assets/logo.png";
import logo_sm from "./assets/logo-sm.png";
import Logo from "framework/ui/content/Logo";
import './css/GuestBook.css'
import PageNavigation from "framework/ui/content/PageNavigation";

/**
 * @typedef MyPageProps
 *
 * @property {number} [pageId]  Specific page ID to display.
 */

/**
 * Component for site-specific page contents.
 *
 * @param props {MyPageProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function MyPage(props) {
  return (
    <Page {...props}>
      <Head/>
      <div className="NavBarWrapper">
        <Logo src={logo} className="d-none d-md-flex"/>
        <NavBar
          expand={'md'}
          theme={'dark'}
          icon={logo_sm}
          brandClassName="d-flex d-md-none"
        />
      </div>
      <Breadcrumbs/>
      <PageContent>
        <PageTitle/>
        <PageSections/>
      </PageContent>
      <PageNavigation/>
      <Copyright startYear={'2010'}/>
      <div className={'BottomBanner'}/>
    </Page>
  )
}