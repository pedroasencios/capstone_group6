document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    // Initial data load


    // Event handler for a button with ID 'addButton'
    document.getElementById('addButton').addEventListener('click', function() {
        // Add your logic here for handling the 'add' button click
        console.log("Add button clicked");
    });

    // Event handler for a button with ID 'editButton'
    document.getElementById('editButton').addEventListener('click', function() {
        // Add your logic here for handling the 'edit' button click
        console.log("Edit button clicked");
    });

    // Event handler for a button with ID 'deleteButton'
    document.getElementById('deleteButton').addEventListener('click', function() {
        // Add your logic here for handling the 'delete' button click
        console.log("Delete button clicked");
    });

    // Add more event handlers as needed
});

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan ='5'>No data</td></tr>";
    } 
}
