$(document).ready(function () {
    var isLoggedIn = false;

    function renderOrderList() {
        if (!isLoggedIn) {
            $('#loginContainer').show();
            $('#orderListContent').hide();
            $('#logOutButton').hide();
            return;
        }

        var statusFilter = $('#statusFilter').val();
        var sortOrder = $('#sortOrder').val();

        // Fetch orders from the server
        $.ajax({
            url: 'http://localhost:5000/getAllOrders', // Adjust the URL based on your server setup
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    var orders = response.data;

                    // Apply filters and sorting
                    var filteredOrders = orders.filter(function (order) {
                        return statusFilter === 'all' || order.status === statusFilter;
                    });

                    filteredOrders.sort(function (a, b) {
                        var aValue = sortOrder === 'asc' ? a.created_date : b.created_date;
                        var bValue = sortOrder === 'asc' ? b.created_date : a.created_date;

                        return new Date(aValue) - new Date(bValue);
                    });

                    // Render the order table
                    $('#orderTableBody').empty();

                    filteredOrders.forEach(function (order) {
                        var row = `<tr>
                            <td>${order.orderId}</td>
                            <td>${order.auth_token}</td>
                            <td>${order.token_exp_date}</td>
                            <td>${order.created_date}</td>
                            <td>${order.auth_amount.toFixed(2)}</td>
                            <td>${order.status}</td>
                        </tr>`;
                        $('#orderTableBody').append(row);
                    });

                    // Show the order list content
                    $('#loginContainer').hide();
                    $('#orderListContent').show();
                    $('#logOutButton').show();
                } else {
                    console.error('Error fetching orders:', response.error);
                }
            },
            error: function (error) {
                console.error('Error fetching orders:', error);
            }
        });
    }

    // Attach event handlers
    $('#statusFilter, #sortOrder').on('change', renderOrderList);
    $('#password').on('keydown', function (event) {
        if (event.key === 'Enter') {
            attemptLogin();
        }
    });

    // Initial rendering
    renderOrderList();

    // Login function
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

    // Logout function
    function logOut() {
        isLoggedIn = false;
        $('#username').val('');
        $('#password').val('');
        $('#loginContainer').show();
        $('#orderListContent').hide();
        $('#logOutButton').hide();
    }

    // Attach login and logout event handlers
    $('#loginButton').click(attemptLogin);
    $('#logOutButton').click(logOut);
});
