import WhatsappIcon from '../../assets/img/whatsapp_icon.png';

const WhatsAppButton = ({ className = '' }) => {
  const phoneNumber = '971503680320';
  const message = 'Hello! I would like to chat with you.';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  return (
    <img
      src={WhatsappIcon}
      alt="WhatsApp"
      onClick={handleClick}
      className={className}
      style={{
        cursor: 'pointer',
        zIndex: 1000,
      }}
    />
  );
};

export default WhatsAppButton;
