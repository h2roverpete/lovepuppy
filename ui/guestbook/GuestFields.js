import AddressFields from "../forms/AddressFields";
import PhoneNumberField from "../forms/PhoneNumberField";
import ContactMethod from "./ContactMethod";
import {Col, Row, Form, FormControl, FormLabel} from "react-bootstrap";

/**
 * Display guest fields from the guest book database.
 *
 * @param guestBookConfig {GuestBookConfig}
 * @param guestData {GuestData}
 * @param onChange {DataCallback}
 * @constructor
 */
function GuestFields({guestBookConfig, guestData, onChange}) {
  return (
    <>
      {guestBookConfig?.ShowName && (
        <Row>
          <Col sm={6}>
            <Form.Label htmlFor="FirstName" column={true}>First Name</Form.Label>
            <FormControl
              isValid={guestData.FirstName != null && guestData.FirstName?.length > 0}
              isInvalid={guestData.FirstName?.length === 0}
              id="FirstName"
              size="20"
              value={guestData.FirstName}
              onChange={e => onChange({
                name: 'FirstName',
                value: e.target.value !== null ? e.target.value : ""
              })}
              onBlur={e => onChange({
                name: 'FirstName',
                value: e.target.value !== null ? e.target.value : ""
              })}
              required={true}
            />

          </Col>
          <Col sm={6}>
            <Form.Label htmlFor="LastName" column={true}>Last Name</Form.Label>
            <FormControl
              isValid={guestData.LastName != null && guestData.LastName?.length > 0}
              isInvalid={guestData.LastName?.length === 0}
              id="LastName"
              size="20"
              value={guestData.LastName}
              onChange={e => onChange({
                name: 'LastName',
                value: e.target.value !== null ? e.target.value : ""
              })}
              onBlur={e => onChange({
                name: 'LastName',
                value: e.target.value !== null ? e.target.value : ""
              })}
              required={true}
            />
          </Col>
        </Row>
      )}
      {guestBookConfig?.ShowAddress && (
        <AddressFields address={guestData} onChange={(data) => onChange(data)}/>
      )}
      {guestBookConfig?.ShowDayPhone && (
        <Row className={"mt-2"}>
          <Col sm={6}>
            <FormLabel htmlFor="DayPhone" column={'lg'}>Phone</FormLabel>
            <PhoneNumberField
              name="DayPhone"
              id="DayPhone"
              value={guestData.DayPhone}
              onChange={onChange}
            />
          </Col>
        </Row>
      )}
      {guestBookConfig?.ShowEveningPhone && (
        <Row className={"mt-2"}>
          <Col sm={6}>
            <FormLabel htmlFor="EveningPhone" column={'lg'}>Mobile Phone</FormLabel>
            <PhoneNumberField
              name="EveningPhone"
              id="EveningPhone"
              value={guestData.EveningPhone}
              onChange={onChange}
            />
          </Col>
        </Row>
      )}
      {guestBookConfig?.ShowFax && (
        <Row className={"mt-2"}>
          <Col sm={6}>
            <FormLabel htmlFor="Fax" column={'lg'}>Alternate Phone</FormLabel>
            <PhoneNumberField
              name="Fax"
              id="Fax"
              value={guestData.Fax}
              onChange={onChange}
            />
          </Col>
        </Row>
      )}
      {guestBookConfig?.ShowEmail && (
        <Row className={"mt-2"}>
          <Col sm={6}>
            <FormLabel htmlFor="Email" column={'lg'}>Email</FormLabel>
            <input
              type="email"
              className={"form-control" + (guestData.Email != null ? isValidEmail(guestData.Email) ? " is-valid" : " is-invalid" : "")}
              name="Email"
              id="Email"
              size="30"
              value={guestData.Email}
              onChange={e => onChange({
                name: 'Email',
                value: e.target.value !== null ? e.target.value : ""
              })}
              onBlur={e => onChange({
                name: 'Email',
                value: e.target.value !== null ? e.target.value : ""
              })}
              maxLength="50"
              required={true}
            />
          </Col>
        </Row>
      )}
      <ContactMethod guestBookConfig={guestBookConfig} guestData={guestData} onChange={(value) => {
        onChange({name: 'ContactMethod', value: value})
      }}/>
      {guestBookConfig?.ShowMailingList && (
        <Row>
          <Col>
            <Form.Check
              name="MailingList"
              id="mailinglist"
              value="1"
              label={"Add my email address to the mailing list"}
              defaultChecked={guestData.MailingList ? guestData.MailingList : guestBookConfig.MailingListDefault}
              onChange={e => onChange({name: 'MailingList', value: e.target.checked})}
            />
          </Col>
        </Row>
      )}
    </>
  )
}

function isValidEmail(email) {
  // A common regex pattern for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export default GuestFields;