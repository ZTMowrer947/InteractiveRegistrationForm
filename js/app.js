/*/////////////////////////////////////////////
	Treehouse Full-Stack JavaScript Techdegree
	Unit 3 Project: Interactive Form
/////////////////////////////////////////////*/

// Function to run when page finishes loading
const onPageLoad = () => {
	// Get job role input field
	const $jobRoleInput = $("input#other-title");

	// Hide it by default
	$jobRoleInput.addClass("is-hidden");

	// Hide color select if no design has been selected
	if ($("select#design").prop("value") === "Select Theme") {
		$("select#color").addClass("is-hidden");
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
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
