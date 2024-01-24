$(document).ready(function() {
    function validateCreditCard() {
        console.log("Entered validateCreditCard");

        // Get the credit card number entered by the user
        var enteredCreditCardNumber = $('#creditCard').val();

        // Determine the scenario based on the first digit of the credit card number
        var firstDigit = enteredCreditCardNumber.charAt(0);

        // Test Data for Successful Card (Mastercard)
        var mastercardTestData = {
            testCreditCardNumber: '2982287198921273',
            testExpirationDate: '12/29',
            testSecurityCode: '987'
        };

        // Test Data for Incorrect Card Details (Visa)
        var visaTestData = {
            testCreditCardNumber: '4123982229822742',
            testExpirationDate: '09/20',
            testSecurityCode: '321'
        };

        // Test Data for Insufficient Funds Card (AMEX)
        var amexTestData = {
            testCreditCardNumber: '3213082128732817',
            testExpirationDate: '04/28',
            testSecurityCode: '154'
        };

        // Choose test data based on the first digit of the entered credit card number
        var testScenario;
        if (firstDigit === '2') {
            testScenario = mastercardTestData;
        } else if (firstDigit === '4') {
            testScenario = visaTestData;
        } else if (firstDigit === '3') {
            testScenario = amexTestData;
        } else {
            alert('Invalid credit card number. Please enter a valid credit card number.');
            return; // Exit the function if invalid credit card number
        }

        // Basic validations
        if (!testScenario || !testScenario.testCreditCardNumber || !testScenario.testExpirationDate || !testScenario.testSecurityCode) {
            alert('Please provide valid test data for validation');
        } else {
            // Continue with validation using testScenario data

            console.log("Before calling authorizeTransaction");
            // Mock API endpoint for authorization using testScenario data
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

    // Attach the validation function to the button click event
    $('#submitButton').click(validateCreditCard);
});

// Placeholder for authorizeTransaction function
function authorizeTransaction(creditCardNumber, expirationDate, securityCode) {
    // This is a placeholder for the authorizeTransaction function
    // You can replace this with your actual implementation or leave it as is for testing
    return new Promise(function(resolve) {
        // Simulate a response based on the provided test data
        if (creditCardNumber.startsWith('2982')) {
            // Successful Card (Mastercard)
            resolve({
                OrderId: 'ORD000123',
                Success: true,
                Reason: '',
                AuthorizationToken: 'dGhpcyBpcyBhbiBhdXRoIHRva2Vu',
                TokenExpirationDate: '2024-01-31T00:00:00.000',
                AuthorizedAmount: 50.00
            });
        } else if (creditCardNumber.startsWith('4123')) {
            // Incorrect Card Details (Visa)
            resolve({
                OrderId: 'ORD000123',
                Success: false,
                Reason: 'Card Details incorrect or missing on Card Ending in XXXX',
                AuthorizationToken: null,
                TokenExpirationDate: null,
                AuthorizedAmount: 0.00
            });
        } else if (creditCardNumber.startsWith('3213')) {
            // Insufficient Funds Card (AMEX)
            resolve({
                OrderId: 'ORD000123',
                Success: false,
                Reason: 'Insufficient Funds on Card ending in XXXX',
                AuthorizationToken: null,
                TokenExpirationDate: null,
                AuthorizedAmount: 0.00
            });
        } else {
            // Default response for unknown scenarios
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

// Function to display success message
function displaySuccessMessage(response) {
    alert('SUCCESSFUL TRANSACTION:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}

// Function to display failure message
function displayFailureMessage(response) {
    alert('INCORRECT DETAILS:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Reason: ' + response.Reason + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}

// Function to display insufficient funds message
function displayInsufficientFundsMessage(response) {
    alert('INSUFFICIENT FUNDS:\n' +
        'OrderId: ' + response.OrderId + '\n' +
        'Reason: ' + response.Reason + '\n' +
        'Authorization Token: ' + response.AuthorizationToken + '\n' +
        'Authorization Amount: $' + response.AuthorizedAmount.toFixed(2) + '\n' +
        'Token Expiration Date: ' + response.TokenExpirationDate);
}
