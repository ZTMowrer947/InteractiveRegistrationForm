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

	// When a activity checkbox is checked/unchecked,
	$activityCheckboxes.change(() => {
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
	});
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
