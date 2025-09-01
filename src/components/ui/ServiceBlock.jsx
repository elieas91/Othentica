const ServiceBlock = ({ service, index }) => {
  const isEven = index % 2 === 0; // alternate layout

  return (
    <div className="flex flex-col md:flex-row items-center my-12 relative min-h-[500px]">
      {/* Image Side */}
      <div
        className={`w-full md:w-1/2 relative z-10 ${
          isEven ? 'md:order-2' : 'md:order-1'
        }`}
      >
        {/* Main Image */}
        <img
          src={service.image1}
          alt={service.title}
          className="w-full h-auto shadow-lg"
        />
      </div>

      {/* Text Side with Conditional Background */}
      <div
        className={`w-full md:w-3/4 p-8 flex flex-col justify-center relative top-[5rem]  ${
          isEven ? 'md:order-1 md:-mr-32 items-start' : 'md:order-2 md:-ml-32 items-end'
        }`}
      >
        {/* Conditional Background: Based on backgroundType field */}
        {service.backgroundType === 'image' ? (
          // Background image behind text
          <img
            src={service.image2}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 rounded-lg"
          />
        ) : (
          // Custom solid background color
          <div 
            className="absolute inset-0 w-full h-full z-0 rounded-lg"
            style={{
              backgroundColor: service.backgroundColor || '#f3f4f6'
            }}
          ></div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-start w-[85%] h-[15rem]">
          <div className="flex items-center mb-4">
            <img
              src={service.icon}
              alt="Service Icon"
              className="w-8 h-8 mr-3"
            />
            <h2 className="text-3xl font-bold">{service.title}</h2>
          </div>
          <p className="text-gray-600 text-xl leading-[2.5rem]">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBlock;
