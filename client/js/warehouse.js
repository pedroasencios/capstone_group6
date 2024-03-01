$(document).ready(function () {
    $('#submitButtonWarehouse').click(function () {
        var orderId = $('#orderIdWarehouse').val();
        var finalAmount = parseFloat($('#finalAmountWarehouse').val());

        // checks if orderid and finalamount are empty
        if (!orderId || isNaN(finalAmount)) {
            alert('Please enter valid Order ID and Final Amount.');
            return;
        }

        // ajax will validate and update the status here
        $.ajax({
            url: 'http://localhost:5000/updateStatus', // Corrected URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ orderId: orderId, finalAmount: finalAmount }),
            success: function (response) {
                // Display the message received from the server
                alert(response.success ? response.message : response.error);
            },
            error: function (error) {
                console.error('Error validating and settling order:', error);
            }
        });
    });
});
