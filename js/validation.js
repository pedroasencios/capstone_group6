$(document).ready(function () {

    function autoFormatCreditCard() {
        var enteredCreditCardNumber = $('#creditCard').val();
        var formattedCreditCardNumber = enteredCreditCardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        $('#creditCard').val(formattedCreditCardNumber);
    }

    $('.cardTypeIcon').css('filter', 'grayscale(100%)');

    $('#creditCard').on('input', function () {
        autoFormatCreditCard();

        var enteredCreditCardNumber = $('#creditCard').val();
        var cardType = getCreditCardType(enteredCreditCardNumber);

        $('.cardTypeIcon').css('filter', 'grayscale(100%)');

        $('#' + cardType + 'Icon').css('filter', 'grayscale(0%)');
    });

    function validateCreditCard() {
        console.log("Entered validateCreditCard");

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

    }

    function getCreditCardType(creditCardNumber) {
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
            $('.cardTypeIcon').hide();
            $('#mastercardIcon').show();
        } else if (firstDigit === '4') {
            if (isCardExpired(visaTestDataExpired.testExpirationDate)) {
                testScenario = visaTestDataExpired;
                $('.cardTypeIcon').hide();
                $('#visaIcon').show();
            } else {
                testScenario = visaTestDataIncorrect;
                $('.cardTypeIcon').hide();
                $('#visaIcon').show();
            }
        } else if (firstDigit === '3') {
            testScenario = amexTestData;
            $('.cardTypeIcon').hide();
            $('#amexIcon').show();
        } else if (firstDigit === '0') {
            testScenario = visaTestDataIncorrect;
            $('.cardTypeIcon').hide();
            $('#visaIcon').show();
        } else {
            alert('Invalid credit card number. Please enter a valid credit card number.');
            $('.cardTypeIcon').hide();
            return;
        }

        if (!testScenario || !testScenario.testCreditCardNumber || !testScenario.testExpirationDate || !testScenario.testSecurityCode) {
            alert('Please provide valid test data for validation');
        } else {
            if (isCardExpired(testScenario.testExpirationDate)) {
                alert('Credit card is expired');
                return;
            }

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
        var currentDate = new Date();
        var parts = expirationDate.split('/');
        var expirationMonth = parseInt(parts[0], 10);
        var expirationYear = parseInt(parts[1], 10) + 2000;

        return currentDate.getFullYear() > expirationYear || (currentDate.getFullYear() === expirationYear && currentDate.getMonth() + 1 > expirationMonth);
    }

    function authorizeTransaction(creditCardNumber, expirationDate, securityCode) {
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
