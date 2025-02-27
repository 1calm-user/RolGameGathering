 // Load header component
 fetch('../components/header.html')
 .then(response => response.text())
 .then(data => {
     document.getElementById('header-placeholder').innerHTML = data;
 });

// Tab switching functionality
document.querySelectorAll('.tab-button').forEach(button => {
 button.addEventListener('click', () => {
     // Update active button
     document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
     button.classList.add('active');

     // Show selected tab content
     document.querySelectorAll('.tab-content').forEach(content => {
         content.style.display = 'none';
     });
     document.getElementById(button.dataset.tab).style.display = 'block';
 });
});

// View toggle functionality
document.getElementById('tableView').addEventListener('click', () => {
 document.querySelector('.character-table').style.display = 'table';
 document.getElementById('characterCards').style.display = 'none';
 document.getElementById('tableView').classList.add('active');
 document.getElementById('cardView').classList.remove('active');
});

document.getElementById('cardView').addEventListener('click', () => {
 document.querySelector('.character-table').style.display = 'none';
 document.getElementById('characterCards').style.display = 'grid';
 document.getElementById('cardView').classList.add('active');
 document.getElementById('tableView').classList.remove('active');
});

// Sorting functionality
document.querySelectorAll('th[data-sort]').forEach(header => {
 header.addEventListener('click', () => {
     const sortBy = header.dataset.sort;
     const tbody = document.getElementById('characterTableBody');
     const rows = Array.from(tbody.getElementsByTagName('tr'));

     rows.sort((a, b) => {
         const aValue = a.querySelector(`[data-${sortBy}]`).dataset[sortBy];
         const bValue = b.querySelector(`[data-${sortBy}]`).dataset[sortBy];
         return aValue.localeCompare(bValue);
     });

     // Clear and repopulate table
     tbody.innerHTML = '';
     rows.forEach(row => tbody.appendChild(row));
 });
});