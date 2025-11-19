/**
 * @typedef InstagramProps
 * @property {number} pageId
 * @property {string} url
 * @property {string} token
 */

import {useContext} from "react";
import {PageContext} from "../content/Page";
import {InstagramEmbed} from "react-social-media-embed";

/**
 *
 * @param props {InstagramProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Instagram(props) {
  const {pageData} = useContext(PageContext);
  return (
    <>{props.pageId === pageData?.PageID && (
        <InstagramEmbed url={props.url} width={'100%'}/>
    )}</>
  );
}