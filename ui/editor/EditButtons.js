import {Button} from "react-bootstrap";
import {BsCheck, BsPencil, BsX} from "react-icons/bs";

/**
 * @typedef EditButtonProps
 * @property {boolean} editable
 * @property {boolean} editing
 * @property {callback} callback
 * @property {string} align
 * @property {boolean} showEditButton
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
        <div style={{whiteSpace: "nowrap", position: 'absolute', top: '2px', right: '2px'}}>
          <Button
            onClick={() => props.callback(EditAction.CONFIRM)}
            type="button"
            style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
            className={`btn btn-sm border text-primary btn-light ${!props.editing ? ' d-none' : ''}`}
          ><BsCheck/></Button>
          <Button
            onClick={() => props.callback(EditAction.CANCEL)}
            type="button"
            style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
            className={`btn btn-sm border btn-light ${!props.editing ? ' d-none' : ''}`}
          ><BsX/></Button>
          {props.showEditButton && !props.editing && (
            <Button
              onClick={() => props.callback(EditAction.EDIT)}
              type="button"
              style={{border: 'none', boxShadow: 'none', margin: '2px', padding: '2px 5px'}}
              className={`btn btn-sm border btn-light`}
            ><BsPencil/></Button>
          )}
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