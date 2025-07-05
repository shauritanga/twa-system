<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dependent Rejection Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #444;
            margin: 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            margin: 10px 0;
        }
        .reason {
            background-color: #f9f9f9;
            border-left: 4px solid #e74c3c;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Dependent Rejection Notification</h1>
        </div>
        <div class="content">
            <p>Dear {{ $member->name }},</p>
            <p>We regret to inform you that your dependent, {{ $dependent->name }}, has been rejected from approval in our system.</p>
            <div class="reason">
                <strong>Reason for Rejection:</strong>
                <p>{{ $dependent->rejection_reason }}</p>
            </div>
            <p>If you believe this is a mistake or wish to provide additional information, please contact an administrator or submit a new dependent application with the corrected details.</p>
            <a href="{{ url('/') }}" class="button">Visit Dashboard</a>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; {{ date('Y') }} Group System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
