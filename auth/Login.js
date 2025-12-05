import {useContext, useEffect, useRef} from "react";
import '../ui/forms/Forms.css'
import EmailField from "../ui/forms/EmailField";
import PasswordField from "../ui/forms/PasswordField";
import {useSearchParams} from 'react-router';
import {SiteContext} from "../ui/content/Site";
import {PageContext} from "../ui/content/Page";
import {useNavigate} from "react-router";
import {useAuth} from "./AuthProvider";
import {useCookies} from "react-cookie";
import {useRestApi} from "../api/RestApi";

/**
 * Login UI component.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {

  const {getAuthToken} = useRestApi();
  const {setError} = useContext(SiteContext);
  let [searchParams] = useSearchParams();
  const {token, setToken} = useAuth();
  const navigate = useNavigate();
  const {logout} = useContext(PageContext);
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    if (token) {
      // token already set
      console.debug(`Token already set: ${JSON.stringify(token)}`);
      navigate('/');
    }
  }, [token, navigate])

  useEffect(() => {
    if (logout && token) {
      // clear token and return
      console.debug(`Log out.`);
      setToken(null);
      navigate('/');
    }
  }, [token, navigate, logout, setToken]);

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
            console.debug(`Received token: ${JSON.stringify(token)}`);
            setCookie('token', token);
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
          <input type="hidden" name="state" value={`${cookies.loginState}`}/>
          <input type="hidden" name="scope" value={`admin`}/>
          <EmailField onChange={onChange} name={"username"} label="Email" required={true} defaultValue={"me@me.com"}/>
          <PasswordField onChange={onChange} name={"password"} label="Password" value={""} required={true}/>
          <div className="form-group mt-4">
            <button className="btn btn-primary">Log In</button>
          </div>
        </form>
      </div>
    )}</>
  );
}

export default Login;