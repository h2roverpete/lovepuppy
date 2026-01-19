import CountryField from "./CountryField";
import StateField from "./StateField";
import {FormControl, Row, Col, Form, FormLabel} from "react-bootstrap";

/**
 * @class AddressData
 *
 * @property {String}Address1
 * @property {String}Address2
 * @property {String}City
 * @property {String}State
 * @property {String}Zip
 * @property {String}Country
 */

/**
 * Fields for address entry.
 * @param   address{GuestData|AddressData}
 * @param onChange{DataCallback} Callback to receive changes to Address data
 * @returns {JSX.Element}
 * @constructor
 */
function AddressFields({address, onChange}) {

  if (!address.Country) {
    // set US as default country
    address.Country = 'US';
  }

  return (
    <>
      <Row className="mt-2">
        <Col>
        <label className="form-label" htmlFor="Address1">Address</label>
        <FormControl
          type="text"
          id="Address1"
          value={address?.Address1}
          onChange={e => {
            onChange?.({name: 'Address1', value: e.target.value});
          }}
          size="30"
          maxLength="50"
        />
        <FormControl
          value={address?.Address2}
          className="mt-2"
          onChange={e => {
            onChange?.({name: 'Address2', value: e.target.value});
          }}
          size="30"
          maxLength="50"
        />
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
        <FormLabel htmlFor="Country" column={true}>Country</FormLabel>
        <CountryField
          id="Country"
          name="Country"
          onChange={onChange}
          value={address?.Country.toUpperCase()}
        />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col sm={5}>
          <FormLabel className="form-label" htmlFor="City" column={'lg'}>City</FormLabel>
          <FormControl
            id="City"
            value={address?.City}
            onChange={e => {
              onChange?.({name: 'City', value: e.target.value});
            }}
          />
        </Col>

        <Col sm={4}>
          <FormLabel className="form-label" htmlFor="State" column={'lg'}>State</FormLabel>
          {address.Country === 'US' ? (
            <StateField
              id="State"
              name="State"
              onChange={onChange}
              value={address?.State}
            />
          ) : (
            <FormControl
              value={address?.State}
              onChange={e => {
                onChange?.({name: 'State', value: e.target.value});
              }}
            />
          )}
        </Col>

        <Col sm={3}>
          <FormLabel column='lg' htmlFor="Zip">Zip</FormLabel>
          <FormControl
            id="Zip"
            value={address?.Zip}
            onChange={e => {
              onChange?.({name: 'Zip', value: e.target.value});
            }}
            size="5"
            maxLength="10"/>
        </Col>
      </Row>
    </>
  )
}

export default AddressFields;