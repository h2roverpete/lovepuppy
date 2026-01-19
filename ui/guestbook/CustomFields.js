import DatePicker from "react-datepicker";
import SelectField from "../forms/SelectField";
import {useGuestBook} from "./GuestBook";

/**
 * Guest Book custom fields.
 *
 * @param guestBookConfig{GuestBookConfig}
 * @param feedbackData{GuestFeedbackData}
 * @param onChange{DataCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function CustomFields({feedbackData, onChange}) {

  // build custom field information
  const {customFields} = useGuestBook();
  return (
    <>
      {customFields?.map(field => (
        <div key={field.seq} className={'form-group col-xs-12 col-sm-6' + (field.seq === 1 ? " mt-4" : " mt-2")}>
          <label
            className={"form-label" + (field.required ? ' required' : '')}
            htmlFor={`Custom${field.seq}`}
            style={{marginRight: "10px"}}
          >
            {field.label}
          </label>
          {field.type === "text" && field.options && (
            <SelectField
              required={field.required}
              name={`Custom${field.seq}`}
              onChange={onChange}
              value={feedbackData[`Custom${field.seq}`]}
              options={field.options}
              prompt={field.emptyLabel}
            />
          )}
          {field.type === 'text' && !field.options && (
            <input
              type="text"
              name={`Custom${field.seq}`}
              className="form-control"
              onChange={e => onChange?.(e.target)}
              required={field.required}
            />
          )}
          {field.type === 'date' && (
            <DatePicker
              selected={feedbackData[`Custom${field.seq}`]}
              onChange={(date) => {
                onChange?.({
                  name: `Custom${field.seq}`,
                  value: date.toISOString()
                })
              }}
              showMonthYearDropdown
              id={`Custom${field.seq}`}
              name={`Custom${field.seq}`}
              className="form-control"
              minDate={new Date()}
              placeholderText={`Select a date.`}
              required={field.required}
            />
          )}
        </div>
      ))}
    </>
  )
}

export default CustomFields;