document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

    document.getElementById('addButton').addEventListener('click', function() {
        console.log("Add button clicked");
    });

    document.getElementById('editButton').addEventListener('click', function() {
        console.log("Edit button clicked");
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        console.log("Delete button clicked");
    });
});

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan ='5'>No data</td></tr>";
    } 
}
