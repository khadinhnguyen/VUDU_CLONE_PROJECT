const validation = {

    registerValidation(userInput) {
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

        if (userInput.email.length === 0){
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

        return errors;
    },

    loginValidation(userInput){
        var errors = {
            errorOccured : false,
        };

        if (userInput.userName.length === 0){
            errors.errorOccured = true;
            errors.userError = "* Please enter your user name";
        }
        if (userInput.password.length === 0){
            errors.errorOccured = true;
            errors.passwordError = "* Please enter your password";
        }
        return errors;
    }
}

module.exports = validation;