$(document).ready(function () {

    function generateRandomOrderId() {
        console.log('Generated Order ID:', $('#orderId').val());
        return 'ORD' + ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    }

    $('#orderId').val(generateRandomOrderId());

    function generateCurrentDateTime() {
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
        console.log('Generated Date and Time:', formattedDate);
        return formattedDate;
    }
    

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
        var enteredExpirationDate = $('#expirationDate').val().trim();
        // checks if it is using a legit date
        if (!isValidExpirationDateFormat(enteredExpirationDate)) {
            alert('Invalid Expiration Date format. Please use MM/YY.');
            return;
        }

        if (isCardExpired(enteredExpirationDate)) {
            alert('Expired Card Details: Your card is expired. Please try again.');
            return;
        }

        var enteredCreditCardNumber = $('#creditCard').val().trim();
        console.log('Entered Credit Card Number:', enteredCreditCardNumber);

        var enteredCVV = $('#securityCode').val().trim();
    
        var successApiResponse = {
            cardType: 'Successful Card (Mastercard)',
            orderId: $('#orderId').val(),
            created_date: generateCurrentDateTime(),
            success: true,
            reason: 'Your order has been placed!',
            auth_token: 'dGhpcyBpcyBhbiBhdXRoIHRva2Vu',
            token_exp_date: '2024-01-31T00:00:00.000',
            auth_amount: 50.00
        };
    
        var incorrectDetailsApiResponse = {
            cardType: 'Incorrect Card Detail (Visa)',
            orderId: $('#orderId').val(),
            created_date: generateCurrentDateTime(),
            success: false,
            reason: 'Incorrect Card Details. Please try again.',
            auth_token: null,
            token_exp_date: null,
            auth_amount: 0.00
        };
    
        var insufficientFundsApiResponse = {
            cardType: 'Insufficient Funds Card (AMEX)',
            orderId: $('#orderId').val(),
            created_date: generateCurrentDateTime(),
            success: false,
            reason: 'Insufficient Funds on Card ending in 2817',
            auth_token: null,
            token_exp_date: null,
            auth_amount: 0.00
        };
        
        var requiredFields = ['#firstName', '#lastName', '#address', '#creditCard', '#expirationDate', '#securityCode', '#zipCode'];
        for (var i = 0; i < requiredFields.length; i++) {
            if ($(requiredFields[i]).val().trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }
        }
    
        var selectedApiResponse;
            if (enteredCreditCardNumber.charAt(0) === '0' && enteredExpirationDate === '15/27' && enteredCVV === '782') {
                console.log('Incorrect Card Details. Please try again.');
                incorrectDetailsApiResponse.Reason = 'Incorrect Card Details. Please try again.';
                selectedApiResponse = incorrectDetailsApiResponse;
            } else if (enteredCreditCardNumber.startsWith('2')) {
                console.log('Successful Card (Mastercard)');
                successApiResponse.success = true;
                selectedApiResponse = successApiResponse;
            } else if (enteredCreditCardNumber.startsWith('3')) {
                console.log('Insufficient Funds Card (AMEX)');
                insufficientFundsApiResponse.Reason = 'Insufficient funds. Please try again.';
                selectedApiResponse = insufficientFundsApiResponse;
            } else {
                console.log('Unrecognized Card Type');
                selectedApiResponse = {
                    cardType: 'Unrecognized Card Type',
                    orderId: $('#orderId').val(),
                    created_date: generateCurrentDateTime(),
                    success: false,
                    reason: 'Invalid or unrecognized card details.',
                    auth_token: null,
                    token_exp_date: null,
                    auth_amount: 0.00
                };
        }
    
        var maskedCVV = enteredCVV.replace(/./g, '*');
        $('#securityCode').val(maskedCVV);
    
        var lastFourDigits = enteredCreditCardNumber.slice(-4);
        var maskedCreditCardNumber = '**** **** **** ' + lastFourDigits;
        $('#creditCard').val(maskedCreditCardNumber);
    
        sendToDatabase(selectedApiResponse);
        displayUserMessage(selectedApiResponse);
        $('#resetButton').show();
    }
    
    function resetForm() {
        $('#orderId').val(generateRandomOrderId());

        $('#firstName, #lastName, #address, #creditCard, #expirationDate, #securityCode, #zipCode').val('');

        $('#resetButton').hide();
    }

    // check with nicholas //
    function sendToDatabase(apiResponse) {
        // here is where it will concatenate 
        var authorizationToken = apiResponse.orderId + '_' + apiResponse.auth_token;
    
        // directs it to the correct data
        apiResponse.auth_token = authorizationToken;

        $.ajax({
            url: 'http://localhost:5000/insert',  // Replace with your server endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(apiResponse),
            success: function (response) {
                console.log('Data sent to database successfully:', response);
            },
            error: function (error) {
                console.error('Error sending data to database:', error);
            }
        });
    }

    function displayUserMessage(apiResponse) {
        var userMessage;
    
        if (apiResponse.cardType === 'Incorrect Card Detail (Visa)' || apiResponse.cardType === 'Unrecognized Card Type') {
            userMessage = 'OrderID: ' + apiResponse.orderId +
                '\nSuccess: ' + apiResponse.success +
                '\nReason: ' + apiResponse.reason;
        } else if (apiResponse.cardType === 'Successful Card (Mastercard)') {
            userMessage = 'OrderID: ' + apiResponse.orderId +
                '\nSuccess: ' + apiResponse.success +
                '\nReason: ' + apiResponse.reason +
                '\nAmount: $' + apiResponse.auth_amount.toFixed(2);
        } else if (apiResponse.cardType === 'Expired Card Details (Visa)') {
            userMessage = 'OrderID: ' + apiResponse.orderId +
                '\nSuccess: ' + apiResponse.success +
                '\nReason: ' + apiResponse.reason;
        } else if (apiResponse.cardType === 'Insufficient Funds Card (AMEX)') {
            userMessage = 'OrderID: ' + apiResponse.orderId +
                '\nSuccess: ' + apiResponse.success +
                '\nReason: ' + apiResponse.reason;
        } else {
            userMessage = 'Invalid card response.';
        }
    
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

    function isValidExpirationDateFormat(expirationDate) {
        var regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return regex.test(expirationDate);
    }

    $('#submitButton').click(validateCreditCard);
    $('#resetButton').click(resetForm);
});
