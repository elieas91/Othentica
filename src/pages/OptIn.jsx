import OptInCountdown from '../components/layout/OptInCountdown';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useState, useRef, useEffect } from 'react';
import { countryList } from '../data/countryList';
import { industryList } from '../data/industryList';
import ClockAnimation from '../components/ui/ClockAnimation';
import apiService from '../services/api';

const OptIn = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const errorRef = useRef(null);
  // Scroll to error message when submitError changes
  useEffect(() => {
    if (submitError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitError]);

  const [clockAnimation, setClockAnimation] = useState(false);

  const initialFormState = {
    firstName: '',
    email: '',
    phoneCountryCode: '',
    phone: '',
    company: '',
    country: '',
    industry: '',
    acknowledge: false,
  };
  const [form, setForm] = useState(initialFormState);

  const handleFormModalClose = () => {
    setFormModalOpen(false);
    setForm(initialFormState);
    setSubmitError('');
    setIsSubmitting(false);
  };

  const handleThankYouModalClose = () => {
    setClockAnimation(false);
    setThankYouModalOpen(false);
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
      !acknowledge
    ) {
      setSubmitError(
        'Please fill in all fields and acknowledge the disclaimer.'
      );
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
        // Success - close form modal and show thank you modal
        handleFormModalClose();
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

  return (
    <>
      <OptInCountdown />
      <div className="my-16 dark:bg-primary">
        <div className="px-6">
          <div className="flex flex-col md:flex-row justify-center items-start mt-8 gap-8">
            {/* Left column: text */}
            <div className="w-full md:w-1/3 order-1 flex flex-col justify-center items-start">
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
                onClick={() => setFormModalOpen(true)}
                glow={true}
              >
                Yes, I Want Early Access
              </Button>
            </div>
            {/* Right column: iframe */}
            <div className="w-full md:w-2/3 max-w-3xl aspect-video order-2">
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

      <Modal
        isOpen={formModalOpen}
        onClose={handleFormModalClose}
        closeOnOutsideClick={false}
        title="Othentica Early Access Registration"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {submitError && (
            <div
              ref={errorRef}
              className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {submitError}
            </div>
          )}
          <div>
            <label
              className="block text-sm font-medium mb-1"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              <span className="font-bold">Personal</span> Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Personal Phone Number *
            </label>
            <div className="flex gap-2">
              {/* Phone Country Code */}
              <input
                type="text"
                id="phoneCountryCode"
                name="phoneCountryCode"
                value={form.phoneCountryCode}
                onChange={handleChange}
                required
                placeholder="+971"
                className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              />

              {/* Phone Number */}
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="company">
              Company Name *{' '}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            >
              <option value="">Select your industry</option>
              {industryList.map((industry) => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="country">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            >
              <option value="">Select your country</option>
              {countryList.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reassurance and Disclaimer Section */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral rounded-lg text-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">Disclaimer</h3>
            <p>
              Your privacy matters. Othentica will keep your personal data safe
              and will only use it to send you updates and app access
              information.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Important Note</h3>
            <p>
              Othentica is a wellness, self-growth, and brain-health awareness
              platform. It does not provide medical advice and is not a
              substitute for professional medical or mental health care. If you
              need medical attention, please consult a qualified healthcare
              provider. By continuing, you acknowledge that your use of
              Othentica is for wellness purposes only.
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acknowledge"
              name="acknowledge"
              checked={form.acknowledge}
              onChange={handleChange}
              required
              className="mr-2"
            />
            <label htmlFor="acknowledge" className="text-sm">
              I acknowledge that my information will be used to notify me about
              Othentica and for early access purposes.
            </label>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Modal>

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
                  onClick={() => handleCopy()}
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
                  onClick={() => handleCopy()}
                >
                  Share Othentica with a Friend!
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default OptIn;
