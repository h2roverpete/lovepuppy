import {useEffect, useState} from "react";
import GuestFields from "./GuestFields";
import GuestFeedbackFields from "./GuestFeedbackFields";

/**
 * Guest Book component
 *
 * @param db{DB}
 * @param guestBookId{Number}
 * @param guestId{Number}
 * @param guestFeedbackId{Number}
 * @param [onChange]{DataCallback}    Receives notification that guest ID or guest feedback ID was updated
 * @returns {JSX.Element}
 * @constructor
 */
function GuestBook({db, guestBookId, guestId, guestFeedbackId, onChange}) {

  // guest book configuration
  const [guestBookConfig, setGuestBookConfig] = useState(null);

  // user entered values
  const [guestData, setGuestData] = useState({});
  const [guestFeedbackData, setGuestFeedbackData] = useState({});

  // has form been submitted?
  const [submitted, setSubmitted] = useState(false);

  // load guest book configuration when initialized
  useEffect(() => {
    if (guestBookId) {
      db.getGuestBook(guestBookId).then(data => {
        setGuestBookConfig(data);
      }).catch(error => {
        console.error(`Error getting guest book: ${error}`);
      })
    }
  }, [guestBookId, db])

  useEffect(() => {
    if (guestId) {
      db.getGuest(guestId).then(data => {
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
  }, [guestId, db])

  useEffect(() => {
    if (guestFeedbackId) {
      db.getGuestFeedback(guestFeedbackId).then(data => {
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
  }, [guestFeedbackId, db])


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
    db.insertOrUpdateGuest(guestBookId, guestData).then(data => {
      console.debug(`Guest update result: ${JSON.stringify(data)}`);
      setSubmitted(true)
      onChange?.({name: 'guestId', value: data.GuestID});
      db.insertOrUpdateGuestFeedback(data.GuestID, guestFeedbackData).then(data => {
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
                setSubmitted(false);
                onChange?.({guestFeedbackId: 0});
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

export default GuestBook;
