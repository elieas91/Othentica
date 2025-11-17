import React from 'react';
import OptInCountdown from '../components/layout/OptInCountdown';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useState, useRef, useEffect } from 'react';
import { countryList } from '../data/countryList';
import { industryList } from '../data/industryList';
import { countryCodeMap, popularCountryCodes } from '../data/countryCodeMap';
import ClockAnimation from '../components/ui/ClockAnimation';
import apiService from '../services/api';
import Terms from '../components/ui/Terms';

const OptIn = () => {
  const [showForm, setShowForm] = useState(false);
  // Show form by default if ?earlyaccess=1 is in the URL (for new tab)
  const getShowFormFromQuery = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('earlyaccess') === '1';
    }
    return false;
  };
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);
  const errorRef = useRef(null);
  const formRef = useRef(null);

  // Scroll to error message when submitError changes
  useEffect(() => {
    if (submitError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitError]);

  const [clockAnimation, setClockAnimation] = useState(false);

  // Function to detect user's country and set country code
  const detectCountry = async () => {
    try {
      setIsDetectingCountry(true);
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.country_code && countryCodeMap[data.country_code]) {
        const detectedCountryCode = countryCodeMap[data.country_code];
        setForm((prev) => ({
          ...prev,
          phoneCountryCode: detectedCountryCode,
          country: data.country_name || '',
        }));
      }
    } catch {
      // Fallback to UAE if detection fails
      setForm((prev) => ({
        ...prev,
        phoneCountryCode: '+971',
        country: 'United Arab Emirates',
      }));
    } finally {
      setIsDetectingCountry(false);
    }
  };

  // Auto-detect country when component mounts
  useEffect(() => {
    detectCountry();
  }, []);

  const initialFormState = {
    firstName: '',
    email: '',
    phoneCountryCode: '',
    phone: '',
    company: '',
    country: '',
    industry: '',
    acknowledge: false,
    termsAgree: false,
  };
  const [form, setForm] = useState(initialFormState);


  const handleFormClose = () => {
    setShowForm(false);
    setForm(initialFormState);
    setSubmitError('');
    setIsSubmitting(false);
  };

  const handleShowForm = () => {
    // Show the form and scroll to it
    setShowForm(true);
    // Use setTimeout to ensure the form is rendered before scrolling
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleThankYouModalClose = () => {
    setClockAnimation(false);
    setThankYouModalOpen(false);
  };

  // Function to validate if email is personal (not business)
  const isPersonalEmail = (email) => {
    const emailLower = email.toLowerCase().trim();

    // Common personal email domains that are ACCEPTED
    const personalEmailPatterns = [
      /@gmail\.com$/,
      /@yahoo\.com$/,
      /@hotmail\.com$/,
      /@outlook\.com$/,
      /@aol\.com$/,
      /@icloud\.com$/,
      /@protonmail\.com$/,
      /@zoho\.com$/,
      /@yandex\.com$/,
      /@mail\.com$/,
      /@live\.com$/,
      /@msn\.com$/,
      /@rediffmail\.com$/,
      /@sify\.com$/,
      /@inbox\.com$/,
      /@fastmail\.com$/,
      /@tutanota\.com$/,
      /@mailinator\.com$/,
      /@10minutemail\.com$/,
      /@guerrillamail\.com$/,
      /@temp-mail\.org$/,
      /@throwaway\.email$/,
      /@disposable\.email$/,
      /@tempmail\.org$/,
      /@sharklasers\.com$/,
      /@grr\.la$/,
      /@guerrillamail\.block$/,
    ];

    // Check if email matches any personal email pattern
    const isPersonalEmailDomain = personalEmailPatterns.some((pattern) =>
      pattern.test(emailLower)
    );

    // If it matches personal patterns, it's ACCEPTED
    return isPersonalEmailDomain;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Client-side validation for all mandatory fields
    const {
      firstName,
      email,
      phoneCountryCode,
      phone,
      company,
      country,
      industry,
      acknowledge,
    } = form;
    if (
      !firstName.trim() ||
      !email.trim() ||
      !phoneCountryCode.trim() ||
      !phone.trim() ||
      !company.trim() ||
      !country.trim() ||
      !industry.trim() ||
      !acknowledge ||
      !form.termsAgree
    ) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    // Validate phoneCountryCode format: must start with + and only contain numbers after
    if (!/^\+[0-9]+$/.test(phoneCountryCode.trim())) {
      setSubmitError(
        'Phone country code must start with + and contain only numbers after it.'
      );
      return;
    }

    // Validate phone: must only contain numbers
    if (!/^[0-9]+$/.test(phone.trim())) {
      setSubmitError('Phone number must contain only numbers.');
      return;
    }

    // Validate email: must be personal email (not business)
    if (!isPersonalEmail(email.trim())) {
      setSubmitError(
        'Please use a personal email address (like Gmail, Yahoo, Outlook, etc.). Business emails are not accepted.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        firstName: firstName.trim(),
        email: email.trim(),
        phoneCountryCode: phoneCountryCode.trim(),
        phone: phone.trim(),
        company: company.trim(),
        country: country.trim(),
        industry: industry.trim(),
      };

      const { response, data } = await apiService.optIn(formData);

      if (response.ok) {
        // Success - close form and show thank you modal
        handleFormClose();
        setThankYouModalOpen(true);
      } else {
        // Handle API errors
        setSubmitError(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

  const shareToSocial = (platform) => {
    const currentUrl = window.location.href;
    const text =
      'Check out Othentica - the gamified wellness app that helps you find your treasures of clarity, energy, and resilience!';

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + ' ' + currentUrl
        )}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          currentUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    if (getShowFormFromQuery()) {
      setShowForm(true);
    }
  }, []);

  return (
    <>
      <OptInCountdown />
      <div className="my-16 dark:bg-primary">
        <div className="px-6">
          {/* Desktop layout: columns, Mobile layout: stacked */}
          <div className="flex flex-col md:flex-row justify-center items-start mt-8 gap-8">
            {/* Mobile: Welcome text */}
            <div className="block md:hidden w-full mb-6">
              <h2 className="text-3xl font-bold mb-4">
                Welcome! You’ve chosen to step into your authentic self.
              </h2>
            </div>
            {/* Mobile: iframe */}
            <div className="block md:hidden w-full mb-6 aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/_8tP35o0kHI"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
            {/* Mobile: Register text and button */}
            <div className="block md:hidden w-full">
              <p className="text-xl mb-2">
                Register now to receive early access to Othentica, the gamified
                wellness app that helps you find your treasures of clarity,
                energy, and resilience.
              </p>
              <p className="text-xl mb-2">
                We’ll notify you by email and SMS as soon as it’s live.
              </p>
              <Button
                variant="secondary"
                size="large"
                className="mt-8 w-full"
                onClick={handleShowForm}
                glow={true}
              >
                Yes, I Want Early Access
              </Button>
            </div>

            {/* Desktop: Left column: text */}
            <div className="hidden md:flex w-full md:w-1/3 order-1 flex-col justify-center items-start">
              <h2 className="text-3xl font-bold mb-4">
                Welcome! You’ve chosen to step into your authentic self.
              </h2>
              <p className="text-xl">
                Register now to receive early access to Othentica, the gamified
                wellness app that helps you find your treasures of clarity,
                energy, and resilience.
              </p>
              <p className="text-xl">
                We’ll notify you by email and SMS as soon as it’s live.
              </p>
              <Button
                variant="secondary"
                size="large"
                className="mt-8 w-full"
                onClick={handleShowForm}
                glow={true}
              >
                Yes, I Want Early Access
              </Button>
            </div>
            {/* Desktop: Right column: iframe */}
            <div className="hidden md:block w-full md:w-2/3 max-w-3xl aspect-video order-2">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/_8tP35o0kHI"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Section - Hidden by default, shown when button is clicked */}
      {showForm && (
        <div ref={formRef} className="my-16 dark:bg-primary">
          <div className="px-6">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-4">
                  Othentica Early Access Registration
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join the wellness revolution and step into your authentic
                  self. We'll notify you as soon as Othentica is ready to
                  launch.
                </p>
                <button
                  onClick={handleFormClose}
                  className="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm underline"
                  aria-label="Close registration section"
                >
                  Close registration
                </button>
              </div>

              {/* Registration Form */}
              <div className="bg-white dark:bg-neutral rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {submitError && (
                    <div
                      ref={errorRef}
                      className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                    >
                      {submitError}
                    </div>
                  )}

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                        htmlFor="firstName"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                        htmlFor="email"
                      >
                        <span className="font-bold">Personal</span> Email
                        Address * <br />
                        {/* <span className="text-xs text-gray-500 dark:text-gray-400">(Gmail, Yahoo, Outlook, etc. - Business emails not accepted)</span> */}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                        placeholder="your.email@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                      htmlFor="phone"
                    >
                      Personal Phone Number *
                    </label>
                    <div className="flex gap-2">
                      {/* Phone Country Code Dropdown */}
                      <div className="relative">
                        <select
                          id="phoneCountryCode"
                          name="phoneCountryCode"
                          value={form.phoneCountryCode}
                          onChange={handleChange}
                          required
                          disabled={isDetectingCountry}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral disabled:opacity-50 appearance-none"
                        >
                          <option value="">
                            {isDetectingCountry ? 'Detecting...' : 'Select'}
                          </option>
                          {popularCountryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code} {country.country}
                            </option>
                          ))}
                        </select>
                        {isDetectingCountry && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="animate-spin h-4 w-4 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {isDetectingCountry && (
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-detecting your country code...
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                        htmlFor="company"
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                        htmlFor="industry"
                      >
                        Industry *
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                      >
                        <option value="">Select your industry</option>
                        {industryList.map((industry) => (
                          <option key={industry.id} value={industry.name}>
                            {industry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-primary dark:text-neutral mb-2"
                      htmlFor="country"
                    >
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-primary dark:text-neutral"
                    >
                      <option value="">Select your country</option>
                      {countryList.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Terms form={form} handleChange={handleChange} />

                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="acknowledge"
                      name="acknowledge"
                      checked={form.acknowledge}
                      onChange={handleChange}
                      required
                      className="mr-2"
                    />
                    <label
                      htmlFor="acknowledge"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      I acknowledge that my information will be used to notify
                      me about Othentica and for early access purposes.
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="secondary"
                      size="large"
                      className="w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thank you Modal */}
      <Modal
        isOpen={thankYouModalOpen}
        onClose={() => handleThankYouModalClose()}
        closeOnOutsideClick={false}
        title="Thank You!"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            You're In! Welcome to Othentica
          </h2>
          <p className="text-xl">
            You've chosen to step into your authentic self, and we're so excited
            to have you with us.
          </p>
          <p className="text-xl my-4">
            We'll notify you by email as soon as the Othentica app is ready.
          </p>
          <p className="text-xl my-4">
            Kindly mark our email as safe and ensure it lands in your inbox (not
            the spam folder), so you don't miss any updates.
          </p>
          <p className="text-xl my-4">
            Until then, here's a first spark to begin your journey:
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Quick Othentica Tip</h2>
          <p className="text-xl mb-8">
            Take 60 seconds now to close your eyes, inhale deeply, and exhale
            slowly. This simple breath resets your brain, sharpens focus, and
            calms stress.
          </p>
          {clockAnimation ? (
            <div className="flex flex-col gap-4">
              <div className="flex-1 w-full">
                <ClockAnimation />
              </div>
              <div className="flex-1 w-full">
                <Button
                  size="large"
                  className="w-full"
                  onClick={handleShareClick}
                >
                  Share Othentica with a Friend!
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-full">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setClockAnimation(true)}
                >
                  Start Exercise
                </Button>
              </div>
              <div className="flex-1 w-full">
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleShareClick}
                >
                  Share Othentica with a Friend!
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={handleShareModalClose}
        title="Share Othentica"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Spread the Wellness Revolution!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
            Help others discover their authentic self by sharing Othentica with
            your friends and family.
          </p>

          {/* Social Media Share Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-500 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Twitter
              </span>
            </button>

            <button
              onClick={() => shareToSocial('facebook')}
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-600 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Facebook
              </span>
            </button>

            <button
              onClick={() => shareToSocial('linkedin')}
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-700 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                LinkedIn
              </span>
            </button>

            <button
              onClick={() => shareToSocial('whatsapp')}
              className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-green-500 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                WhatsApp
              </span>
            </button>

            <button
              onClick={() => shareToSocial('telegram')}
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-500 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Telegram
              </span>
            </button>

            <button
              onClick={handleCopy}
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Copy Link
              </span>
            </button>
          </div>

          <div className="text-center">
            <Button
              variant="secondary"
              onClick={handleShareModalClose}
              className="px-8"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OptIn;
