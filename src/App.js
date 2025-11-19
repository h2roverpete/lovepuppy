import './App.css';
import Head from './framework/ui/content/Head'
import Copyright from './framework/ui/content/Copyright'
import RestAPI from './framework/api/api';
import Site, {SiteContext} from "./framework/ui/content/Site";
import Page from "./framework/ui/content/Page";
import PageContent from "framework/ui/content/PageContent";
import NavBar from "framework/ui/content/NavBar";
import {useContext} from "react";
import logo from "./assets/logo.png";
import Breadcrumbs from "framework/ui/content/Breadcrumbs";
import PageTitle from "framework/ui/content/PageTitle";
import PageSections from "framework/ui/content/PageSections";

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
    1,
    "https://dev.h2rover.net",
    "blahblahblah123"
  );

  const {siteOutline} = useContext(SiteContext);
  console.debug(`Outline: ${JSON.stringify(siteOutline)}`);

  return (
    <Site restApi={restApi} googleId={''}>
      <Page>
        <Head/>
        <NavBar icon={logo} expand={'sm'}/>
        <PageContent>
          <Breadcrumbs/>
          <PageTitle/>
          <PageSections/>
          {/*<GuestBook guestBookId={0} pageId={0}/>*/}
        </PageContent>
        <Copyright startYear={'startYear'}/>
      </Page>
    </Site>
  );
}