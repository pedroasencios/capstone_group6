$(document).ready(function () {

    function generateRandomOrderId() {
        return 'ORD' + ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    }

    $('#orderId').val(generateRandomOrderId());

    function autoFormatCreditCard() {
        var creditCardInput = $('#creditCard');
        detectCardType(creditCardInput.val().replace(/[^\d]/g, ''));

        var trimmedCreditCardNumber = creditCardInput.val().replace(/^\s+/, '');
        creditCardInput.val(trimmedCreditCardNumber);
    }

    function detectCardType(creditCardNumber) {
        var firstDigit = creditCardNumber.charAt(0);
        $('.cardTypeIcon').css('filter', 'grayscale(100%)');
        if (firstDigit === '2') {
            $('#mastercardIcon').css('filter', 'grayscale(0%)');
        } else if (firstDigit === '4') {
            $('#visaIcon').css('filter', 'grayscale(0%)');
        } else if (firstDigit === '3') {
            $('#amexIcon').css('filter', 'grayscale(0%)');
        }
    }

    $('.cardTypeIcon').css('filter', 'grayscale(100%)');

    $('#creditCard').on('input', function () {
        autoFormatCreditCard();
    });

    function validateCreditCard() {
        var enteredCreditCardNumber = $('#creditCard').val().trim();
        var enteredExpirationDate = $('#expirationDate').val().trim();
        var enteredCVV = $('#securityCode').val().trim();

        var fullApiResponse = {
            OrderId: $('#orderId').val(),
            Success: false,
            Reason: 'Invalid credit card number. Please enter a valid credit card number.',
            AuthorizationToken: null,
            TokenExpirationDate: null,
            AuthorizedAmount: 0.00
        };

        var requiredFields = ['#firstName', '#lastName', '#address', '#creditCard', '#expirationDate', '#securityCode', '#zipCode'];
        for (var i = 0; i < requiredFields.length; i++) {
            if ($(requiredFields[i]).val().trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }
        }

        if (enteredCreditCardNumber === '0879238719085783' && enteredExpirationDate === '15/27' && enteredCVV === '782') {
            fullApiResponse.Reason = 'Incorrect Card Details. Please try again.';
        } else if (enteredCreditCardNumber.startsWith('0')) {
            fullApiResponse.Reason = 'Incorrect Card Details. Please try again';
        } else if (parseInt(enteredExpirationDate.split('/')[0]) > 12) {
            fullApiResponse.Reason = 'Invalid expiration date month. Please enter a valid month.';
        } else if (enteredCreditCardNumber.charAt(0) === '3') {
            fullApiResponse.Reason = 'Insufficient funds. Please try again.';
        } else {
            if (isCardExpired(enteredExpirationDate)) {
                fullApiResponse.Reason = 'Your credit card is expired. Please try again.';
            } else {
                fullApiResponse.Success = true;
                fullApiResponse.Reason = 'Your order has been placed!';
                fullApiResponse.AuthorizationToken = 'dGhpcyBpcyBhbiBhdXRoIHRva2Vu';
                fullApiResponse.TokenExpirationDate = '2024-01-31T00:00:00.000';
                fullApiResponse.AuthorizedAmount = 50.00;
            }
        }

        var maskedCVV = enteredCVV.replace(/./g, '*');
        $('#securityCode').val(maskedCVV);

        var lastFourDigits = enteredCreditCardNumber.slice(-4);
        var maskedCreditCardNumber = '**** **** **** ' + lastFourDigits;
        $('#creditCard').val(maskedCreditCardNumber);

        sendToDatabase(fullApiResponse);
        displayUserMessage(fullApiResponse);
        $('#resetButton').show();
    }

    function resetForm() {
        $('#orderId').val(generateRandomOrderId());

        $('#firstName, #lastName, #address, #creditCard, #expirationDate, #securityCode, #zipCode').val('');

        $('#resetButton').hide();
    }

    // check with nicholas //
    function sendToDatabase(apiResponse) {
        console.log('Sending to database:', apiResponse);
    }

    function displayUserMessage(apiResponse) {
        var userMessage = 'OrderID: ' + apiResponse.OrderId +
            '\nSuccess: ' + apiResponse.Success +
            '\nReason: ' + apiResponse.Reason +
            '\nAmount: $' + apiResponse.AuthorizedAmount.toFixed(2);

        alert(userMessage);
    }

    function isCardExpired(expirationDate) {
        var currentDate = new Date();
        var parts = expirationDate.split('/');
        var expirationMonth = parseInt(parts[0], 10);
        var expirationYear = parseInt(parts[1], 10) + 2000;
        var cardExpirationDate = new Date(expirationYear, expirationMonth - 1, new Date(expirationYear, expirationMonth, 0).getDate());

        return currentDate > cardExpirationDate;
    }

    $('#submitButton').click(validateCreditCard);
    $('#resetButton').click(resetForm);
});
