// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // Add event listeners to detect when files are selected
    document.getElementById("followersFile").addEventListener("change", function () {
        console.log("Followers File Selected: ", this.files.length > 0 ? this.files[0].name : "No file selected");
    });

    document.getElementById("followingFile").addEventListener("change", function () {
        console.log("Following File Selected: ", this.files.length > 0 ? this.files[0].name : "No file selected");
    });

    // Add an event listener to the "Compare" button
    document.getElementById("compareBtn").addEventListener("click", function () {
        // Get the selected files from the file inputs
        const followersFile = document.getElementById("followersFile").files[0];
        const followingFile = document.getElementById("followingFile").files[0];

        // Check if both files are uploaded
        if (!followersFile || !followingFile) {
            alert("Please upload both files."); // Show an alert if files are missing
            return; // Stop execution
        }

        // Read the followers file first
        readFile(followersFile, function (followersHTML) {
            // Then read the following file
            readFile(followingFile, function (followingHTML) {
                // Extract usernames from both HTML files
                const followers = extractUsernames(followersHTML);
                const following = extractUsernames(followingHTML);

                // Identify users who do not follow back
                const notFollowingBack = following.filter(user => !followers.includes(user));

                // Display the results on the page
                displayResults(notFollowingBack);
            });
        });
    });

});

/**
 * Function to read the content of an uploaded file.
 * @param {File} file - The uploaded file.
 * @param {Function} callback - The function to call after reading the file.
 */
function readFile(file, callback) {
    const reader = new FileReader(); // Create a new FileReader object

    // When the file is fully read, execute the callback function with file content
    reader.onload = function (event) {
        callback(event.target.result);
    };

    // Read the file as text (since it's an HTML file)
    reader.readAsText(file);
}

/**
 * Function to extract Instagram usernames from an HTML string.
 * @param {string} html - The HTML content of the Instagram file.
 * @returns {Array} - An array of usernames extracted from the file.
 */
function extractUsernames(html) {
    const parser = new DOMParser(); // Create an HTML parser
    const doc = parser.parseFromString(html, "text/html"); // Parse the HTML content

    const usernames = []; // Array to store extracted usernames

    // Select all <a> elements that contain Instagram profile links
    doc.querySelectorAll("a[href*='instagram.com']").forEach(link => {
        const url = link.getAttribute("href"); // Get the href (URL)
        const username = url.split("/").pop(); // Extract the username from the URL

        // Add the username to the list if it's not empty
        if (username) usernames.push(username);
    });

    // Remove duplicate usernames using Set and return the list
    return [...new Set(usernames)];
}

/**
 * Function to display the results on the webpage.
 * @param {Array} notFollowingBack - List of users who do not follow back.
 */
function displayResults(notFollowingBack) {
    const resultsSection = document.getElementById("results"); // Get the results section
    const list = document.getElementById("notFollowingBackList"); // Get the list element
    const resultsHeader = document.getElementById("resultsHeader"); // Get the results header

    // Clear previous results
    list.innerHTML = "";

    // Update the header with the count of people who don't follow back
    resultsHeader.innerHTML = `${notFollowingBack.length} People Do Not Follow You Back`;

    // If there are no unfollowers, show a message
    if (notFollowingBack.length === 0) {
        list.innerHTML = "<li>Everyone follows you back!</li>";
    } else {
        // Otherwise, create a list of users who don't follow back
        notFollowingBack.forEach(username => {
            const li = document.createElement("li"); // Create a list item
            const link = document.createElement("a"); // Create an anchor tag

            link.href = `https://www.instagram.com/${username}/`; // Set the Instagram profile URL
            link.target = "_blank"; // Open in a new tab
            link.textContent = username; // set the text to the username
            link.style.textDecoration = "none"; // removes underline
            link.style.color = "#007bff"; //  makes it look clickable (Instagram blue)

            li.appendChild(link); // Add the link inside the list item
            list.appendChild(li); // Add the list item to the list
        });
    }

    // Make the results section visible
    resultsSection.style.display = "block";
}
