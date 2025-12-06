import {Button} from "react-bootstrap";
import {BsPencil, BsX} from "react-icons/bs";


/**
 * @typedef EditButtonProps
 * @property {boolean} editable
 * @property {boolean} editing
 * @property {callback} onClick
 */

/**
 * Display an edit button at the top right corner of the parent.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditButton(props) {
  return (
    <>
      {props.editable && (
        <Button
          onClick={props.onClick}
          type="button"
          style={{border: 'none', boxShadow: 'none', position: 'absolute', top: '5px', right: '5px'}}
          className={'btn btn-sm btn-secondary'}
        >{props.editing ? (<BsX/>) : (<BsPencil/>)}</Button>
      )}
    </>
  )
}