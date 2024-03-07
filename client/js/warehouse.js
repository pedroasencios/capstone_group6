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
    });

    function attemptLoginWarehouse() {
        var enteredUsername = $('#usernameInput').val();
        var enteredPassword = $('#passwordInput').val();
        if (enteredUsername === "capstone" && enteredPassword === "pedro") {
            isLoggedIn = true;
            renderWarehouse();
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
            return;
        }

        $('#loginContainerWarehouse').hide();
        $('#warehouseContent').show();
    }
    
    renderWarehouse();
});
