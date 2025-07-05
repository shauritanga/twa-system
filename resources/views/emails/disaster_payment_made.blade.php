<!DOCTYPE html>
<html>
<head>
    <title>Disaster Payment Made</title>
</head>
<body>
    <h1>Disaster Payment Notification</h1>
    <p>A disaster payment has been made to a member.</p>
    <ul>
        <li><strong>Member:</strong> {{ $payment->member->name }}</li>
        <li><strong>Amount:</strong> {{ $payment->amount }}</li>
        <li><strong>Date:</strong> {{ $payment->date }}</li>
    </ul>
</body>
</html>