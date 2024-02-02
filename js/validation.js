$(document).ready(function () {

    function autoFormatCreditCard() {
        var enteredCreditCardNumber = $('#creditCard').val();
        var formattedCreditCardNumber = enteredCreditCardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        $('#creditCard').val(formattedCreditCardNumber);
    }

    // Initialize icons with grayscale filter
    $('.cardTypeIcon').css('filter', 'grayscale(100%)');

    $('#creditCard').on('input', function () {
        autoFormatCreditCard();

        // Detect card type and update the card type icons
        var enteredCreditCardNumber = $('#creditCard').val();
        var cardType = getCreditCardType(enteredCreditCardNumber);

        // Reset all icons to grayscale filter
        $('.cardTypeIcon').css('filter', 'grayscale(100%)');

        // Remove grayscale filter for the detected card type icon
        $('#' + cardType + 'Icon').css('filter', 'grayscale(0%)');
    });

    function validateCreditCard() {
        console.log("Entered validateCreditCard");

        var enteredCreditCardNumber = $('#creditCard').val();
        var firstDigit = enteredCreditCardNumber.charAt(0);

        // Your existing validation code...

        // Additional code to update card type icons without hiding them
        $('.cardTypeIcon').css('filter', 'grayscale(100%)'); // Reset grayscale filter

        if (firstDigit === '2') {
            $('#mastercardIcon').css('filter', 'grayscale(0%)'); // Remove grayscale filter for Mastercard icon
        } else if (firstDigit === '4') {
            $('#visaIcon').css('filter', 'grayscale(0%)'); // Remove grayscale filter for Visa icon
        } else if (firstDigit === '3') {
            $('#amexIcon').css('filter', 'grayscale(0%)'); // Remove grayscale filter for Amex icon
        }

        // Rest of your existing code...
    }

    // Mock implementation of getCreditCardType
    function getCreditCardType(creditCardNumber) {
        // Replace this with your actual implementation to detect card type
        // For simplicity, let's assume the first digit determines the card type
        var firstDigit = creditCardNumber.charAt(0);

        if (firstDigit === '2') {
            return 'mastercard';
        } else if (firstDigit === '4') {
            return 'visa';
        } else if (firstDigit === '3') {
            return 'amex';
        } else {
            return 'unknown';
        }
    }

    function validateCreditCard() {
        console.log("Entered validateCreditCard");

        var enteredCreditCardNumber = $('#creditCard').val();
        var firstDigit = enteredCreditCardNumber.charAt(0);

        var mastercardTestData = {
            testCreditCardNumber: '2982287198921273',
            testExpirationDate: '12/29',
            testSecurityCode: '987'
        };

        var visaTestDataExpired = {
            testCreditCardNumber: '4123982229822742',
            testExpirationDate: '09/20',
            testSecurityCode: '321'
        };

        var visaTestDataIncorrect = {
            testCreditCardNumber: '0879238719085783',
            testExpirationDate: '15/27',
            testSecurityCode: '782'
        };

        var amexTestData = {
            testCreditCardNumber: '3213082128732817',
            testExpirationDate: '04/28',
            testSecurityCode: '154'
        };

        var testScenario;
        var cardTypeLogo = $('#cardTypeLogo');

        if (firstDigit === '2') {
            testScenario = mastercardTestData;
            $('.cardTypeIcon').hide(); // Hide all icons
            $('#mastercardIcon').show(); // Show Mastercard icon
        } else if (firstDigit === '4') {
            if (isCardExpired(visaTestDataExpired.testExpirationDate)) {
                testScenario = visaTestDataExpired;
                $('.cardTypeIcon').hide(); // Hide all icons
                $('#visaIcon').show(); // Show Visa icon
            } else {
                testScenario = visaTestDataIncorrect;
                $('.cardTypeIcon').hide(); // Hide all icons
                $('#visaIcon').show(); // Show Visa icon
            }
        } else if (firstDigit === '3') {
            testScenario = amexTestData;
            $('.cardTypeIcon').hide(); // Hide all icons
            $('#amexIcon').show(); // Show Amex icon
        } else if (firstDigit === '0') {
            // For credit card numbers starting with '0', consider it as an incorrect card detail
            testScenario = visaTestDataIncorrect;
            $('.cardTypeIcon').hide(); // Hide all icons
            $('#visaIcon').show(); // Show Visa icon
        } else {
            alert('Invalid credit card number. Please enter a valid credit card number.');
            $('.cardTypeIcon').hide(); // Clear logo for invalid card type
            return;
        }

        // Basic validations
        if (!testScenario || !testScenario.testCreditCardNumber || !testScenario.testExpirationDate || !testScenario.testSecurityCode) {
            alert('Please provide valid test data for validation');
        } else {
            // Additional validations
            if (isCardExpired(testScenario.testExpirationDate)) {
                alert('Credit card is expired');
                return;
            }

            // Mock API endpoint for authorization (replace this with your actual API endpoint)
            // This is a simplified example using a mock response
            authorizeTransaction(testScenario.testCreditCardNumber, testScenario.testExpirationDate, testScenario.testSecurityCode)
                .then(function (response) {
                    console.log("Authorization response:", response);

                    if (response.Success) {
                        displaySuccessMessage(response);
                    } else {
                        if (response.Reason.includes('incorrect')) {
                            displayFailureMessage(response);
                        } else if (response.Reason.includes('Insufficient Funds')) {
                            displayInsufficientFundsMessage(response);
                        } else {
                            displayFailureMessage(response);
                        }
                    }
                })
                .catch(function (error) {
                    console.error('Error authorizing transaction:', error);
                });
        }
    }

    function isCardExpired(expirationDate) {
        // Add your logic to check if the card is expired
        // For simplicity, let's assume all future dates are valid
        var currentDate = new Date();
        var parts = expirationDate.split('/');
        var expirationMonth = parseInt(parts[0], 10);
        var expirationYear = parseInt(parts[1], 10) + 2000; // assuming 4-digit year

        return currentDate.getFullYear() > expirationYear || (currentDate.getFullYear() === expirationYear && currentDate.getMonth() + 1 > expirationMonth);
    }

    function authorizeTransaction(creditCardNumber, expirationDate, securityCode) {
        // Simulate an asynchronous request to a mock API endpoint
        // Replace this with your actual API endpoint for credit card authorization
        return new Promise(function (resolve) {
            if (creditCardNumber.startsWith('2982')) {
                resolve({
                    OrderId: 'ORD000123',
                    Success: true,
                    Reason: '',
                    AuthorizationToken: 'dGhpcyBpcyBhbiBhdXRoIHRva2Vu',
                    TokenExpirationDate: '2024-01-31T00:00:00.000',
                    AuthorizedAmount: 50.00
                });
            } else if (creditCardNumber.startsWith('4123')) {
                resolve({
                    OrderId: 'ORD000123',
                    Success: false,
                    Reason: 'Card Details incorrect or missing on Card Ending in XXXX',
                    AuthorizationToken: null,
                    TokenExpirationDate: null,
                    AuthorizedAmount: 0.00
                });
            } else if (creditCardNumber.startsWith('0879')) {
                resolve({
                    OrderId: 'ORD000123',
                    Success: false,
                    Reason: 'Incorrect Card Details on Card Ending in XXXX',
                    AuthorizationToken: null,
                    TokenExpirationDate: null,
                    AuthorizedAmount: 0.00
                });
            } else if (creditCardNumber.startsWith('3213')) {
                resolve({
                    OrderId: 'ORD000123',
                    Success: false,
                    Reason: 'Insufficient Funds on Card ending in XXXX',
                    AuthorizationToken: null,
                    TokenExpirationDate: null,
                    AuthorizedAmount: 0.00
                });
            } else {
                resolve({
                    OrderId: '',
                    Success: false,
                    Reason: 'Unknown scenario',
                    AuthorizationToken: null,
                    TokenExpirationDate: null,
                    AuthorizedAmount: 0.00
                });
            }
        });
    }

    function displaySuccessMessage(response) {
        var successMessage = 'SUCCESSFUL TRANSACTION:\n' +
            '  OrderId: ' + response.OrderId + '\n' +
            '  Success: ' + response.Success + '\n' +
            '  Reason: ' + response.Reason + '\n' +
            '  AuthorizationToken: ' + response.AuthorizationToken + '\n' +
            '  TokenExpirationDate: ' + response.TokenExpirationDate + '\n' +
            '  AuthorizedAmount: $' + response.AuthorizedAmount.toFixed(2);
        alert(successMessage);
    }

    function displayFailureMessage(response) {
        var failureMessage = 'INCORRECT DETAILS:\n' +
            '  OrderId: ' + response.OrderId + '\n' +
            '  Success: ' + response.Success + '\n' +
            '  Reason: ' + response.Reason + '\n' +
            '  AuthorizationToken: ' + response.AuthorizationToken + '\n' +
            '  TokenExpirationDate: ' + response.TokenExpirationDate + '\n' +
            '  AuthorizedAmount: $' + response.AuthorizedAmount.toFixed(2);
        alert(failureMessage);
    }

    function displayInsufficientFundsMessage(response) {
        var insufficientFundsMessage = 'INSUFFICIENT FUNDS:\n' +
            '  OrderId: ' + response.OrderId + '\n' +
            '  Success: ' + response.Success + '\n' +
            '  Reason: ' + response.Reason + '\n' +
            '  AuthorizationToken: ' + response.AuthorizationToken + '\n' +
            '  TokenExpirationDate: ' + response.TokenExpirationDate + '\n' +
            '  AuthorizedAmount: $' + response.AuthorizedAmount.toFixed(2);
        alert(insufficientFundsMessage);
    }

    $('#submitButton').click(validateCreditCard);

});
