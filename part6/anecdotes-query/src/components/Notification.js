import { useContext, useEffect } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const [notification, sendNotification] = useContext(NotificationContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      sendNotification("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification, sendNotification]);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (notification.length > 0) return <div style={style}>{notification}</div>;
};

export default Notification;
