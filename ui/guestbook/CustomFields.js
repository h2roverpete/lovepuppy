import DatePicker from "react-datepicker";
import SelectField from "../forms/SelectField";

/**
 * Guest Book custom fields.
 *
 * @param guestBookConfig{GuestBookConfig}
 * @param feedbackData{GuestFeedbackData}
 * @param onChange{DataCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function CustomFields({guestBookConfig, feedbackData, onChange}) {

  // build custom field information
  const customFields = [];
  if (guestBookConfig) {
    for (let i = 0; i <= 8; i++) {
      if (guestBookConfig[`Custom${i}Label`] && guestBookConfig[`Custom${i}Type`]) {
        let options;
        if (guestBookConfig[`Custom${i}Options`]) {
          options = []
          const optionValues = guestBookConfig[`Custom${i}Options`].split(",");
          optionValues.map((option) => {
            options.push({
              value: option,
              label: option
            })
            return option;
          })
        }
        customFields.push({
          seq: i,
          label: guestBookConfig[`Custom${i}Label`],
          type: guestBookConfig[`Custom${i}Type`],
          userEditable: guestBookConfig[`Custom${i}UserEditable`],
          required: guestBookConfig[`Custom${i}Required`],
          options: options,
          emptyLabel: guestBookConfig[`Custom${i}EmptyLabel`],
          value: feedbackData?.[`Custom${i}`]
        })
      }
    }
  }

  return (
    <>
      {customFields.map(field => (
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