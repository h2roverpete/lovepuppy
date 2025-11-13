import {useMemo} from "react";
import {ReactSelectBootstrap} from 'react-select-bootstrap';
import countryList from 'react-select-country-list'
import stateList from 'states-us';

const popupStyles = {
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white', // Background color of the entire popup menu
        border: '1px solid #ccc', // Border around the menu
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        fontSize: '12pt',
        zIndex: 9999, // Ensure the menu appears above other elements
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#e6f7ff' : 'white', // Background on hover
        color: state.isSelected ? 'black' : 'black', // Text color for selected/unselected options
        padding: '8px 12px',
        fontSize: '12pt',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: state.isSelected ? 'blue' : 'blue', // Background on click
        },
    }),
    control: (provided) => ({
        ...provided,
        fontSize: '12pt'
    })
    // You can also style other parts like control, singleValue, multiValue, etc.
    // control: (provided) => ({
    //   ...provided,
    //   // Add your control styles here
    // }),
};

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

    // country list for popup
    const countryOptions = useMemo(() => countryList().getData(), [])
    const stateOptions = useMemo(() => {
        const states = [];
        stateList.map(item => {
            const state = {
                label: item.name,
                value: item.abbreviation
            }
            states.push(state);
            return item;
        })
        return states;
    }, [])

    let countryOption;
    countryOptions.map(option => {
        if (option.value && option.value === address.Country) {
            countryOption = option;
        }
        return option;
    });

    let stateOption;
    stateOptions.map(option => {
        if (option.value && option.value === address.State) {
            stateOption = option;
        }
        return option;
    });

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
                <ReactSelectBootstrap
                    onChange={option => {
                        console.debug(`Country changed: ${JSON.stringify(option)}`);
                        onChange({name: 'Country', value: option.value});
                    }}
                    defaultValue={countryOption}
                    options={countryOptions}
                    styles={popupStyles}
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
                        <ReactSelectBootstrap
                            onChange={option => {
                                console.debug(`Country changed: ${JSON.stringify(option)}`);
                                onChange({name: 'State', value: option.value});
                            }}
                            value={stateOption}
                            options={stateOptions}
                            styles={popupStyles}
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