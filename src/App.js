import './css/Site.css';

import {BrowserRouter} from "react-router";
import Site from "framework/ui/content/Site";
import MyPage from "./MyPage";
import React from "react";

/**
 * App wraps the Site component in a React Router
 * and specifies the component the Site uses to render pages.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {
  return (
    <BrowserRouter>
      <Site pageElement={MyPage}/>
    </BrowserRouter>
  )
}
