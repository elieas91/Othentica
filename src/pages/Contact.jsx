import React from 'react';
// import { useState } from 'react'; // Currently unused but kept for future form implementation
import Button from '../components/ui/Button';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/contact/dubai_bg.webp';
import ContactUs from '../components/ui/ContactUs';

const Contact = () => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   subject: '',
  //   message: '',
  // }); // Currently unused but kept for future form implementation

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission
  // };

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title="Every Successful Partnership Starts with a Phone Call"
          subtitle=""
          description=""
          buttonText=""
          buttonVariant="accent"
          hasGradientTransparentBottom={false}
          minHeight="min-h-[80vh]"
          backgroundImage={BannerBg}
          hasTransparentSides={false}
          hasOverlay={true}
        />
      </div>

      {/* ContactUs overlapping top half */}
      <div className="relative z-40 w-[70%] mx-auto top-[-9rem]">
        <ContactUs />
      </div>

      {/*  */}
    </div>
  );
};

export default Contact;
