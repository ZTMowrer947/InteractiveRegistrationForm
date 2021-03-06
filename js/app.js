/*/////////////////////////////////////////////
	Treehouse Full-Stack JavaScript Techdegree
	Unit 3 Project: Interactive Form
/////////////////////////////////////////////*/

/*/////////////////////////
	Regexes and Validation
/////////////////////////*/
// Regex for requiring a field (at least one of any character)
const requiredRegex = /^.+$/;

// Regex for email address format
const emailFormatRegex = /^[\w-+]+@[\w-]+(?:\.[\w]+)+/;

/*
	Creates a validator function from a regular expression, 
	with an error message if the input provided to the validator
	does not match the regex pattern.
*/
const createValidatorFromRegex = (regex, errorMessage) => {
    // Return a validator function taking an input parameter
    return $field => {
        // Test input against regex
        const inputIsValid = regex.test($field.val());

        // Throw error with given error message if input is invalid
        if (!inputIsValid) throw new Error(errorMessage);

        // Otherwise, we are good to go.
    };
};

/* 
	Run an array of validator functions for a given field.
	Validation errors are appended to the given error display element (if specified)
	or the label for the field (default).
*/
const runValidatorsForField = (
    $field,
    validators,
    $errorDisplay = undefined
) => {
    const $fieldLabel = $field.parent().is("label")
        ? $field.parent()
        : $(`label[for="${$field.attr("id")}"]`);

    // Remove validation errors from field (and error display if present)
    if ($errorDisplay) $errorDisplay.children(".validation-error").remove();
    $field.children(".validation-error").remove();

    // Try to do the following without errors
    try {
        // Run each validator on the field value
        validators.forEach(validator => validator($field));
    } catch (error) {
        // If an error is thrown, the field is invalid
        // Create error span
        const $errorSpan = $("<span></span>")
            .text(` ${error.message}`) // Set error message
            .addClass("validation-error"); // Add CSS class

        // Append error to error display element if it is defined
        if ($errorDisplay !== undefined) {
            // If defined, append to error display
            $errorSpan.appendTo($errorDisplay);

            // Set invalid class on error display
            $errorDisplay.addClass("is-invalid").removeClass("");
        }
        // Otherwise,
        else {
            // Insert error before field
            $errorSpan.insertBefore($field);

            // and set classes for invalid field and label
            $field.addClass("is-invalid").removeClass("is-valid");

            $fieldLabel.addClass("is-invalid").removeClass("is-valid");
        }

        // Stop here
        return;
    }

    // Otherwise, check if error display is present
    if ($errorDisplay !== undefined) {
        // If it is, set classes for validity on that
        $errorDisplay.addClass("is-valid").removeClass("is-invalid");
    }
    // Otherwise, set classes for valid field and label
    else {
        $field.addClass("is-valid").removeClass("is-invalid");

        $fieldLabel.addClass("is-valid").removeClass("is-invalid");
    }
};

/*
	The validators of the application.
*/
const validatorObjects = [
    {
        // Selector of field to validate
        field: "input#name",

        // Validators for that field
        validators: [
            createValidatorFromRegex(requiredRegex, "Name field is required.")
        ]
    },
    {
        field: "input#mail",
        validators: [
            createValidatorFromRegex(requiredRegex, "Email field is required."),
            createValidatorFromRegex(
                emailFormatRegex,
                "Email Address must be formatted as a valid email address."
            )
        ]
    },
    {
        // Selector for element used to insert element into DOM
        errorDisplay: $(".activities legend"),
        field: ".activities input[type='checkbox']",
        validators: [
            // Custom validator
            $activityCheckboxes => {
                let atLeastOneActivityIsChecked;

                $activityCheckboxes.each((index, activity) => {
                    if (activity.checked) {
                        atLeastOneActivityIsChecked = true;
                        return false;
                    }
                });

                // Ensure at least one activity must be selected
                if (!atLeastOneActivityIsChecked) {
                    throw new Error("At least one activity must be selected.");
                }
            }
        ]
    },
    {
        field: "select#payment",
        validators: [
            // Another custom validator, ensures a valid payment method is selected
            $paymentSelect => {
                if ($paymentSelect.val() === "select_method")
                    throw new Error("Please select a payment option.");
            }
        ]
    },
    {
        field: "input#cc-num",
        validators: [
            createValidatorFromRegex(requiredRegex, "Field is required."),
            createValidatorFromRegex(
                /^\d{13,16}$/,
                "Card Number must consist of 13 to 16 digits."
            )
        ],
        // Run validator only if this condition is met
        runIf: () => $("select#payment").val() === "credit card"
    },
    {
        field: "input#zip",
        validators: [
            createValidatorFromRegex(requiredRegex, "Field is required."),
            createValidatorFromRegex(
                /^\d{5}$/,
                "Zip Code must consist of exactly 5 digits."
            )
        ],
        runIf: () => $("select#payment").val() === "credit card"
    },
    {
        field: "input#cvv",
        validators: [
            createValidatorFromRegex(requiredRegex, "Field is required."),
            createValidatorFromRegex(
                /^\d{3}$/,
                "CVV must consist of exactly 3 digits."
            )
        ],
        runIf: () => $("select#payment").val() === "credit card"
    },
    {
        field: "input#other-title",
        validators: [
            createValidatorFromRegex(requiredRegex, "Field is required.")
        ],
        runIf: () => !$("input#other-title").hasClass("is-hidden"),
        errorDisplay: $("label[for='title']")
    }
];

/*////////////
	Functions
////////////*/
// Hide color select if no design has been selected
const hideColorSelectIfNoDesignSelected = () => {
    // If no design has been selected,
    if ($("select#design").prop("value") === "Select Theme") {
        // Hide color choices
        $("select#color").addClass("is-hidden");

        // Create message instructing user to select a t-shirt theme
        $("<p></p>")
            .text("Please select a t-shirt theme.")
            .attr("id", "no-design-sel")
            .insertAfter($("select#color"));
    } else {
        // Otherwise,
        // Remove the instructional message if present
        $("#no-design-sel").remove();

        // Show color choices
        $("select#color").removeClass("is-hidden");
    }
};

// Calculate cost of all checked activities
const getActivityCostSum = activities => {
    // From the given array of activity checkboxes, get only the ones that have been checked
    const checkedActivities = activities.filter(activity => activity.checked);

    // From the checked checkboxes, map the cost of each activity
    const activityCosts = checkedActivities.map(activity =>
        activity.name === "all" // If the activity is the main conference,
            ? 200 // The cost is $200
            : 100
    ); // Otherwise, it is $100

    // Add all of the activity costs together
    return (
        activityCosts
            // Perform a given function for each element, passing the result as the first parameter for the next element
            .reduce(
                // Adds the current value to the running total
                (total, current) => total + current,
                0
            )
    ); // Initial value if there are no checked checkboxes
};

// Toggle the status of checkboxes of activities conflicting with the given activity
const toggleConflictingActivityCheckbox = activity => {
    // Declare variable for the name of activity that needs toggling, if any do
    let nameOfactivityToToggle;

    // Consider the name of the toggled checkbox
    switch (activity.name) {
        // Toggle express if js-frameworks was selected
        case "js-frameworks":
            nameOfactivityToToggle = "express";
            break;

        // Toggle node.js if js-libs was selected
        case "js-libs":
            nameOfactivityToToggle = "node";
            break;

        // Toggle js-frameworks is express was selected
        case "express":
            nameOfactivityToToggle = "js-frameworks";
            break;

        // Toggle js-libs is node was selected
        case "node":
            nameOfactivityToToggle = "js-libs";
            break;
    }

    // If we are to toggle on activity
    if (nameOfactivityToToggle !== undefined) {
        // Get the activity to toggle (cousin of the checked/unchecked element)
        const $activityToToggle = $(activity)
            .parent()
            .siblings()
            .children(`input[name='${nameOfactivityToToggle}']`);

        // Toggle disabled status
        if (activity.checked)
            $activityToToggle
                .prop("disabled", "disabled") // Disable checkbox
                .parent()
                .addClass("is-disabled");
        // Set is-disabled on parent label
        else
            $activityToToggle
                .prop("disabled", false) // Enable checkbox
                .parent()
                .removeClass("is-disabled"); // Unset is-disabled on parent label
    }
};

// Show the proper payment information based on the payment method selected
const showProperPaymentMethod = paymentChoice => {
    // Replace spaces with hyphens (for credit card)
    paymentChoice = paymentChoice.replace(" ", "-");

    // Show the information for the selected payment method
    $(`div#${paymentChoice}`).removeClass("is-hidden");

    // Declare variable for payment methods to hide
    let paymentsToHide = [];

    // Consider selected payment method
    switch (paymentChoice) {
        // Paypal and bitcoin are hidden if credit card was selected
        case "credit-card":
            paymentsToHide = ["paypal", "bitcoin"];
            break;

        // Credit card and paypal if bitcoin was selected
        case "bitcoin":
            paymentsToHide = ["credit-card", "paypal"];
            break;

        // Credit card and bitcoin if paypal was selected
        case "paypal":
            paymentsToHide = ["credit-card", "bitcoin"];
            break;

        // All are hidden otherwise
        default:
            paymentsToHide = ["credit-card", "paypal", "bitcoin"];
            break;
    }

    // Hide each payment method
    paymentsToHide.forEach(paymentMethod => {
        $(`div#${paymentMethod}`).addClass("is-hidden");
    });
};

// Show the colors corresponding to the selected design
const showProperDesignColors = () => {
    // Hide color select if no design selected
    hideColorSelectIfNoDesignSelected();

    // Get color choices
    const $colorSelect = $("select#color");

    // Get design
    const design = $("select#design").val();

    // Consider design choice
    switch (design) {
        // If JS Puns design  was selected,
        case "js puns":
            // Get I <3 JS colors
            $colorSelect
                .children(":not(:contains('Puns'))")
                // Hide them
                .addClass("is-hidden")
                // Get JS Puns colors
                .siblings(":contains('Puns')")
                // Show them
                .removeClass("is-hidden");
            break;

        // If I <3 JS design was selected
        case "heart js":
            // Get JS Puns colors
            $colorSelect
                .children(":contains('Puns')")
                // Hide them
                .addClass("is-hidden")
                // Get I <3 JS colors
                .siblings(":not(:contains('Puns'))")
                // Show them
                .removeClass("is-hidden");
            break;
    }

    // Return design
    return design;
};

// Validates the form, returning whether the form was invalid
const validateForm = () => {
    // Remove all validation errors from previous runs
    $(".validation-error").remove();

    // Remove is-invalid class from all invalid fields
    $(".is-invalid").removeClass("is-invalid");

    // Iterate over each validator object
    validatorObjects.forEach(validatorObj => {
        // If there is no runIf condition, or if there is and it is met,
        if (validatorObj.runIf === undefined || validatorObj.runIf())
            runValidatorsForField(
                $(validatorObj.field),
                validatorObj.validators,
                validatorObj.errorDisplay
            );
        // Otherwise, don't run the validator
    });

    // Return whether any form field is invalid
    return $("input, select").is(".is-invalid");
};

// Validate a field using its selector
const validateField = (field, validatorObjects) => {
    // If there is a validation error from previous run, remove it
    if (
        $(field)
            .prev()
            .is(".validation-error")
    )
        $(field)
            .prev()
            .remove();

    // Get the selector for finding the proper validators
    const selector = `${field.tagName.toLowerCase()}#${field.id}`;

    // Find the proper validators
    const validatorObj = validatorObjects.find(val => val.field === selector);

    // If there are validators for this field, and its running conditions don't exist or are met, run them
    if (
        validatorObj !== undefined &&
        (validatorObj.runIf === undefined || validatorObj.runIf())
    )
        runValidatorsForField(
            $(selector),
            validatorObj.validators,
            validatorObj.errorDisplay
        );
};

// Function to run when page finishes loading
const onPageLoad = () => {
    // Disable HTML5 Validation
    $("form").attr("novalidate", true);

    // Activity checkbox inputs
    const $activityCheckboxes = $(".activities input[type='checkbox']");

    // Set initial total event cost to sum of checked checkboxes
    let totalActivityCost = getActivityCostSum($activityCheckboxes.get());

    // Create paragraph element to store running total
    const $activityTotal = $("<p></p>")
        .text(`Total: $${totalActivityCost}`)
        .attr("id", "activity-total")
        .appendTo($(".activities"));

    // Set status of conflicting activities
    $activityCheckboxes.each((index, checkbox) =>
        toggleConflictingActivityCheckbox(checkbox)
    );

    // Hide it if all activities are unchecked
    if (totalActivityCost === 0) $activityTotal.addClass("is-hidden");

    // Get job role input field
    const $jobRoleInput = $("input#other-title");

    // Hide it if job role is not set to "Other"
    if ($("select#title").val() !== "other")
        $jobRoleInput.addClass("is-hidden");

    // Select credit card by default
    if ($("select#payment").val() === "select_method")
        $("select#payment option[value='credit card']").prop(
            "selected",
            "selected"
        );

    showProperPaymentMethod($("select#payment").val());

    showProperDesignColors();

    // Set focus on username field
    $("input#name").trigger("focus");

    // Add change event listener for job title select
    $("select#title").on("change", event => {
        // Clear validity class and validation errors from field
        $("label[for='title']").removeClass("is-invalid");
        $("label[for='title']")
            .children(".validation-error")
            .remove();

        // If the new value is other,
        if (event.target.value === "other")
            // Show the job role field
            $jobRoleInput.removeClass("is-hidden");
        // Otherwise,
        // Hide it
        else $jobRoleInput.addClass("is-hidden");
    });

    // When a t-shirt theme is selected,
    $("select#design").on("change", event => {
        showProperDesignColors();

        // Get colors
        const $colorSelect = $("select#color");

        // Consider design choice, selecting the first option from either design
        switch (event.target.value) {
            // If JS Puns design  was selected,
            case "js puns":
                // Get JS Puns colors
                $colorSelect
                    .children(":contains('Puns')")
                    // Get the first JS Puns color
                    .first()
                    // Select it
                    .prop("selected", "selected");
                break;

            // If I <3 JS design was selected,
            case "heart js":
                // Get I <3 JS colors
                $colorSelect
                    .children(":not(:contains('Puns'))")
                    // Get the first I <3 JS color
                    .first()
                    // Select it
                    .prop("selected", "selected");
                break;
        }
    });

    // Show proper payment method info when one is selected
    $("select#payment").on("change", event =>
        showProperPaymentMethod(event.target.value)
    );

    // When a activity checkbox is checked/unchecked,
    $activityCheckboxes.on("change", event => {
        // Define selector for finding proper validators
        const selector = ".activities input[type='checkbox']";

        // Find proper validators
        const validatorObj = validatorObjects.find(
            val => val.field === selector
        );

        // Run them
        runValidatorsForField(
            $activityCheckboxes,
            validatorObj.validators,
            validatorObj.errorDisplay
        );

        // Recalculate total cost
        totalActivityCost = getActivityCostSum($activityCheckboxes.get());

        // If total cost is greater than 0 (at least one checkbox is checked)
        if (totalActivityCost > 0)
            // Show running total with total cost
            $("#activity-total")
                .removeClass("is-hidden")
                .text(`Total: $${totalActivityCost}`);
        // Hide running total
        else
            $("#activity-total")
                .addClass("is-hidden")
                .text("Total: $0");

        toggleConflictingActivityCheckbox(event.target);
    });

    // On form submission,
    $("form").on("submit", event => {
        // Validate the form and check its validity
        const formIsInvalid = validateForm();

        // Stop submission if form is invalid
        if (formIsInvalid) event.preventDefault();
    });

    // Validate all other fields when changed
    $("input:not([type='checkbox']").on("keyup change", event =>
        validateField(event.target, validatorObjects)
    );
    $("select").on("change", event =>
        validateField(event.target, validatorObjects)
    );
};

// Run onPageLoad function when page finishes loading
$(onPageLoad);
