import React from 'react';
import { Button } from './ui';

const OAuthLogin = ({ type = 'login' }) => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  const handleDigiLockerLogin = () => {
    window.location.href = 'http://localhost:3001/auth/digilocker';
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            या {type === 'login' ? 'लॉगिन करें' : 'साइन अप करें'} के साथ
          </span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="font-medium">
          Google के साथ {type === 'login' ? 'लॉगिन करें' : 'साइन अप करें'}
        </span>
      </Button>

      {/* DigiLocker OAuth Button */}
      <Button
        type="button"
        onClick={handleDigiLockerLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-orange-300 rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-md transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="font-medium">
          DigiLocker के साथ {type === 'login' ? 'लॉगिन करें' : 'साइन अप करें'}
        </span>
      </Button>

      <div className="text-center text-sm text-gray-600 mt-4">
        <p className="mb-2">
          🔒 <strong>DigiLocker के फायदे:</strong>
        </p>
        <ul className="text-xs space-y-1">
          <li>✅ तुरंत वेरिफिकेशन (आधार, PAN)</li>
          <li>✅ सरकारी दस्तावेज़ों का सीधा एक्सेस</li>
          <li>✅ डिजिटल इंडिया प्रमाणित</li>
          <li>✅ 100% सुरक्षित और भरोसेमंद</li>
        </ul>
      </div>
    </div>
  );
};

export default OAuthLogin;
