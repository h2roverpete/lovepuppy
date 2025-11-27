import Page from "framework/ui/content/Page";
import Head from "framework/ui/content/Head";
import NavBar from "framework/ui/content/NavBar";
import PageContent from "framework/ui/content/PageContent";
import Breadcrumbs from "framework/ui/content/Breadcrumbs";
import PageTitle from "framework/ui/content/PageTitle";
import PageSections from "framework/ui/content/PageSections";
import GuestBook from "framework/ui/guestbook/GuestBook";
import Copyright from "framework/ui/content/Copyright";
import logo from "./assets/logo.png";
import logo_sm from "./assets/logo-sm.png";
import Gallery from "framework/ui/gallery/Gallery";
import Logo from "framework/ui/content/Logo";

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
    <Page pageId={props.pageId}>
      <Head/>
      <div className="NavBarWrapper">
        <Logo src={logo} className="d-none d-sm-flex"/>
        <NavBar
          expand={'sm'}
          theme={'dark'}
          icon={logo_sm}
          brand={''}
          brandClassName="d-flex d-sm-none"
        />
      </div>
      <PageContent>
        <Breadcrumbs/>
        <PageTitle/>
        <PageSections/>
        <GuestBook guestBookId={220} pageId={8635}/>
        <GuestBook guestBookId={219} pageId={8622}/>
        <Gallery galleryId={1085} pageId={8598}/>
        <Copyright startYear={'2010'}/>
      </PageContent>
      <div className={'BottomBanner'}/>
    </Page>
  )
}