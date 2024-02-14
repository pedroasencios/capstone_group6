$(document).ready(function () {
    function generateRandomOrderId() {
        return 'ORD' + ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    }

    $('#orderId').val(generateRandomOrderId());

    function autoFormatCreditCard() {
        var creditCardInput = $('#creditCard');
        var cursorPosition = creditCardInput[0].selectionStart;
        var enteredCreditCardNumber = creditCardInput.val().replace(/[^\d]/g, '');
        var formattedCreditCardNumber = enteredCreditCardNumber.replace(/(\d{4})/g, '$1 ').trim();
        creditCardInput.val(formattedCreditCardNumber);
        var diff = formattedCreditCardNumber.length - enteredCreditCardNumber.length;
        cursorPosition += diff;
        creditCardInput[0].setSelectionRange(cursorPosition, cursorPosition);
        detectCardType(enteredCreditCardNumber);
    }

    function autoFormatSecurityCode() {
        var enteredSecurityCode = $('#securityCode').val().replace(/\s/g, '');
        var maskedSecurityCode = enteredSecurityCode.replace(/./g, '*');
        $('#securityCode').val(maskedSecurityCode);
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

    $('#securityCode').on('input', function () {
        autoFormatSecurityCode();
    });

    function validateCreditCard() {
        var enteredCreditCardNumber = $('#creditCard').val();
        var firstDigit = enteredCreditCardNumber.charAt(0);
        $('.cardTypeIcon').css('filter', 'grayscale(100%)');
        if (firstDigit === '2') {
            $('#mastercardIcon').css('filter', 'grayscale(0%)');
        } else if (firstDigit === '4') {
            $('#visaIcon').css('filter', 'grayscale(0%)');
        } else if (firstDigit === '3') {
            $('#amexIcon').css('filter', 'grayscale(0%)');
        }

        var fullApiResponse = {
            OrderId: $('#orderId').val(),
            Success: false,
            Reason: 'Invalid credit card number. Please enter a valid credit card number.',
            AuthorizationToken: null,
            TokenExpirationDate: null,
            AuthorizedAmount: 0.00
        };

        if (firstDigit === '2') {
            fullApiResponse.Success = true;
            fullApiResponse.Reason = 'Your order has been placed!';
            fullApiResponse.AuthorizationToken = 'dGhpcyBpcyBhbiBhdXRoIHRva2Vu';
            fullApiResponse.TokenExpirationDate = '2024-01-31T00:00:00.000';
            fullApiResponse.AuthorizedAmount = 50.00;
        } else if (firstDigit === '4') {
            if (isCardExpired('09/20')) {
                fullApiResponse.Reason = 'Your credit card is expired. Please try again.';
            } else {
                fullApiResponse.Reason = 'Incorrect card details or missing details. Please check your card and try again.';
            }
        } else if (firstDigit === '3') {
            fullApiResponse.Reason = 'Insufficient Funds. Please try again. ';
        }

        // here is where nicolas we will put the database where the full api message will be sent
        sendToDatabase(fullApiResponse);

        displayUserMessage(fullApiResponse);
    }

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
});
