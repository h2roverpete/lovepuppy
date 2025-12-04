import {useContext, createContext} from "react";

const AuthContext = createContext({});

export default function (props) {
  return <AuthContext
    value={{
      user: null,
      token: null
    }}>
    {props.children}
  </AuthContext>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};