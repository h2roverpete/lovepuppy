import LodgingFields from "./LodgingFields";
import CustomFields from "./CustomFields";

/**
 * Fields for entering guest feedback.
 *
 * @param guestBookConfig {GuestBookConfig}
 * @param guestFeedbackData {GuestFeedbackData}
 * @param onChange {DataCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function GuestFeedbackFields({guestBookConfig, guestFeedbackData, onChange}) {
    return (<>
        {guestBookConfig.ShowLodgingFields && (
            <LodgingFields lodgingData={guestFeedbackData} onChange={onChange}/>
        )}
        <CustomFields
            guestBookConfig={guestBookConfig}
            feedbackData={guestFeedbackData}
            onChange={onChange}
        />
        {guestBookConfig.ShowFeedback && (
            <div className="form-group mt-4">
                <label
                    className="col-form-label"
                    htmlFor="feedbacktext"
                >
                    {guestBookConfig.TextCaption ? guestBookConfig.TextCaption : 'Questions or Comments'}
                </label>
                <textarea
                    className="form-control"
                    name="feedbacktext"
                    id="feedbacktext"
                    rows="5"
                    value={guestFeedbackData.FeedbackText}
                    onChange={e => {
                        onChange({
                            name: 'FeedbackText',
                            value: e.target.value
                        })
                    }}
                />
            </div>
        )}
    < />)
}

export default GuestFeedbackFields;