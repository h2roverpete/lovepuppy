import Image from 'react-bootstrap/Image';
import {SiteContext} from "framework/ui/content/Site";
import {useContext} from "react";
import {PageContext} from "framework/ui/content/Page";


/**
 * @typedef LogoProps
 * @property {string} src   Logo source file.
 */
/**
 * Display a site logo.
 *
 * @param props {LogoProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Logo(props) {
  const {outlineData} = useContext(SiteContext);
  const {setPageId} = useContext(PageContext);

  return (
    <Image
      className='Logo'
      src={props.src}
      style={{cursor: 'pointer'}}
      onClick={() => {
        setPageId(outlineData?.[0].PageID)
      }}
    />
  )
}