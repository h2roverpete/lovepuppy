import {Button} from "react-bootstrap";
import {BsCheck, BsPencil, BsX} from "react-icons/bs";

/**
 * @typedef EditButtonProps
 * @property {boolean} editable
 * @property {boolean} editing
 * @property {callback} callback
 * @property {string} align
 */

/**
 * Display edit/confirm/cancel buttons when editable.
 *
 * @param {EditButtonProps} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditButtons(props) {
  return (
    <>
      {props.editable && (
        <div style={{whiteSpace: "nowrap", ...props.style}}>
          <Button
            onClick={() => props.callback(EditAction.EDIT)}
            type="radio"
            style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
            className={`btn btn-sm border border-secondary text-dark bg-white ${props.editing ? ' d-none' : ''}`}
          ><BsPencil/></Button>
          <Button
            onClick={() => props.callback(EditAction.CONFIRM)}
            type="button"
            style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
            className={`btn btn-sm border border-primary text-primary bg-white ${!props.editing ? ' d-none' : ''}`}
          ><BsCheck/></Button>
          <Button
            onClick={() => props.callback(EditAction.CANCEL)}
            type="button"
            style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
            className={`btn btn-sm border border-secondary text-dark bg-white ${!props.editing ? ' d-none' : ''}`}
          ><BsX/></Button>
        </div>
      )}
    </>
  );
}

/**
 * Site permissions.
 *
 * @enum {string}
 */
export const EditAction = {
  EDIT: "edit",
  CANCEL: "cancel",
  CONFIRM: "confirm",
}