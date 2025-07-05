<!DOCTYPE html>
<html>
<head>
    <title>Contributions</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>Contributions</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Purpose</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contributions as $contribution)
                <tr>
                    <td>{{ $contribution->id }}</td>
                    <td>{{ $contribution->member->name }}</td>
                    <td>{{ $contribution->amount }}</td>
                    <td>{{ $contribution->date }}</td>
                    <td>{{ $contribution->purpose }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>