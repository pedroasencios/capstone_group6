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

                    // sort by created_date
                    var sortOrder = $('#sortOrder').val();
                    filteredOrders.sort(function (a, b) {
                        var dateA = new Date(a.created_date);
                        var dateB = new Date(b.created_date);
                        if (sortOrder === 'asc') {
                            return dateA - dateB;
                        } else {
                            return dateB - dateA;
                        }
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
                        // Rendering token_exp_date
                        var formattedTokenExpDate = formatDate(order.token_exp_date, true);
                    
                        // Rendering created_date
                        var formattedCreatedDate = formatDate(order.created_date);
                    
                        var row = `<tr>
                            <td>${order.orderId}</td>
                            <td>${order.auth_token}</td>
                            <td>${formattedTokenExpDate}</td> <!-- Render token_exp_date -->
                            <td>${formattedCreatedDate}</td> <!-- Render created_date -->
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

    $('#statusFilter').on('change', renderOrderList);
    $('#filterTokenButton').click(renderOrderList);
    $('#filterExpirationDateButton').click(renderOrderList);
    $('#filterCreatedDateButton').click(renderOrderList);
    $('#clearFiltersButton').click(clearFilters);
    $('#tokenFilter, #expirationDateFilter, #createdDateFilter').on('keyup', function (event) {
        if (event.key === 'Enter') {
            renderOrderList();
        }
    });

    $('#sortOrder').on('change', renderOrderList);

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
            $('#goBackButton').hide();
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
        $('#goBackButton').show();
    }

    $('#loginButton').click(attemptLogin);
    $('#logOutButton').click(logOut);

    function formatDate(dateString, isTokenExpDate = false) {
        var date = new Date(dateString);
        var options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            second: 'numeric',
            hour12: true, // Display in 12-hour format
            timeZone: 'America/New_York' // Setting timezone to EST
        };
    
        // If it's token_exp_date, adjust the format
        if (isTokenExpDate) {
            var formattedDateTime = date.getFullYear() + '-' +
                        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + date.getDate()).slice(-2) + ', ' +
                        ('0' + date.getHours()).slice(-2) + ':' +
                        ('0' + date.getMinutes()).slice(-2) + ':' +
                        ('0' + date.getSeconds()).slice(-2) + ' ' +
                        (date.getHours() >= 12 ? 'PM' : 'AM');

            return formattedDateTime.replace(/\//g, '-'); // Replace slashes with dashes
        } else {
            // For created_date, manually format the date in EST
            var estOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
            var estTime = new Date(date.getTime() - estOffset);
            var formattedDateTime = date.getFullYear() + '-' +
                        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + date.getDate()).slice(-2) + ', ' +
                        ('0' + date.getHours()).slice(-2) + ':' +
                        ('0' + date.getMinutes()).slice(-2) + ':' +
                        ('0' + date.getSeconds()).slice(-2) + ' ' +
                        (date.getHours() >= 12 ? 'PM' : 'AM');

            return formattedDateTime.replace(/\//g, '-'); // Replace slashes with dashes
        }
    } 
});