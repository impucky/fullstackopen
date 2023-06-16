import PropTypes from "prop-types";

const Message = ({ content, type }) => {
  return (
    content.length > 0 && (
      <div className={`message ${type}`} style={{ opacity: type ? 1 : 0 }}>
        {content}
      </div>
    )
  );
};

Message.propTypes = {
  content: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Message;
