<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penalty Calculation Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .summary-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            border-left: 4px solid #667eea;
        }
        .success { border-left-color: #28a745; }
        .warning { border-left-color: #ffc107; }
        .error { border-left-color: #dc3545; }
        .stat {
            display: inline-block;
            margin: 5px 15px 5px 0;
            font-weight: bold;
        }
        .member-list {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .member-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .member-item:last-child {
            border-bottom: none;
        }
        .error-list {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Monthly Penalty Calculation Report</h1>
        <p>{{ $calculationDate }}</p>
    </div>

    <div class="content">
        <!-- Summary Statistics -->
        <div class="summary-card {{ $hasPenalties ? 'warning' : 'success' }}">
            <h3>📈 Calculation Summary</h3>
            <div class="stat">👥 Members Processed: {{ $results['processed'] }}</div>
            <div class="stat">⚠️ Penalties Created: {{ $results['penalties_created'] }}</div>
            <div class="stat">❌ Errors: {{ count($results['errors']) }}</div>
        </div>

        @if($hasPenalties)
        <!-- Members with New Penalties -->
        <div class="member-list">
            <h3>👤 Members with New Penalties</h3>
            @foreach($results['summary'] as $member)
            <div class="member-item">
                <strong>{{ $member['member_name'] }}</strong> (ID: {{ $member['member_id'] }})
                <br>
                <small>
                    {{ $member['penalties_created'] }} penalties created for months: 
                    {{ implode(', ', $member['months']) }}
                </small>
            </div>
            @endforeach
        </div>
        @else
        <div class="summary-card success">
            <h3>✅ All Good!</h3>
            <p>No new penalties were created. All members are up to date with their contributions.</p>
        </div>
        @endif

        @if($hasErrors)
        <!-- Error Report -->
        <div class="error-list">
            <h3>❌ Errors Encountered</h3>
            @foreach($results['errors'] as $error)
            <div class="member-item">
                @if(isset($error['member_name']))
                    <strong>{{ $error['member_name'] }}</strong> (ID: {{ $error['member_id'] }})
                    <br>
                    <small style="color: #dc3545;">{{ $error['error'] }}</small>
                @else
                    <strong>General Error:</strong>
                    <br>
                    <small style="color: #dc3545;">{{ $error['general'] }}</small>
                @endif
            </div>
            @endforeach
        </div>
        @endif

        <!-- Next Steps -->
        <div class="summary-card">
            <h3>📋 Recommended Actions</h3>
            <ul>
                @if($hasPenalties)
                <li>Review the members with new penalties and consider sending reminder notifications</li>
                <li>Check the "List of Shame" in the admin dashboard for updated defaulter information</li>
                @endif
                @if($hasErrors)
                <li>Investigate and resolve the errors listed above</li>
                <li>Consider running the penalty calculation manually for affected members</li>
                @endif
                <li>Monitor penalty payment status in the financial dashboard</li>
                <li>Update penalty rates if needed in the admin settings</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>This report was generated automatically by the Groups Management System</p>
        <p>Generated on {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>
</body>
</html>
