$(document).ready(function() {
    function validateCreditCard() {
        console.log("Entered validateCreditCard");

        var enteredCreditCardNumber = $('#creditCard').val();

        var firstDigit = enteredCreditCardNumber.charAt(0);

        var mastercardTestData = {
            testCreditCardNumber: '2982287198921273',
            testExpirationDate: '12/29',
            testSecurityCode: '987'
        };

        var visaTestData = {
            testCreditCardNumber: '4123982229822742',
            testExpirationDate: '09/20',
            testSecurityCode: '321'
        };

        var amexTestData = {
            testCreditCardNumber: '3213082128732817',
            testExpirationDate: '04/28',
            testSecurityCode: '154'
        };

        var testScenario;
        if (firstDigit === '2') {
            testScenario = mastercardTestData;
        } else if (firstDigit === '4') {
            testScenario = visaTestData;
        } else if (firstDigit === '3') {
            testScenario = amexTestData;
        } else {
            alert('Invalid credit card number. Please enter a valid credit card number.');
            return;
        }

        if (!testScenario || !testScenario.testCreditCardNumber || !testScenario.testExpirationDate || !testScenario.testSecurityCode) {
            alert('Please provide valid test data for validation');
        } else {

            console.log("Before calling authorizeTransaction");
            authorizeTransaction(testScenario.testCreditCardNumber, testScenario.testExpirationDate, testScenario.testSecurityCode)
                .then(function(response) {
                    console.log("Authorization response:", response);

                    if (response.Success) {
                        displaySuccessMessage(response);
                    } else {
                        if (response.Reason.includes('Insufficient Funds')) {
                            displayInsufficientFundsMessage(response);
                        } else {
                            displayFailureMessage(response);
                        }
                    }
                })
                .catch(function(error) {
                    console.error('Error authorizing transaction:', error);
                });

            console.log("After calling authorizeTransaction");
        }
    }

    $('#submitButton').click(validateCreditCard);
});

function authorizeTransaction(creditCardNumber, expirationDate, securityCode) {
    return new Promise(function(resolve) {
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
    alert('SUCCESSFUL TRANSACTION:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}

function displayFailureMessage(response) {
    alert('INCORRECT DETAILS:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Reason: ' + response.Reason + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}

function displayInsufficientFundsMessage(response) {
    alert('INSUFFICIENT FUNDS:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Reason: ' + response.Reason + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}
