$(document).ready(function () {
    var isLoggedIn = false;

    $('#submitButtonWarehouse').click(function () {
        var orderId = $('#orderIdWarehouse').val();
        var finalAmount = parseFloat($('#finalAmountWarehouse').val());
        // checks if orderid and finalamount are empty
        if (!orderId || isNaN(finalAmount)) {
            alert('Please enter a valid Order ID and Final Amount.');
            return;
        }
        // ajax will validate and update the status here
        $.ajax({
            url: 'http://localhost:5000/updateStatus',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ orderId: orderId, finalAmount: finalAmount }),
            success: function (response) {
                alert(response.success ? response.message : response.error);
            },
            error: function (error) {
                console.error('Error validating and settling order:', error);
            }
        });

        // After submitting, clear the input fields
        $('#orderIdWarehouse').val('');
        $('#finalAmountWarehouse').val('');
    });

    function attemptLoginWarehouse() {
        var enteredUsername = $('#usernameInput').val();
        var enteredPassword = $('#passwordInput').val();
        if (enteredUsername === "capstone" && enteredPassword === "pedro") {
            isLoggedIn = true;
            renderWarehouse();
            $('#logOutButtonWarehouse').show(); // Show logout button
            $('.button-back-warehouse').hide(); // Hide back button
        } else {
            alert("Incorrect username or password. Please try again.");
        }
    }

    function logOutWarehouse() {
        isLoggedIn = false;
        $('#usernameInput').val('');
        $('#passwordInput').val('');
        $('#loginContainerWarehouse').show();
        $('#warehouseContent').hide();
        $('#logOutButtonWarehouse').hide(); // Hide logout button
        $('.button-back-warehouse').show(); // Show back button
    }

    $('#loginButtonWarehouse').click(attemptLoginWarehouse);
    $('#logOutButtonWarehouse').click(logOutWarehouse);
    $('#passwordInput').on('keyup', function (event) {
        if (event.key === 'Enter') {
            attemptLoginWarehouse();
        }
    });

    function renderWarehouse() {
        if (!isLoggedIn) {
            $('#loginContainerWarehouse').show();
            $('#warehouseContent').hide();
            $('.button-back-warehouse').show(); // Show back button
            return;
        }

        $('#loginContainerWarehouse').hide();
        $('#warehouseContent').show();
        $('.button-back-warehouse').hide(); // Hide back button
    }
    
    // Initial setup: Hide logout button and back button
    $('#logOutButtonWarehouse').hide();
    $('.button-back-warehouse').hide();
    renderWarehouse();
});
