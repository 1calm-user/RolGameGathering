// Load header component
fetch('../components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        // Update active state
        document.querySelector('#verP').classList.add('active');
    });