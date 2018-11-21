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

// Function to run when page finishes loading
const onPageLoad = () => {
	// Get job role input field
	const $jobRoleInput = $("input#other-title");

	// Hide it by default
	$jobRoleInput.addClass("is-hidden");

	// Hide color select if no design selected
	hideColorSelectIfNoDesignSelected();

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
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
