import {useState, useContext} from "react";
import {PageContext} from "../ui/content/Page";
import '../ui/forms/Forms.css'
import EmailField from "../ui/forms/EmailField";
import PasswordField from "../ui/forms/PasswordField";

/**
 * Login UI component.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {
  const [loginData, setLoginData] = useState({name: null, password: null});
  const {login} = useContext(PageContext);

  const handleSubmitEvent = (e) => {
    e.preventDefault();
  };

  function onChange(name, value) {
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  return (
    <>{login && (
      <div className="container-fluid">
        <title>Log In</title>
        <form onSubmit={handleSubmitEvent}>
          <EmailField onChange={onChange} name={"email"} label="Email" required={true} defaultValue={"me@me.com"}/>
          <PasswordField onChange={onChange} name={"password"} label="Password" value={""} required={true} />
          <div className="form-group mt-4">
            <button className="btn btn-primary">Log In</button>
          </div>
        </form>
      </div>
    )}</>
  );
};

export default Login;