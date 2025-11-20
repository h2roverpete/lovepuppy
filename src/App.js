import './App.css';
import Head from './framework/ui/content/Head'
import Copyright from './framework/ui/content/Copyright'
import RestAPI from './framework/api/api';
import Site, {SiteContext} from "./framework/ui/content/Site";
import Page from "./framework/ui/content/Page";
import PageContent from "framework/ui/content/PageContent";
import NavBar from "framework/ui/content/NavBar";
import {useContext} from "react";
import Breadcrumbs from "framework/ui/content/Breadcrumbs";
import PageTitle from "framework/ui/content/PageTitle";
import PageSections from "framework/ui/content/PageSections";
import GuestBook from "framework/ui/guestbook/GuestBook";
import Logo from "./Logo";
import logo from "./assets/logo-sm.png"
import Gallery from "framework/ui/gallery/Gallery";

/**
 * Display navigation bar.
 *
 * @param db{[RestAPI]}              Content Database.
 * @param pageId{Number}        Current navigation page.
 * @param setPageId{Function}   Callback for changing page ID.
 * @returns {JSX.Element}
 * @constructor
 */

/**
 * Main component
 *
 * @returns {
 JSX.Element
 }
 * @constructor
 */
export default function App() {

  const restApi = new RestAPI(
    234,
    "https://dev.h2rover.net",
    "blahblahblah123"
  );

  const {siteOutline} = useContext(SiteContext);
  console.debug(`Outline: ${JSON.stringify(siteOutline)}`);

  return (
    <Site restApi={restApi} googleId={'G-98C7J7C3VD'}>
      <Page>
        <Head/>
        <div className="NavBarWrapper">
          <Logo />
            <NavBar
              expand={'sm'}
              theme={'dark'}
              icon={logo}
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
    </Site>
  );
}