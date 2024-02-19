$(document).ready(function () {
    var isLoggedIn = false;

    // bs data
    var orders = [
        { orderId: 'ORD123', token: 'token123', expDate: '01/25', createdDate: '2024-01-30', authAmount: 50.00, status: 'success' },
        { orderId: 'ORD124', token: 'token124', expDate: '02/25', createdDate: '2024-01-29', authAmount: 30.00, status: 'pending' },
        { orderId: 'ORD125', token: 'token125', expDate: '03/25', createdDate: '2024-01-28', authAmount: 70.00, status: 'failed' },
    ];

    function renderOrderList() {
        if (!isLoggedIn) {
            $('#loginContainer').show();
            $('#orderListContent').hide();
            $('#logOutButton').hide();
            return;
        }

        var statusFilter = $('#statusFilter').val();
        var sortOrder = $('#sortOrder').val();
        var filteredOrders = orders.filter(function (order) {
            return statusFilter === 'all' || order.status === statusFilter;
        });

        filteredOrders.sort(function (a, b) {
            var aValue = sortOrder === 'asc' ? a.createdDate : b.createdDate;
            var bValue = sortOrder === 'asc' ? b.createdDate : a.createdDate;

            return new Date(aValue) - new Date(bValue);
        });

        $('#orderTableBody').empty();

        filteredOrders.forEach(function (order) {
            var row = `<tr>
                <td>${order.orderId}</td>
                <td>${order.token}</td>
                <td>${order.expDate}</td>
                <td>${order.createdDate}</td>
                <td>${order.authAmount.toFixed(2)}</td>
                <td>${order.status}</td>
            </tr>`;
            $('#orderTableBody').append(row);
        });

        $('#loginContainer').hide();
        $('#orderListContent').show();
        $('#logOutButton').show();
    }

    $('#statusFilter, #sortOrder').on('change', renderOrderList);
    $('#password').on('keydown', function (event) {
        if (event.key === 'Enter') {
            attemptLogin();
        }
    });

    renderOrderList();

    function attemptLogin() {
        var enteredUsername = $('#username').val();
        var enteredPassword = $('#password').val();
        if (enteredUsername === "yo" && enteredPassword === "pedro") {
            isLoggedIn = true;
            renderOrderList(); 
        } else {
            alert("Incorrect username or password. Please try again.");
        }
    }

    function logOut() {
        isLoggedIn = false;
        $('#username').val(''); 
        $('#password').val('');
        $('#loginContainer').show();
        $('#orderListContent').hide();
        $('#logOutButton').hide();
    }
    
    

    $('#loginButton').click(attemptLogin);
    $('#logOutButton').click(logOut);
});
