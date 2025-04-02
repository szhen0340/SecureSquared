# SecureSquared

SecureSquared is a fake AI security company used as the theme for the AI/ML challenges I created for UIC's Capture the Flame event. This directory in particular contains the web app for SecureSquared.

## Getting Started

### Installation

1. Install dependencies:

   ```bash
   bun i
   ```

2. Run the development server:

   ```bash
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure (notable files)

```
challenge-web-app/
├── components/
│   ├── chat-assistant # Chat Assistant
├── app/
│   ├── blog/          # Blog Moderator
│   ├── careers/       # Resume Screener
│   ├── signin/        # Face Recognition
├── utils/             # Utility functions for each challenge
└── README.md          # This file
```

## Deployment

The application is deployed on Vercel and can be accessed at [https://ctf-securesquared.vercel.app/](https://ctf-securesquared.vercel.app/).

## Security Notice

This application intentionally contains security vulnerabilities for educational purposes. It should not be used in production environments or to process real user data.
