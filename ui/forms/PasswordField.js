/**
 * @typedef PasswordFieldProps
 *
 * @property {string} name               Field name, used to label the field and also for onChange events.
 * @property {string} label              Field label text.
 * @property {boolean} required          Is required?
 * @property {DataCallback} onChange     Standard data callback receiving {name, value} when field contents change
 */

/**
 *
 * @param {PasswordFieldProps} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordField(props) {
  return (
    <div className="form-group col-xs-8 col-md-6 mt-4">
      <label className="form-label" htmlFor={props.name}>{props.label}</label>
      <input
        type="password"
        autoComplete="current-password"
        className={"form-control"}
        name={props.name}
        id={props.name}
        onChange={e => props.onChange({
          name: props.name,
          value: e.target.value !== null ? e.target.value : ""
        })}
        onBlur={e => props.onChange({
          name: props.name,
          value: e.target.value !== null ? e.target.value : ""
        })}
        required={props.required}
      />
    </div>
  )
}
