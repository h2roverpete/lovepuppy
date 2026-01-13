import {useEffect, useState, memo, useContext} from "react";
import GuestFields from "./GuestFields";
import GuestFeedbackFields from "./GuestFeedbackFields";
import {PageContext} from "../content/Page";
import '../forms/Forms.css'
import {useRestApi} from "../../api/RestApi";

/**
 * @typedef GuestBookProps
 *
 * @property {number} guestBookId         Guest book ID.
 * @property {number} pageId              Page ID to display the guest book on.
 * @property {number} guestId             Guest ID to populate fields with.
 * @property {number} guestFeedbackId     Guest Feedback ID to populate fields with.
 * @property {DataCallback} [onChange]    Receives notification that guest ID or guest feedback ID was updated
 */

/**
 * Guest Book component
 * @param props {GuestBookProps}
 * @returns {JSX.Element}
 * @constructor
 */
function GuestBook(props) {

  const {pageData} = useContext(PageContext);
  const {getGuestBook, getGuest, getGuestFeedback, insertOrUpdateGuest, insertOrUpdateGuestFeedback} = useRestApi();

  // guest book configuration
  const [guestBookConfig, setGuestBookConfig] = useState(null);

  // user entered values
  const [guestData, setGuestData] = useState({});
  const [guestFeedbackData, setGuestFeedbackData] = useState({});

  // has form been submitted?
  const [submitted, setSubmitted] = useState(false);

  // load guest book configuration when initialized
  useEffect(() => {
    if (props.guestBookId) {
      getGuestBook(props.guestBookId).then(data => {
        setGuestBookConfig(data);
      }).catch(error => {
        console.error(`Error loading guest book: ${error}`);
      });
    }
  }, [props.guestBookId, getGuestBook]);

  useEffect(() => {
    if (props.guestId) {
      getGuest(props.guestId).then(data => {
        setGuestData(prevData => {
          return {
            ...prevData,
            ...data
          }
        });
      }).catch(error => {
        console.error(`Error getting guest data: ${error}`);
      });
    }
  }, [props.guestId, props.guestBookId, getGuest])

  useEffect(() => {
    if (props.guestFeedbackId) {
      getGuestFeedback(props.guestFeedbackId).then(data => {
        setGuestFeedbackData(prevData => {
          return {
            ...prevData,
            ...data
          }
        });
      }).catch(error => {
        console.error(`Error getting feedback data: ${error}`);
      });
    }
  }, [props.guestFeedbackId, getGuestFeedback])

  /**
   * Handle changes in response to data entry.
   *
   * @param name String
   * @param value String
   */
  function handleGuestChange({name, value}) {
    setGuestData((prevValue) => {
      const newValue = {
        ...prevValue,
        [name]: value
      }
      if (typeof value === 'string' && value.trim().length === 0) {
        // remove empty string properties
        delete newValue[name];
      }
      console.log(`Guest data updated: ${JSON.stringify(newValue)}`);
      return newValue;
    });
  }

  /**
   * Handle changes in response to data entry.
   *
   * @param name String
   * @param value String
   */
  function handleFeedbackChange({name, value}) {
    setGuestFeedbackData((prevValue) => {
      const newValue = {
        ...prevValue,
        [name]: value
      }
      if (typeof value === 'string' && value.trim().length === 0) {
        // remove empty string properties
        delete newValue[name];
      }
      console.log(`Feedback data updated: ${JSON.stringify(newValue)}`);
      return newValue;
    });
  }

  /**
   * Handle form submit.
   * @param e
   */
  function handleSubmit(e) {
    e.preventDefault();
    console.debug(`Updating guest. data=${JSON.stringify(guestData)}`);
    insertOrUpdateGuest(props.guestBookId, guestData).then(data => {
      console.debug(`Guest update result: ${JSON.stringify(data)}`);
      setSubmitted(true)
      props.onChange?.({name: 'guestId', value: data.GuestID});
      insertOrUpdateGuestFeedback(data.GuestID, guestFeedbackData).then(data => {
        console.debug(`Guest feedback update result: ${JSON.stringify(data)}`);
      })
    })
  }

  return (
    <> {props.pageId === pageData?.PageID && guestBookConfig && (
      <div className="guestbook">
        {submitted ? (
          <>
            <p dangerouslySetInnerHTML={{__html: guestBookConfig.DoneMessage}}/>
            <button
              className="btn btn-lg btn-primary"
              onClick={() => {
                // clear submit flag and feedback ID to submit again
                setSubmitted(false);
                props.onChange?.({guestFeedbackId: 0});
              }}>
              {guestBookConfig.AgainMessage}
            </button>
          </>
        ) : (
          <>
            <p dangerouslySetInnerHTML={{__html: guestBookConfig.GuestBookMessage}}/>
            <form
              encType="multipart/form-data"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="needs-validation"
              id="GuestBookForm"
            >
              <GuestFields
                guestBookConfig={guestBookConfig}
                guestData={guestData}
                onChange={handleGuestChange}
              />
              <GuestFeedbackFields
                guestBookConfig={guestBookConfig}
                guestFeedbackData={guestFeedbackData}
                onChange={handleFeedbackChange}
              />
              <div className="form-errors" id="FormErrors"></div>
              <div className="form-group mt-4">
                <input type="submit" value={guestBookConfig.SubmitButtonName}
                       className="btn btn-lg btn-primary"/>
              </div>
            </form>
          </>
        )}
      </div>
    )} </>
  )
}

// memorize guest book state between content changes
export default memo(GuestBook);
