/*/////////////////////////////////////////////
	Treehouse Full-Stack JavaScript Techdegree
	Unit 3 Project: Interactive Form
/////////////////////////////////////////////*/

// Function to run when page finishes loading
const onPageLoad = () => {
	// Set focus on username field
	$("input#name").trigger("focus");
}

// Run onPageLoad function when page finishes loading
$(onPageLoad);
