import './App.css';
import './GuestBook.css';

import RestAPI from 'framework/api/api.mjs';
import Site from "./framework/ui/content/Site";
import MyPage from "./MyPage";

/**
 * Main component inside the root element.
 * Import all the CSS styles and configure the site.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {

  const restApi = new RestAPI(
    parseInt(process.env.REACT_APP_SITE_ID),
    process.env.REACT_APP_BACKEND_HOST,
    process.env.REACT_APP_API_KEY
  );

  return (
    <Site
      restApi={restApi}
      googleId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      pageElement={MyPage}
    />
  );
}