import {useContext} from "react";
import {SiteContext} from "./Site";

/**
 * @typedef CopyrightProps
 *
 * @property {string} [startYear]   Starting year for copyright.
 * @property {string} [siteName]    Overrise site name in content configuration.
 */

/**
 * Insert a copyright element.
 *
 * Style: A <div> element with class name "Copyright"
 *
 * @param props{CopyrightProps}
 * @returns {JSX.Element}
 * @constructor
 */
function Copyright(props) {

  const {siteData} = useContext(SiteContext);

  return (
    <div className="Copyright">
      &copy;{props.startYear ? `${props.startYear}-` : ''}{new Date().getFullYear()} {props.siteName ? props.siteName : siteData?.SiteName}.<br/>All
      rights
      reserved.
    </div>
  )
}

export default Copyright;