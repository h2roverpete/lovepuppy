import {useContext, useEffect, useRef} from "react";
import '../ui/forms/Forms.css'
import EmailField from "../ui/forms/EmailField";
import PasswordField from "../ui/forms/PasswordField";
import {useSearchParams} from 'react-router';
import {SiteContext} from "../ui/content/Site";
import {useNavigate} from "react-router";
import {Permission, useAuth} from "./AuthProvider";
import {useCookies} from "react-cookie";
import {useRestApi} from "../api/RestApi";
import {Button,Form} from "react-bootstrap";

/**
 * @typedef LoginProps
 * @property {Permission | [Permission]} [permission]   Permissions to request
 */

/**
 * Login UI component.
 *
 * @param {LoginProps} props
 * @returns {JSX.Element}
 * @constructor
 */
const Login = (props) => {

  const permissions = [];
  if (!props.permission) {
    // default permission to request is admin
    permissions.push(Permission.ADMIN);
  } else if (typeof props.permission === "string") {
    // one permission provided
    permissions.push(props.permission);
  } else if (Array.isArray(props.permission)) {
    // multiple permissions provided
    for (const permission of props.permission) {
      permissions.push(permission);
    }
  }
  // prefix all permissions with host name
  for (let i = 0; i < permissions.length; i++) {
    permissions[i] = window.location.host + ":" + permissions[i];
  }
  const scope = permissions.join(",")

  const {getAuthToken} = useRestApi();
  const {setError} = useContext(SiteContext);
  const [searchParams] = useSearchParams();
  const {token, setToken} = useAuth();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  if (!cookies.loginState) {
    setCookie("loginState", generateState());
  }

  useEffect(() => {
    if (token) {
      // token already set
      navigate('/');
    }
  }, [token, navigate])

  const loginResponse = searchParams.get('state') && searchParams.get('code');
  const fetchingToken = useRef(false); // prevent double fetch of token
  useEffect(() => {
    // process login response
    if (loginResponse && !token && !fetchingToken.current) {
      fetchingToken.current = true;
      // check received state against state originally sent
      if (cookies.loginState !== searchParams.get('state')) {
        setError({
          title: 'Invalid login state',
          description: "Couldn't verify login state.",
        })
      } else {
        getAuthToken(
          window.location.host,
          `${window.location.protocol}//${window.location.host}/login`,
          searchParams.get('code')
        ).then((token) => {
            // successful token retrieval
            setToken(token);
            navigate('/');
          }
        ).catch((error) => {
            setError({
              title: `${error.status} Login Error`,
              description: `Couldn't retrieve token. Code=${error.code}`
            });
          }
        );
      }
    }
  });

  function onChange(name, value) {
    // receive username/password changes
  }

  return (
    <>{loginResponse ? (
      // process login response
      <div>Processing login...</div>
    ) : (
      // display login form
      <div className="container-fluid">
        <title>Log In</title>
        <form method="POST" action={`${process.env.REACT_APP_BACKEND_HOST}/oauth/login`}>
          <input type="hidden" name="response_type" value="code"/>
          <input type="hidden" name="client_id" value={window.location.host}/>
          <input type="hidden" name="redirect_uri"
                 value={`${window.location.protocol}//${window.location.host}/login`}/>
          <input type="hidden" name="state" value={cookies.loginState}/>
          <input type="hidden" name="scope" value={scope}/>
          <Form.Group>
            <Form.Label htmlFor="username">
              Login
            </Form.Label>
            <EmailField
              onChange={onChange}
              name={"username"}
              id="username"
              required={true}
              defaultValue={"me@me.com"}
            />
          </Form.Group>
          <PasswordField
            onChange={onChange}
            name={"password"}
            label="Password"
            value={""}
            required={true}
          />
          <div className="form-group mt-4">
            <Button type="submit" variant="primary">Log In</Button>
          </div>
        </form>
      </div>
    )}</>
  );
}

export default Login;

/**
 * Generate a random state string.
 * @returns {string}
 */
function generateState() {
  const randomBytes = new Uint8Array(128); // 32 bytes for a strong verifier
  crypto.getRandomValues(randomBytes);
  return base64UrlEncode(randomBytes);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
