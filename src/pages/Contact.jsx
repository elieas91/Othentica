import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/contact/banner.webp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen dark:bg-primary">
      <Banner
        title="Contact Us"
        subtitle="Get in Touch"
        description="Ready to start your digital transformation journey? We'd love to hear from you. Our team is here to help you achieve your goals and create meaningful digital experiences."
        buttonText=""
        buttonVariant="accent"
        backgroundImage={BannerBg}
      />

      <div className="py-20 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="dark:bg-gray-800 rounded-2xl p-8 shadow-professional">
              <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 text-primary dark:text-neutral placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 text-primary dark:text-neutral placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 text-primary dark:text-neutral placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent dark:bg-gray-700 text-primary dark:text-neutral placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className=" dark:bg-gray-800 rounded-2xl p-8 shadow-professional ">
                <h3 className="text-2xl font-bold text-primary dark:text-neutral mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <p className="font-medium text-primary dark:text-neutral">
                        Address
                      </p>
                      <p className="text-primary dark:text-gray-200">
                        123 Wellness Way, Mindful City, MC 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <p className="font-medium text-primary dark:text-neutral">
                        Email
                      </p>
                      <p className="text-primary dark:text-gray-200">
                        hello@othentica.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📞</div>
                    <div>
                      <p className="font-medium text-primary dark:text-neutral">
                        Phone
                      </p>
                      <p className="text-primary dark:text-gray-200">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" dark:bg-gray-800 rounded-2xl p-8 shadow-professional">
                <h3 className="text-2xl font-bold text-primary dark:text-neutral mb-6">
                  Office Hours
                </h3>
                <div className="space-y-2 text-primary dark:text-gray-200">
                  <p>
                    <span className="font-medium">Monday - Friday:</span> 9:00
                    AM - 6:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Saturday:</span> 10:00 AM -
                    4:00 PM
                  </p>
                  <p>
                    <span className="font-medium">Sunday:</span> Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
