import {useContext, createContext} from "react";
import {useCookies} from 'react-cookie';

export const AuthContext = createContext({
  token: null,
  setToken: (value) => console.error(`setToken() is not defined.`)
});

export default function AuthProvider(props) {
  const [cookies, setCookie] = useCookies();

  return (
    <AuthContext
      value={{
        token: cookies.token,
        setToken: (token) => setCookie('token', token)
      }}>
      {props.children}
    </AuthContext>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};