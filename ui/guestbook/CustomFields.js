import { ReactSelectBootstrap } from 'react-select-bootstrap';
import DatePicker from "react-datepicker";

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
            if (guestBookConfig[`Custom${i}Label`]) {
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
                    value: eval(`feedbackData?.Custom${i}`)
                })
            }
        }
    }

    return (
        <>
            {customFields.map(field => (
                <div key={field.seq} className={'form-group col-xs-12 col-sm-6' + (field.seq === 1 ? " mt-4" : " mt-2")}>
                    <label
                        className={"form-label"+(field.required ? ' required' : '')}
                        htmlFor={`Custom${field.seq}`}
                        style={{marginRight: "10px"}}
                    >
                        {field.label}
                    </label>
                    {field.type === "text" && field.options && (
                        <ReactSelectBootstrap
                            options={field.options}
                            styles={popupStyles}
                            required={field.required}
                            onChange={optionValue => onChange?.({
                                name: `Custom${field.seq}`,
                                value: optionValue.label
                            })}
                        />
                    )}
                    {field.type === 'text' && !field.options && (
                        <input type="text"
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