/* eslint-disable react/prop-types */
import { Code } from "react-content-loader";
import "../scss/Contacts.scss";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

function Contacts({ contacts, chatBoxes, setChatBoxes }) {
  if (!contacts) return <Code />;
  console.log(contacts);
  return (
    <div className="">
      <h3>Contact</h3>
      <div className="user-contact">
        {contacts?.map((contact) => (
          <ContactItem
            contact={contact?.following}
            key={contact?.following_id}
            chatBoxes={chatBoxes}
            setChatBoxes={setChatBoxes}
          />
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function ContactItem({ contact, key, chatBoxes, setChatBoxes }) {
  const handleClickContact = () => {
    const isExisted = chatBoxes.some(
      (cb) => cb.recipient_id === contact.user_id
    );
    if (isExisted) return;
    setChatBoxes([
      ...chatBoxes,
      { recipient_id: contact.user_id, chatBoxId: uuidv4() },
    ]);
  };
  return (
    <div
      className="contact-item flex a-center"
      key={key}
      onClick={handleClickContact}
    >
      <img
        crossOrigin="anonymus"
        src={contact?.profile_picture}
        alt="contact-ava"
        key={key}
        onError={(e) => {
          e.target.src = "/public/user.png";
        }}
      />
      <p key={key}>{`${contact?.first_name} ${contact?.last_name}`}</p>
    </div>
  );
}

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
};
export default Contacts;
