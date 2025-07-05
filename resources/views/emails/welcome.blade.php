<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our System</title>
</head>
<body>
    <h1>Welcome, {{ $userName }}!</h1>
    <p>We are excited to have you as a member of our system.</p>
    <p>Below are your login credentials:</p>
    <ul>
        <li><strong>Email:</strong> {{ $userEmail }}</li>
        <li><strong>Password:</strong> {{ $defaultPassword }}</li>
    </ul>
    <p>Please log in and change your password as soon as possible for security reasons.</p>
    <p>If you have any questions or need assistance, feel free to contact us.</p>
    <p>Best regards,<br>System Team</p>
</body>
</html>
