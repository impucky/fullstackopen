import { createContext, useReducer, useContext } from "react";

const reducer = (state, action) => {
  return action;
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(reducer, null);

  return <UserContext.Provider value={[user, dispatch]}>{props.children}</UserContext.Provider>;
};

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};

export default UserContext;
