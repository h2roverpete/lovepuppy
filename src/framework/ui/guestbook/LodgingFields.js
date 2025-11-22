import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {useEffect} from "react";
import SelectField from "../forms/SelectField";

// number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * @class LodgingData
 *
 * @property {Date} ArrivalDate
 * @property {Date} DepartureDate
 */

/**
 * @callback DataCallback
 * @param {name:String, value:String}
 */

/**
 * Arrival and departure date fields for guest book forms.
 *
 * @param lodgingData {LodgingData|GuestFeedbackData}
 * @param onChange {DataCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function LodgingFields({lodgingData, onChange}) {

  // update departure date when arrival date changes
  useEffect(() => {
    if ((lodgingData.ArrivalDate && !lodgingData.DepartureDate) || (lodgingData.ArrivalDate && lodgingData.DepartureDate && lodgingData.DepartureDate <= lodgingData.ArrivalDate)) {
      const d = new Date(new Date(lodgingData.ArrivalDate).getTime() + ONE_DAY);
      onChange({
        name: "DepartureDate",
        value: d.toISOString()
      })
    }
  }, [lodgingData.ArrivalDate, lodgingData.DepartureDate, onChange]);

  // number of guests option data
  const options = [
    {name: "1", label: "1"},
    {name: "2", label: "2"},
    {name: "3", label: "3"},
    {name: "4", label: "4"},
  ]

  return (
    <>
      <div className="form-group mt-4">
        <label htmlFor="arrivaldate" className="form-label required">Arrival Date</label>
        <DatePicker
          selected={lodgingData.ArrivalDate}
          onChange={(date) => {
            onChange?.(
              {
                value: date.toISOString(),
                name: 'ArrivalDate'
              }
            );
          }}
          showMonthYearDropdown
          id="arrivaldate"
          className="form-control ms-2"
          style={{marginLeft: '10px'}}
          selectsStart={true}
          minDate={new Date() + ONE_DAY}
          startDate={lodgingData.ArrivalDate}
          endDate={lodgingData.DepartureDate}
          placeholderText={`Select a date.`}
          required={true}
        />
      </div>
      <div className="form-group required mt-2">
        <label htmlFor="departuredate" className="form-label required mt-2">Departure Date</label>
        <DatePicker
          selected={lodgingData.DepartureDate}
          onChange={(date) => {
            onChange?.(
              {
                value: date.toISOString(),
                name: 'DepartureDate'
              }
            );
          }}
          showMonthYearDropdown
          id="departuredate"
          className="form-control ms-2"
          style={{marginLeft: '10px'}}
          selectsEnd={true}
          minDate={lodgingData.ArrivalDate + ONE_DAY}
          startDate={lodgingData.ArrivalDate}
          endDate={lodgingData.DepartureDate}
          placeholderText={`Select a date.`}
          required={true}
        />
      </div>
      <div className="form-group col-8 mt-2">
        <label className="control-label required" htmlFor="NumberOfGuests">Number of Guests</label>
        <SelectField
          name="NumberOfGuests"
          required={true}
          onChange={onChange}
          value={lodgingData.NumberOfGuests}
          options={options}
        />
      </div>
    </>
  )
}

export default LodgingFields