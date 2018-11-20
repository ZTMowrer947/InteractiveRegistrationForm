/*/////////////////////////////////////////////
	Treehouse Full-Stack JavaScript Techdegree
	Unit 3 Project: Interactive Form
/////////////////////////////////////////////*/

// Function to run when page finishes loading
const onPageLoad = () => {
	// Hide job role input field
	$("input#other-title").hide();

	// Set focus on username field
	$("input#name").trigger("focus");

	// Add change event listener for job title select
	$("select#title").change(event => {
		// If the new value is other,
		if (event.target.value === "other") {
			// Show the job role field
			$("input#other-title").fadeIn();
		} else { // Otherwise,
			// Hide it
			$("input#other-title").fadeOut();
		}
	});
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
