import { useNotificationValue } from "../context/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (notification)
    return (
      <div
        className={`message ${notification.type}`}
        style={{ opacity: notification.type ? 1 : 0 }}
      >
        {notification.content}
      </div>
    );
};

export default Notification;
