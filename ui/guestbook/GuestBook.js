import {useEffect, useState, memo} from "react";
import GuestFields from "./GuestFields";
import GuestFeedbackFields from "./GuestFeedbackFields";

/**
 * @typedef GuestBookProps
 *
 * @property {Api} api                    API to guest book server.
 * @property {number} guestBookId         Guest book ID.
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

  // guest book configuration
  const [guestBookConfig, setGuestBookConfig] = useState(null);

  // user entered values
  const [guestData, setGuestData] = useState({});
  const [guestFeedbackData, setGuestFeedbackData] = useState({});

  // has form been submitted?
  const [submitted, setSubmitted] = useState(false);

  console.log(`Rendering guest book. guestData=${JSON.stringify(guestData)}, guestFeedback=${JSON.stringify(guestFeedbackData)}, submitted=${submitted}`);

  // load guest book configuration when initialized
  useEffect(() => {
    if (props.guestBookId) {
      props.api.getGuestBook(props.guestBookId).then(data => {
        setGuestBookConfig(data);
      }).catch(error => {
        console.error(`Error getting guest book: ${error}`);
      })
    }
  }, [props.guestBookId, props.api])

  useEffect(() => {
    if (props.guestId) {
      props.api.getGuest(props.guestId).then(data => {
        setGuestData(prevData => {
          return {
            ...prevData,
            ...data
          }
        });
      }).catch(error => {
        console.error(`Error getting guest data: ${error}`);
      })
    }
  }, [props.guestId, props.guestBookId, props.api])

  useEffect(() => {
    if (props.guestFeedbackId) {
      props.api.getGuestFeedback(props.guestFeedbackId).then(data => {
        setGuestFeedbackData(prevData => {
          return {
            ...prevData,
            ...data
          }
        });
      }).catch(error => {
        console.error(`Error getting feedback data: ${error}`);
      })
    }
  }, [props.guestFeedbackId, props.api])


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
    props.api.insertOrUpdateGuest(props.guestBookId, guestData).then(data => {
      console.debug(`Guest update result: ${JSON.stringify(data)}`);
      setSubmitted(true)
      props.onChange?.({name: 'guestId', value: data.GuestID});
      props.api.insertOrUpdateGuestFeedback(data.GuestID, guestFeedbackData).then(data => {
        console.debug(`Guest feedback update result: ${JSON.stringify(data)}`);
      })
    })
  }

  return (
    <> {guestBookConfig && (
      <div className="guestbook">
        {submitted ? (
          <>
            <p>{guestBookConfig.DoneMessage}</p>
            <button
              className="btn btn-primary"
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
            <p>{guestBookConfig.GuestBookMessage}</p>
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
                       className="btn btn-primary"/>
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
