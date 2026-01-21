import {Form} from "react-bootstrap";

/**
 * Insert a form control that validates a user-entered email address.
 *
 * NOTE: Pass the value as NULL if you want the initial state of the control
 * to be unverified. Empty strings will be flagged as invalid input.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function EmailField(props) {
  return (
    <Form.Control
      {...props}
      type="email"
      autoComplete="email"
      value={props.value || ''}
      isValid={isValidEmail(props.value)}
      isInvalid={props.value === '' || (props.value?.length > 0 && !isValidEmail(props.value))}
    />
  )
}

export function isValidEmail(email) {
  // A common regex pattern for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
