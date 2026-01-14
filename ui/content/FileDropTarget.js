import {Spinner} from "react-bootstrap";
import './FileDropTarget.css';

/**
 * Insert a div as a file drop target.
 *
 * @param ref
 * @param state
 * @returns {JSX.Element}
 * @constructor
 */
export function FileDropTarget({ref, state}) {

  function renderContent() {
    switch (state) {
      case DropState.INSERT:
        return (<span>Drop file to insert image.</span>);
      case DropState.REPLACE:
        return (<span>Drop file to replace image.</span>);
      case DropState.UPLOADING:
        return (
          <span>Uploading...<br/>
          <Spinner animation="border" role="status"/>
            </span>
        );
      case DropState.UNDEFINED:
      default:
        return (<></>);
    }
  }

  return (
    <div
      className="DropFile"
      ref={ref}
      hidden={true}
      style={{pointerEvents: 'none'}}
    >
      {renderContent()}
    </div>
  )
}

export class DropState {
  static INSERT = 'upload';
  static REPLACE = 'replace';
  static UPLOADING = 'uploading';
  static UNDEFINED = '';
}

export default FileDropTarget;