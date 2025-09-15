import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:dark:text-secondary prose-a:text-secondary prose-a:dark:text-accent prose-strong:text-gray-900 prose-strong:dark:text-gray-100">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary dark:text-secondary">
            Terms and Conditions of Use
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-4"></div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Last updated: January 2025
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 mb-12">
          <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Table of Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="space-y-1">
              <a href="#section-1" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">1. Acceptance of Terms</a>
              <a href="#section-2" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">2. Description of Service</a>
              <a href="#section-3" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">3. User Accounts and Registration</a>
              <a href="#section-4" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">4. Privacy and Data Protection</a>
              <a href="#section-5" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">5. Acceptable Use</a>
              <a href="#section-6" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">6. Intellectual Property Rights</a>
            </div>
            <div className="space-y-1">
              <a href="#section-7" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">7. Health and Wellness Disclaimer</a>
              <a href="#section-8" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">8. Limitation of Liability</a>
              <a href="#section-9" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">9. Termination</a>
              <a href="#section-10" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">10. Changes to Terms</a>
              <a href="#section-11" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">11. Governing Law</a>
              <a href="#section-12" className="block text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent transition-colors">12. Contact Information</a>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">1</span>
              Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using Othentica ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">2</span>
              Description of Service
            </h2>
            <p className="mb-4">
              Othentica is a gamified wellness application designed to help users find their treasures of clarity, energy, and resilience through interactive experiences, challenges, and personalized content.
            </p>
            <p className="mb-4">
              The App provides:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Personalized wellness challenges and activities</li>
              <li>Progress tracking and analytics</li>
              <li>Community features and social interactions</li>
              <li>Educational content and resources</li>
              <li>Gamification elements including rewards and achievements</li>
            </ul>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">3</span>
              User Accounts and Registration
            </h2>
            <p className="mb-4">
              To access certain features of the App, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate and current</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">4</span>
              Privacy and Data Protection
            </h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information in connection with the App is described in our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="mb-4">
              By using the App, you consent to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">5</span>
              Acceptable Use
            </h2>
            <p className="mb-4">
              You agree not to use the App to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful, threatening, abusive, or harassing content</li>
              <li>Attempt to gain unauthorized access to the App or its systems</li>
              <li>Interfere with or disrupt the App's functionality</li>
              <li>Use the App for any commercial purpose without our written consent</li>
            </ul>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">6</span>
              Intellectual Property Rights
            </h2>
            <p className="mb-4">
              The App and its original content, features, and functionality are and will remain the exclusive property of Othentica and its licensors. The App is protected by copyright, trademark, and other laws.
            </p>
            <p className="mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">7</span>
              Health and Wellness Disclaimer
            </h2>
            <p className="mb-4">
              The App is designed for general wellness and entertainment purposes only. It is not intended to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Replace professional medical advice, diagnosis, or treatment</li>
              <li>Be used as a substitute for professional mental health services</li>
              <li>Provide emergency medical assistance</li>
            </ul>
            <p className="mb-4">
              Always seek the advice of qualified health professionals regarding any medical condition or mental health concerns. If you are experiencing a medical emergency, contact your local emergency services immediately.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">8</span>
              Limitation of Liability
            </h2>
            <p className="mb-4">
              In no event shall Othentica, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the App.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">9</span>
              Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your account and bar access to the App immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="mb-4">
              If you wish to terminate your account, you may simply discontinue using the App.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">10</span>
              Changes to Terms
            </h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="mb-4">
              By continuing to access or use our App after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">11</span>
              Governing Law
            </h2>
            <p className="mb-4">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which Othentica operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-accent rounded-full opacity-20"></div>
            <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary flex items-center">
              <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full mr-4">12</span>
              Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-primary dark:text-secondary">Email:</strong> support@othentica.com
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-primary dark:text-secondary">Website:</strong> www.othentica.com
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-primary dark:text-secondary">Address:</strong> [Your Business Address]
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              By using Othentica, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
