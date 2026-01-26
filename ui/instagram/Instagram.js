import {InstagramEmbed} from "react-social-media-embed";
import InstagramConfig from "./InstagramConfig";

/**
 * Embed an Instagram feed.
 *
 * @param extraData   {ExtraData}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Instagram({extraData}) {
  const cleanHandle = extraData.InstagramHandle.replaceAll(/[^a-zA-Z0-9-\-.]/g, '');
  return (<div className={'Instagram'}>
    <InstagramEmbed url={`https://www.instagram.com/${cleanHandle}`} width={'100%'}/>
    <InstagramConfig extraData={extraData}/>
  </div>);
}