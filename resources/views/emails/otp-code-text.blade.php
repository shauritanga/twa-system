{{ $appName }} - Verification Code

Hello {{ $user->name }},

Your login verification code is: {{ $otpCode }}

This code will expire in {{ $expirationMinutes }} minutes.

How to use this code:
1. Return to the login page where you were asked for the verification code
2. Enter the 6-digit code exactly as shown above
3. Click "Verify" to complete your login

SECURITY NOTICE:
Never share this code with anyone. {{ $appName }} staff will never ask for your verification code.

If you didn't request this code, please ignore this email and consider changing your password.

---
This is an automated message from {{ $appName }}.
If you're having trouble logging in, please contact our support team.

© {{ date('Y') }} {{ $appName }}. All rights reserved.
