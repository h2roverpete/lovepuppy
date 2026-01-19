import {Col, FormCheck, FormLabel, Row} from "react-bootstrap";

/**
 *
 * @param guestBookConfig{GuestBookConfig}
 * @param guestData{GuestData}
 * @param onChange{FunctionStringCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function ContactMethod({guestBookConfig, guestData, onChange}) {

  return (
    <>
      {guestBookConfig?.ShowContactInfo && (
        <Row className="mt-2">
          <Col sm={"auto"} style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <FormLabel column={'lg'} className={"me-3"} htmlFor={"ContactMethod"}>Contact By:</FormLabel>
          </Col>
          <Col sm={"auto"} style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            {guestBookConfig.ShowEmail && (
              <FormCheck
                type="radio"
                name="ContactMethod"
                id="ContactMethodEmail"
                label="Email"
                checked={!guestData.ContactMethod || guestData.ContactMethod === "email"}
                onChange={() => onChange('email')}
                inline
              />
            )}
            {guestBookConfig.ShowDayPhone && (
              <FormCheck
                type="radio"
                name="ContactMethod"
                id="ContactMethodPhone"
                label="Phone"
                checked={!guestData.ContactMethod || guestData.ContactMethod === "phone"}
                onChange={() => onChange('phone')}
                inline
              />
            )}
            {guestBookConfig.ShowEveningPhone && (
              <FormCheck
                type="radio"
                name="ContactMethod"
                id="ContactMethodMobile"
                label="Mobile"
                checked={!guestData.ContactMethod || guestData.ContactMethod === "mobile"}
                onChange={() => onChange('mobile')}
                inline
              />
            )}
            {guestBookConfig.ShowFax && (
              <FormCheck
                type="radio"
                name="ContactMethod"
                id="ContactMethodAltPhone"
                label="Alternate Phone"
                checked={!guestData.ContactMethod || guestData.ContactMethod === "alternate phone"}
                onChange={() => onChange('alternate phone')}
                inline
              />
            )}
          </Col>
        </Row>
      )}
    </>
  )
}

export default ContactMethod;