import Image from 'react-bootstrap/Image';
import {useNavigate} from "react-router";

/**
 * @typedef LogoProps
 * @property {string} src   Logo source file.
 * @property {string} href  Link to
 */
/**
 * Display a site logo.
 *
 * @param props {LogoProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Logo(props) {
  const navigate = useNavigate();
  return (
    <Image
      className={`Logo ${props.className}`}
      style={{cursor: 'pointer'}}
      src={props.src}
      onClick={() => navigate(props.href ? props.href : '/')}
    />
  )
}