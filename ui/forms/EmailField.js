import {Form} from "react-bootstrap";

export default function EmailField(props) {
  return (
    <Form.Control
      {...props}
      type="email"
      autoComplete="email"
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
