/*/////////////////////////////////////////////
	Treehouse Full-Stack JavaScript Techdegree
	Unit 3 Project: Interactive Form
/////////////////////////////////////////////*/

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
	} else { // Otherwise,
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
		activity.name === "all" ? // If the activity is the main conference,
			200 :				  // The cost is $200
			100);				  // Otherwise, it is $100

	// Add all of the activity costs together
	return activityCosts
		// Perform a given function for each element, passing the result as the first parameter for the next element
		.reduce(
			// Adds the current value to the running total
			(total, current) => total + current,
		0); // Initial value if there are no checked checkboxes
}

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
		if (activity.checked) {
			$activityToToggle
				.prop("disabled", "disabled") // Disable checkbox
				.parent().addClass("is-disabled");	// Set is-disabled on parent label
		} else {
			$activityToToggle
				.prop("disabled", false)	// Enable checkbox
				.parent().removeClass("is-disabled");	// Unset is-disabled on parent label
		}
	}
}

// Show the proper payment information based on the payment method selected
const showProperPaymentMethod = paymentChoice => {
	// Replace spaces with hyphens (for credit card)
	paymentChoice = paymentChoice.replace(" ", "-");

	// Show the information for the selected payment method
	$(`div#${paymentChoice}`)
		.removeClass("is-hidden");

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
		$(`div#${paymentMethod}`)
			.addClass("is-hidden");
	});
}

/*
	Creates a validator function from a regular expression, 
	with an error message if the input provided to the validator
	does not match the regex pattern.
*/
const createValidatorFromRegex = (regex, errorMessage) => {
	// Return a validator function taking an input parameter
	return input => {
		// Test input against regex
		const inputIsValid = regex.test(input);

		// Throw error with given error message if input is invalid
		if (!inputIsValid) {
			throw new Error(errorMessage);
		}

		// Otherwise, we are good to go.
	};
}

// Run an array of validator functions for a given field.
const runValidatorsForField = ($field, validators) => {
	// Try to do the following without errors
	try {
		// Run each validator on the field value
		validators.forEach(validator =>
			validator($field.val()));
	} catch (error) { // If an error is thrown, the field is invalid 
		// Create error span
		const $errorSpan = $("<span></span>")
			.text(error.message) // Set error message
			.addClass("validation-error") // Add CSS class
			.insertAfter($field); // Insert after invalid field

		// Set classes for invalid field
		$field.addClass("is-invalid")
			.removeClass("is-valid");

		// Stop here
		return;
	}

	// Otherwise, set classes for valid field
	$field.addClass("is-valid")
		.removeClass("is-invalid")
		.siblings(".validation-error")
		.remove();
}

// Validates the form, returning whether the form was invalid
const validateForm = () => {
	// Return whether any form field is invalid
	return $("input, select").is(".is-invalid");
};

// Function to run when page finishes loading
const onPageLoad = () => {
	const $activityCheckboxes = $(".activities input[type='checkbox']");

	// Set initial total event cost to sum of checked checkboxes
	let totalActivityCost = getActivityCostSum(
		$activityCheckboxes.get());

	// Create paragraph element to store running total
	const $activityTotal = $("<p></p>")
		.text(`Total: $${totalActivityCost}`)
		.attr("id", "activity-total")
		.appendTo($(".activities"));

	// Set status of conflicting activities
	$activityCheckboxes.each((index, checkbox) => 
		toggleConflictingActivityCheckbox(checkbox))

	// Hide it if all activities are unchecked
	if (totalActivityCost === 0) {
		$activityTotal.addClass("is-hidden");
	}

	// Get job role input field
	const $jobRoleInput = $("input#other-title");

	// Hide it if job role is not set to "Other"
	if ($("select#title").val() !== "other") {
		$jobRoleInput.addClass("is-hidden");
	}

	// Hide color select if no design selected
	hideColorSelectIfNoDesignSelected();

	// Get color choices
	const $colorSelect = $("select#color");

	// Consider design choice
	switch ($("select#design").val()) {
		// If JS Puns design  was selected,
		case "js puns":
			// Get I <3 JS colors
			$colorSelect.children(":not(:contains('Puns'))")
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
			$colorSelect.children(":contains('Puns')")
				// Hide them
				.addClass("is-hidden")
				// Get I <3 JS colors
				.siblings(":not(:contains('Puns'))")
				// Show them
				.removeClass("is-hidden");
			break;
	}

	if ($("select#payment").val() === "select_method") {
		$("select#payment option[value='credit card']")
			.prop("selected", "selected");
	}

	showProperPaymentMethod($("select#payment").val());

	// Set focus on username field
	$("input#name").trigger("focus");

	// Add change event listener for job title select
	$("select#title").change(event => {
		// If the new value is other,
		if (event.target.value === "other") {
			// Show the job role field
			$jobRoleInput.removeClass("is-hidden");
		} else { // Otherwise,
			// Hide it
			$jobRoleInput.addClass("is-hidden");
		}
	});

	// When a t-shirt theme is selected,
	$("select#design").change(event => {
		// Hide color choices if no t-shirt theme has been selected
		hideColorSelectIfNoDesignSelected();

		// Get color choices
		const $colorSelect = $("select#color");

		// Consider design choice
		switch (event.target.value) {
			// If JS Puns design  was selected,
			case "js puns":
				// Get I <3 JS colors
				$colorSelect.children(":not(:contains('Puns'))")
					// Hide them
					.addClass("is-hidden")
					// Get JS Puns colors
					.siblings(":contains('Puns')")
					// Show them
					.removeClass("is-hidden")
					// Get the first JS Puns color
					.first()
					// Select it
					.prop("selected", "selected");
				break;

			// If I <3 JS design was selected
			case "heart js":
				// Get JS Puns colors
				$colorSelect.children(":contains('Puns')")
					// Hide them
					.addClass("is-hidden")
					// Get I <3 JS colors
					.siblings(":not(:contains('Puns'))")
					// Show them
					.removeClass("is-hidden")
					// Get the first I <3 JS color
					.first()
					// Select it
					.prop("selected", "selected");
				break;
		}
	});

	// Show proper payment method info when one is selected
	$("select#payment").change(event => 
		showProperPaymentMethod(event.target.value));

	// When a activity checkbox is checked/unchecked,
	$activityCheckboxes.change(event => {
		// Recalculate total cost
		totalActivityCost = getActivityCostSum($activityCheckboxes.get())

		// If total cost is greater than 0 (at least one checkbox is checked)
		if (totalActivityCost > 0) {
			// Show running total with total cost
			$("#activity-total").removeClass("is-hidden")
				.text(`Total: $${totalActivityCost}`);
		} else {
			// Hide running total
			$("#activity-total").addClass("is-hidden")
				.text("Total: $0");
		}

		toggleConflictingActivityCheckbox(event.target);
	});

	// On form submission,
	$("form").submit(event => {
		// Validate the form and check its validity
		const formIsInvalid = validateForm();

		// Stop submission if form is invalid
		if (formIsInvalid)
			event.preventDefault();
	})
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
