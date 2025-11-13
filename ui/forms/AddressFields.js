import CountryField from "./CountryField";
import StateField from "./StateField";

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
      <div className="form-group col-sm-8 col-xs-12 mt-4">
        <label className="form-label" htmlFor="address1">Address</label>
        <input
          type="text" className="form-control" name="address1" id="address1"
          value={address?.Address1}
          onChange={e => {
            onChange?.({name: 'Address1', value: e.target.value});
          }}
          size="30"
          maxLength="50"
        />
        <input
          type="text" className="form-control" name="address2" id="address2"
          value={address?.Address2}
          onChange={e => {
            onChange?.({name: 'Address2', value: e.target.value});
          }}
          size="30"
          maxLength="50"
          style={{marginTop: '10px'}}
        />
      </div>

      <div className="form-group col-8 col-md-5">
        <label className="form-label" htmlFor="country">Country</label>
        <CountryField
          onChange={onChange}
          value={address?.Country.toUpperCase()}
        />
      </div>

      <div className="form-group row mt-2">
        <div className="form-group col-xs-12 col-sm-5 mt-2">
          <label className="form-label" htmlFor="city">City</label>
          <input
            className="form-control"
            name="city"
            id="city"
            value={address?.City}
            onChange={e => {
              onChange?.({name: 'City', value: e.target.value});
            }}
          />
        </div>

        <div className="form-group col-xs-12 col-sm-4 mt-2">
          <label className="form-label" htmlFor="state">State</label>
          {address.Country === 'US' ? (
            <StateField
              name="State"
              onChange={onChange}
              value={address?.State}
            />
          ) : (
            <input
              value={address?.State}
              onChange={e => {
                onChange?.({name: 'State', value: e.target.value});
              }}
              className="form-control"
            />
          )}
        </div>

        <div className="form-group col-xs-1 col-sm-3 mt-2">
          <label className="form-label" htmlFor="zip">Zip</label>
          <input
            type="text"
            className="form-control"
            name="zip"
            id="zip"
            value={address?.Zip}
            onChange={e => {
              onChange?.({name: 'Zip', value: e.target.value});
            }}
            size="5"
            maxLength="10"/>
        </div>
      </div>
    </>
  )
}

export default AddressFields;