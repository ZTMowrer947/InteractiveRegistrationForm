# InteractiveRegistrationForm

## Project Description
This project is about using JavaScript and jQuery to add interactivity and validation to an HTML form.

## Project Requirements
### Requirements being met
#### jQuery
- jQuery is used extensively throughout the project. (The requirements state that jQuery must be used in some form)

#### First field focus
- On page load, the "Name" field is given focus, ready to accept the user's input.

#### Job Role
- When "Other" is selected from the "Job Role" menu, the "Your Job Role" field appears.

#### T-Shirt Design
- When a new theme is selected from the "Design" menu, the "Color" menu is updated with the colors available for that design.
- Until a design is selected, the "Color" menu is hidden, instead displaying the message, "Please select a t-shirt theme".

#### Activities
- The user can't select two activities taking place at the same time.
- A running total cost appears below the activities, and is recalculated every time an activity is (de)selected.

#### Payment section
- The "Credit Card" payment option is selected by default.
- The payment option selected in the menu matches the payment option information displayed on the page, and vice versa.
- When a new payment method is selected, the other payment methods and the information pertaining to them are hidden. Only the chosen payment method is displayed.

#### Form Validation
- The form cannot be submitted until all of the following conditions are met:
  - Name field is not blank.
  - Email field contains a validly formatted e-mail address.
  - At least one activity is selected.
  - If "Credit Card" is the selected payment method:
    - Card number consists of 13 to 16 digits.
    - Zip Code consists of exactly 5 digits.
    - CVV consists of exactly 3 digits.
    
#### Form Validation Messages
- On submission, the form provides an error indication and/or message for each of the following fields:
  - Name field
  - Email field
  - Activity checkboxes
  - Credit Card Number, Zip Code, and CVV if "Credit Card" is the selected payment method

#### Form works with JavaScript disabled
- When JavaScript is disabled or otherwise not available, all forms fields and payment information are displayed.

### Requirements being exceeded
#### T-shirt Design
- The "Color" menu is hidden until an option from the "Design" menu is selected.

#### Form Validation
- The form also cannot be submitted until the following conditions are also met:
  - A valid payment method must be selected.
  - If the "My Job Role" field is displayed, it cannot be blank.
  
#### Form Validation Messages
- All fields have real time error messages that appear when they are changed.
- The following form fields have error messages that differ depending on the type of error:
  - Email (Blank, Invalid Email Address)
  - Credit Card Number, Zip Code, and CVV if "Credit Card" is selected payment option (Blank, Invalid format)
