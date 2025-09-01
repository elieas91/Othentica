const ServiceBlock = ({ service, index }) => {
  const isEven = index % 2 === 0; // alternate layout

  return (
    <div className="flex flex-col md:flex-row items-center my-36 relative">
      {/* Image Side */}
      <div
        className={`w-full md:w-1/2 relative ${
          isEven ? 'md:order-1' : 'md:order-2'
        }`}
      >
        {/* Main Image */}
        <img
          src={service.image1}
          alt={service.title}
          className="relative w-full h-auto shadow-lg z-10"
        />
      </div>

      {/* Text Side with Conditional Background */}
      <div
        className={`w-full md:w-1/2 p-8 relative flex flex-col justify-center ${
          isEven ? 'md:order-2' : 'md:order-1'
        }`}
      >
        {/* Conditional Background: Based on backgroundType field */}
        {service.backgroundType === 'image' ? (
          // Background image behind text
          <img
            src={service.image2}
            alt="Background"
            className="absolute inset-0 w-full h-[400px] object-cover opacity-40 z-0"
          />
        ) : (
          // Custom solid background color
          <div 
            className="absolute inset-0 w-full h-[400px] z-0 rounded-lg"
            style={{
              backgroundColor: service.backgroundColor || '#f3f4f6'
            }}
          ></div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <img
              src={service.icon}
              alt="Service Icon"
              className="w-8 h-8 mr-3"
            />
            <h2 className="text-3xl font-bold">{service.title}</h2>
          </div>
          <p className="text-gray-600">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBlock;
