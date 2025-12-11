import {useCallback, useEffect, useState} from "react";
import EditButtons, {EditAction} from "./EditButtons";
import {useEdit} from "./EditProvider";
import {Button, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import AlignButtons, {AlignAction} from "./AlignButtons";

/**
 * @typedef EditCallbackData
 * @property {string} textContent
 * @property {string} textAlign
 */

/**
 * @callback EditCallback
 * @param {EditCallbackData}
 */

/**
 * @typedef EditableFieldProps
 *
 * @property {JSX.Element} field          Field to enhance with edit controls.
 * @property {ref} fieldRef               Reference to the editable element in the field contents.
 * @property {EditCallback} callback      Called when edits need to be committed.
 * @property {string} textContent         Initial text content (used for canceling/reverting)
 * @property {string} textAlign           Initial text alignment (used for canceling/reverting)
 * @property {boolean} [allowEnterKey]   Allow enter key in data entry (instead of committing changes)
 */

/**
 * HOC adds the ability to edit the content and alignment of text elements
 *
 * @param props {EditableFieldProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditableField(props) {

  const {canEdit} = useEdit();
  const [editing, setEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const editCallback = useCallback((action) => {
    switch (action) {
      case EditAction.EDIT:
        startEditing(true);
        break;
      case EditAction.CONFIRM:
        commitEdits();
        break;
      case EditAction.CANCEL:
        cancelEditing();
        break;
      case AlignAction.ALIGN_LEFT:
        props.fieldRef.current.style.textAlign = 'left';
        break;
      case AlignAction.ALIGN_CENTER:
        props.fieldRef.current.style.textAlign = 'center';
        break;
      case AlignAction.ALIGN_RIGHT:
        props.fieldRef.current.style.textAlign = 'right';
        break;
    }
  }, []);

  useEffect(() => {
    if (editing) {
      // focus when editing
      props.fieldRef.current.focus();
    }
  }, [editing]);

  function onKeyDown(evt) {
    // end editing and update on enter
    if (evt.key === 'Enter' && !props.allowEnterKey) {
      evt.preventDefault();
      commitEdits();
    }
    if (evt.key === 'Escape') {
      evt.preventDefault();
      cancelEditing();
    }
    if (evt.key === 'Tab') {
      if (
        props.fieldRef.current.textContent !== props.textContent
        || props.fieldRef.current.style.textAlign !== props.textAlign
      ) {
        // tab out after content has changed
        evt.preventDefault();
        // confirm changes
        setShowConfirmation(true);
      } else {
        // no change to content, just cancel
        cancelEditing();
      }
    }
  }

  function startEditing() {
    // set editing flag
    setEditing(true);
    // transform text from display HTML to source
    props.fieldRef.current.textContent = props.fieldRef.current.innerHTML
  }

  function cancelEditing() {
    // revert title value and alignment
    props.fieldRef.current.innerHTML = props.textContent;
    props.fieldRef.current.style.textAlign = props.textAlign;
    // hide confirmation
    if (showConfirmation) {
      setShowConfirmation(false);
    }
    // clear editing flag
    setEditing(false);
  }

  function commitEdits() {
    console.debug(`Committing edits...`);
    props.callback({
      textContent: props.fieldRef.current.textContent,
      textAlign: props.fieldRef.current.style.textAlign,
    })
    // transform text from HTML source to display HTML
    props.fieldRef.current.innerHTML = props.fieldRef.current.textContent;
    setShowConfirmation(false);
    setEditing(false);
  }

  function onHideConfirmation() {
    // canceled by clicking outside
    cancelEditing();
  }

  // update field properties
  if (props.fieldRef.current) {
    props.fieldRef.current.style.paddingRight = `${editing ? '65px' : '0'}`
    props.fieldRef.current.contentEditable = editing;
    if (!editing) {
      // undo edit modifications to field
      props.fieldRef.current.classList.remove('border');
      props.fieldRef.current.classList.remove('border-secondary');
      props.fieldRef.current.classList.remove('rounded-2');
      props.fieldRef.current.onkeydown = undefined;
      if (!props.fieldRef.current.textContent) {
        props.fieldRef.current.style.minHeight = '39px';
      } else {
        delete props.fieldRef.current.style.minHeight;
      }
    } else {
      // show border around editable item while editing
      props.fieldRef.current.classList.add('border');
      props.fieldRef.current.classList.add('border-secondary');
      props.fieldRef.current.classList.add('rounded-2');
      props.fieldRef.current.onkeydown = (evt) => onKeyDown(evt);
      props.fieldRef.current.style.minHeight = '39px';
      props.fieldRef.current.style.verticalAlign = 'middle';
    }
  }

  return (
    <>
      <>{canEdit && (
        <Modal show={showConfirmation} onHide={onHideConfirmation}>
          <ModalBody>Do you want to save your changes?</ModalBody>
          <ModalFooter>
            <Button className={'btn-default'} onClick={() => commitEdits()}>Save</Button>
            <Button className={'btn-secondary'} onClick={() => cancelEditing()}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )}</>

      <div style={{position: 'relative'}}>
        {props.field}
        <AlignButtons
          callback={editCallback}
          editable={canEdit}
          editing={editing}
          align={props.fieldRef.current?.style.textAlign}
          style={{position: 'absolute', top: '-20px', left: '40%'}}
        />
        <EditButtons
          callback={editCallback}
          editable={canEdit}
          editing={editing}
          style={{position: 'absolute', right: '2px', top: '2px'}}
        />
      </div>
    </>
  )
}