import LodgingFields from "./LodgingFields";
import CustomFields from "./CustomFields";
import {Col, FormControl, FormLabel, Row} from "react-bootstrap";

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
      feedbackData={guestFeedbackData}
      onChange={onChange}
    />
    {guestBookConfig.ShowFeedback && (
      <Row>
        <Col>
          <FormLabel
            htmlFor="FeedbackText"
            column={'lg'}
          >
            {guestBookConfig.TextCaption ? guestBookConfig.TextCaption : 'Questions or Comments'}
          </FormLabel>
          <FormControl
            as="textarea"
            name="FeedbackText"
            id="FeedbackText"
            rows={5}
            value={guestFeedbackData.FeedbackText}
            onChange={e => {
              onChange({
                name: 'FeedbackText',
                value: e.target.value
              })
            }}
          />
        </Col>
      </Row>
    )}
  < />)
}

export default GuestFeedbackFields;