import Image from 'react-bootstrap/Image';
import logo from './assets/logo.png'

export default function Logo(props) {
  return (
    <Image className='Logo d-none d-sm-flex' src={logo}/>
  )
}