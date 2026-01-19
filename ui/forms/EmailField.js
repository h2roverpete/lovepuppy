/**
 * @typedef EmailFieldProps
 *
 * @property {string} name               Field name, used to label the field and also for onChange events.
 * @property {string} id                  Field ID, used to label the field and also for onChange events.
 * @property {string} value              Field current value.
 * @property {string} defaultValue       Example default value.
 * @property {string} className          One or more additional class names for field.
 * @property {boolean} required          Is required?
 * @property {string} prompt             Prompt string when nothing is selected.
 * @property {DataCallback} onChange     Standard data callback receiving {name, value} when field contents change
 */
import {FormControl} from "react-bootstrap";

export default function EmailField(props) {
  return (
    <FormControl
      size={props.size}
      type="email"
      autoComplete="email"
      isValid={isValidEmail(props.value)}
      isInvalid={props.value?.length > 0 && !isValidEmail(props.value)}
      name={props.name}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      required={props.required === true}
    />
  )
}

export function isValidEmail(email) {
  // A common regex pattern for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
