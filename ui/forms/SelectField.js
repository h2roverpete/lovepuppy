/**
 * @class Option
 * @property value {string}
 * @property label {string}
 */

/**
 * @typedef {object} SelectFieldProps
 * @property {string} name               Field name, used to label the field and also for onChange events.
 * @property {string} value              Field current value.
 * @property {string} className          One or more additional class names for field.
 * @property {boolean} required          Is required?
 * @property {string} prompt             Prompt string when nothing is selected.
 * @property {DataCallback} onChange     Standard data callback receiving {name, value} when field contents change
 * @property {[Option]} options          Options list.
 */

/**
 * Standardized "select" list.
 *
 * @param props {SelectFieldProps}
 * @returns {JSX.Element}
 * @constructor
 */
function SelectField(props) {
  return (
    <select
      className={`form-control${props.className ? ' ' + props.className : ''}`}
      name={props.name}
      value={props.value}
      required={props.required}
      onChange={e => {
        props.onChange?.({name: props.name, value: e.target.value})
      }}
    >
      <option key="" value="">{prompt && prompt.length ? prompt : `(Select)`}</option>
      {props.options?.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        )
      )}
    </select>
  )
}

export default SelectField;