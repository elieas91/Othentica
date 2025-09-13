import WhatsappIcon from '../../assets/img/whatsapp_icon.webp';

const WhatsAppButton = ({ type = 'circle', className = '' }) => {
  const phoneNumber = '971503680320';
  const message = 'Hello! I would like to chat with you.';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  if (type === 'rectangle') {
    return (
      <div
        onClick={handleClick}
        className="w-36 h-12 bg-[#26d044] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-2"
      >
        <img src={WhatsappIcon} alt="WhatsApp" className="w-8" />
        <span className="text-white font-semibold text-sm">Whatsapp</span>
      </div>
    );
  }

  //Circle (default)
  return (
    <img
      src={WhatsappIcon}
      alt="WhatsApp"
      onClick={handleClick}
      className={`${className} cursor-pointer`}
      style={{
        cursor: 'pointer',
        zIndex: 10,
      }}
    />
  );
};

export default WhatsAppButton;
