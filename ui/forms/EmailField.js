/**
 * @typedef EmailFieldProps
 *
 * @property {string} name               Field name, used to label the field and also for onChange events.
 * @property {string} value              Field current value.
 * @property {string} defaultValue       Example default value.
 * @property {string} className          One or more additional class names for field.
 * @property {boolean} required          Is required?
 * @property {string} prompt             Prompt string when nothing is selected.
 * @property {DataCallback} onChange     Standard data callback receiving {name, value} when field contents change
 */

export default function EmailField(props){
  return (
    <div className="form-group col-xs-8 col-md-6 mt-4">
      <label className="form-label" htmlFor="email">{props.label}</label>
      <input
        type="email"
        autoComplete="email"
        className={"form-control" + (props.value != null ? isValidEmail(props.value) ? " is-valid" : " is-invalid" : "")}
        name={props.name}
        id={props.name}
        value={props.value}
        onChange={e => props.onChange({
          name: props.name,
          value: e.target.value !== null ? e.target.value : ""
        })}
        onBlur={e => props.onChange({
          name:  props.name,
          value: e.target.value !== null ? e.target.value : ""
        })}
        required={props.required === true}
      />
    </div>
  )
}


function isValidEmail(email) {
  // A common regex pattern for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
