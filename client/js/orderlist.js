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
    
        // grabs the orders from mysql server hosted on xampp
        $.ajax({
            url: 'http://localhost:5000/getAllOrders',
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    var orders = response.data;
                    var filteredOrders = orders.filter(function (order) {
                        return statusFilter === 'all' || order.status === statusFilter;
                    });

                    filteredOrders.sort(function (a, b) {
                        var aValue = new Date(a.created_date).toLocaleString();
                        var bValue = new Date(b.created_date).toLocaleString();
    
                        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                    });
    
                    // filter token
                    var tokenFilter = $('#tokenFilter').val().toLowerCase();
                    filteredOrders = filteredOrders.filter(function (order) {
                        return containsToken(order.auth_token, tokenFilter);
                    });
    
                    // filter the exp date
                    var expirationDateFilter = $('#expirationDateFilter').val().toLowerCase();
                    filteredOrders = filteredOrders.filter(function (order) {
                        return containsExpirationDate(order.token_exp_date, expirationDateFilter);
                    });
    
                    // filter createddate
                    var createdDateFilter = $('#createdDateFilter').val();
                    filteredOrders = filteredOrders.filter(function (order) {
                        return containsCreatedDate(order.created_date, createdDateFilter);
                    });

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

    function containsToken(authToken, tokenFilter) {
        return authToken.toLowerCase().includes(tokenFilter);
    }
    function containsExpirationDate(expirationDate, expirationDateFilter) {
        return expirationDate.toLowerCase().includes(expirationDateFilter);
    }
    function containsCreatedDate(createdDate) {
        var createdDateFilter = $('#createdDateFilter').val().toLowerCase();
        return createdDate.toLowerCase().includes(createdDateFilter);
    }
    function clearFilters() {
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('tokenFilter').value = '';
        document.getElementById('expirationDateFilter').value = '';
        document.getElementById('createdDateFilter').value = '';
        document.getElementById('sortOrder').value = 'asc';
        ['statusFilter', 'tokenFilter', 'expirationDateFilter', 'createdDateFilter', 'sortOrder'].forEach(function (elementId) {
            var element = document.getElementById(elementId);
            var event = new Event('change');
            element.dispatchEvent(event);
        });
    }

    $('#statusFilter, #sortOrder').on('change', renderOrderList);
    $('#filterTokenButton').click(renderOrderList);
    $('#filterExpirationDateButton').click(renderOrderList);
    $('#filterCreatedDateButton').click(renderOrderList);
    $('#clearFiltersButton').click(clearFilters);
    $('#tokenFilter, #expirationDateFilter, #createdDateFilter').on('keyup', function (event) {
        if (event.key === 'Enter') {
            renderOrderList();
        }
    });
    $('#createdDateHeader').click(function () {
        // Toggle the sort order between 'asc' and 'desc'
        var currentSortOrder = $('#sortOrder').val();
        var newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        $('#sortOrder').val(newSortOrder);
    
        // Trigger the renderOrderList function to update the order list
        renderOrderList();
    });

    $('#password').on('keyup', function (event) {
        if (event.key === 'Enter') {
            attemptLogin();
        }
    });

    renderOrderList();

    function attemptLogin() {
        var enteredUsername = $('#username').val();
        var enteredPassword = $('#password').val();
        if (enteredUsername === "capstone" && enteredPassword === "pedro") {
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
