import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, notification) => {
  return notification;
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, sendNotification] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[notification, sendNotification]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
