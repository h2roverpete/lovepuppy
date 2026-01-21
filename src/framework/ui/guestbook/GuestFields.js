import AddressFields from "../forms/AddressFields";
import PhoneNumberField from "../forms/PhoneNumberField";
import {Col, Row, Form, FormControl, FormLabel, FormSelect} from "react-bootstrap";

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
      {guestBookConfig?.ShowName && (<>
        <Row>
          <FormLabel htmlFor="FirstName" className={'required text-nowrap'} column={true} sm={2}>First Name</FormLabel>
          <Col sm={6}>
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
            />
          </Col>
        </Row>
        <Row className={'mt-2'}>
          <FormLabel htmlFor="LastName" className={'required text-nowrap'} sm={2} column={true}>Last Name</FormLabel>
          <Col sm={6}>
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
            />
          </Col>
        </Row>
      </>)}
      {guestBookConfig?.ShowAddress && (
        <AddressFields address={guestData} onChange={(data) => onChange(data)}/>
      )}
      {guestBookConfig?.ShowDayPhone && (
        <Row className={"mt-2"}>
          <FormLabel htmlFor="DayPhone" column={true} sm={2}>Phone</FormLabel>
          <Col sm={6}>
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
          <FormLabel htmlFor="EveningPhone" column={true} sm={2}>Mobile Phone</FormLabel>
          <Col sm={6}>
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
          <FormLabel htmlFor="Fax" column={true} sm={2}>Alternate</FormLabel>
          <Col sm={6}>
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
          <FormLabel className="required" column={true} sm={'2'}>Email</FormLabel>
          <Col sm={6}>
            <FormControl
              type="email"
              isInvalid={guestData.Email && !isValidEmail(guestData.Email)}
              isValid={guestData.Email && isValidEmail(guestData.Email)}
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
      {(guestBookConfig?.ShowDayPhone || guestBookConfig?.ShowEveningPhone || guestBookConfig?.ShowFax || guestBookConfig?.ShowEmail) && (<>
        <Row className={"mt-2"}>
          <FormLabel htmlFor="ContactMethod" column={true} sm={'2'}>Contact By</FormLabel>
          <Col sm={'auto'}>
            <FormSelect
              id="ContactMethod"
              value={guestData?.ContactMethod}
              onChange={(e) => onChange({name: 'ContactMethod', value: e.target.value})}
            >
              {guestBookConfig?.ShowEmail && (<option>Email</option>)}
              {guestBookConfig?.ShowDayPhone && (<option>Phone</option>)}
              {guestBookConfig?.ShowEveningPhone && (<option>Mobile</option>)}
              {guestBookConfig?.ShowFax && (<option>Alternate</option>)}
            </FormSelect>
          </Col>
        </Row>
      </>)}
      {guestBookConfig?.ShowMailingList && (
        <Row className={"mt-2"}>
          <Col>
            <Form.Check
              name="MailingList"
              id="mailinglist"
              value="1"
              label={"Add me to the mailing list"}
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