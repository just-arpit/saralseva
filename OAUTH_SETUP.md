# OAuth Setup Instructions for Saral Seva

## 🚀 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Choose **Web application**
4. Add these URIs:
   - **Authorized JavaScript origins**: `http://localhost:3001`
   - **Authorized redirect URIs**: `http://localhost:3001/auth/google/callback`

### Step 3: Get Your Credentials
```bash
# Copy these values to your .env file:
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🏛️ DigiLocker OAuth Setup

### Step 1: Register with DigiLocker
1. Go to [DigiLocker Developer Portal](https://api.digitallocker.gov.in/)
2. Create a developer account
3. Submit your application for API access

### Step 2: Application Details
- **Application Name**: Saral Seva
- **Application Type**: Web Application
- **Redirect URI**: `http://localhost:3001/auth/digilocker/callback`
- **Scope**: BasicProfile

### Step 3: Get Your Credentials
```bash
# Copy these values to your .env file:
DIGILOCKER_CLIENT_ID=your-digilocker-client-id
DIGILOCKER_CLIENT_SECRET=your-digilocker-client-secret
```

## 🔧 Complete .env Configuration

Your `.env` file should look like this:

```bash
MONGODB_URI=mongodb://localhost:27017/saral-seva
PORT=3001
JWT_SECRET=87dc60d06a9e80ed0e0a1c1082cb9573a70862e2b607cfa98738464f758394073b98212550eeb75780f5fcedfe93f26f0a3fd728b3d4fdea716b600167b1a8b2
GEMINI_API_KEY=AIzaSyDWpKfmLPiuO13eqdHu4Ikz3SxOLDyisHo
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret

# DigiLocker Configuration
DIGILOCKER_CLIENT_ID=your-digilocker-client-id
DIGILOCKER_CLIENT_SECRET=your-digilocker-client-secret
DIGILOCKER_REDIRECT_URI=http://localhost:3001/auth/digilocker/callback
```

## 🎯 Features Implemented

✅ **Google OAuth**
- One-click login with Google account
- Automatic profile picture import
- Email verification bypass
- Seamless user experience

✅ **DigiLocker Integration**
- Government-verified identity login
- Automatic Aadhaar verification
- PAN verification
- Access to government documents
- Digital India certified

✅ **Enhanced Security**
- JWT token-based authentication
- Secure session management
- HTTPS ready for production
- CORS protection

✅ **User Experience**
- Beautiful OAuth buttons with icons
- Hindi/English mixed interface
- Mobile-responsive design
- Clear benefits explanation

## 🚀 How to Test

1. **Setup credentials** in your `.env` file
2. **Restart the backend server**
3. **Visit** `http://localhost:8081/login`
4. **Click** on Google or DigiLocker buttons
5. **Complete OAuth flow**
6. **Get redirected** to dashboard with automatic login

## 📱 Mobile Support

Both OAuth methods work perfectly on mobile devices:
- Touch-friendly buttons
- Responsive design
- Native app redirects supported

## 🔒 Security Benefits

**DigiLocker Advantages:**
- ✅ Government verified identity
- ✅ Instant Aadhaar/PAN verification
- ✅ Digital India certified
- ✅ 100% secure and trusted
- ✅ Access to government documents

**Google OAuth Advantages:**
- ✅ Quick and familiar login
- ✅ No password required
- ✅ Profile picture import
- ✅ Email verification bypass

## 🛠️ Troubleshooting

**Common Issues:**
1. **"redirect_uri_mismatch"** - Check your redirect URIs in OAuth settings
2. **"invalid_client"** - Verify your client ID and secret
3. **CORS errors** - Ensure frontend URL is in CORS_ORIGIN

**DigiLocker Specific:**
- API access may take 2-3 business days for approval
- Sandbox environment available for testing
- Production requires government verification

Your OAuth integration is now ready! 🎉
