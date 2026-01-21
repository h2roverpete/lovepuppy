import LodgingFields from "./LodgingFields";
import CustomFields from "./CustomFields";
import {Col, Form, Row} from "react-bootstrap";

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
      <Row className={'mt-2'}>
        <Col>
          <Form.Label
            htmlFor="FeedbackText"
            column={true}
          >
            {guestBookConfig.TextCaption ? guestBookConfig.TextCaption : 'Questions or Comments'}
          </Form.Label>
          <Form.Control
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