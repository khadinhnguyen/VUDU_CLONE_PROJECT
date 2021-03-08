function registerValidation(userInput) {
    var errors = {
        errorOccured : false,
    };

    if (userInput.firstName.length < 2 || userInput.firstName.length > 30 || userInput.firstName === undefined){
        errors.errorOccured = true;
        errors.firstNameError = "* First name must be between 2 and 30 characters long";
    }

    if (userInput.lastName.length < 2 || userInput.lastName.length > 30 || userInput.lastName === undefined){
        errors.errorOccured = true;
        errors.lastNameError = "* Last name must be between 2 and 30 characters long";
    }

    if (userInput.email === undefined){
        errors.errorOccured = true;
        errors.emailError = "* Please enter your email address";
    }

    if (userInput.checker === undefined){
        errors.errorOccured = true;
        errors.checkerError = "* You must agree to the Terms and Policies and Privacy Policy";
    }

    if (userInput.password.length === 0){
        errors.errorOccured = true;
        errors.passwordError = "* Please enter your password";
    }

    console.log(userInput);

    return errors;


}

module.exports = registerValidation;