import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Unsubscribe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribeUser = async () => {
      if (!id) {
        setError('Invalid unsubscribe link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/optin/unsubscribe/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          setUserInfo(data.user);
        } else {
          setError(data.error || 'Failed to unsubscribe');
        }
      } catch (err) {
        console.error('Unsubscribe error:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    unsubscribeUser();
  }, [id]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="bg-white dark:bg-neutral rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-primary dark:text-neutral mb-2">
              Processing Unsubscribe Request
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we process your request...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="bg-white dark:bg-neutral rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary dark:text-neutral mb-4">
              Successfully Unsubscribed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {userInfo && (
                <>
                  Hi <strong>{userInfo.firstName}</strong>,<br />
                </>
              )}
              You have been successfully unsubscribed from Othentica emails.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You will no longer receive updates about Othentica. If you change your mind, you can always register again for early access.
            </p>
            <button
              onClick={handleGoHome}
              className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="bg-white dark:bg-neutral rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary dark:text-neutral mb-4">
            Unsubscribe Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'We encountered an error while processing your unsubscribe request.'}
          </p>
          <button
            onClick={handleGoHome}
            className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
