 // Load header component
 fetch('../components/header.html')
 .then(response => response.text())
 .then(data => {
     document.getElementById('header-placeholder').innerHTML = data;
     // Update active state
     document.querySelector('#login').classList.add('active');
 });

// Initialize form validation
const loginForm = document.getElementById('loginForm');
const validator = new FormValidator(loginForm);
const toast = new Toast();
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async (e) => {
 e.preventDefault();
 
 if (!validator.validate()) {
     toast.show('Por favor, complete todos los campos correctamente', 'error');
     return;
 }

 // Show loading state
 loginBtn.disabled = true;
 loginBtn.value = 'Iniciando sesión...';

 try {
     const response = await fetch('/login', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             email: document.getElementById('email').value,
             password: document.getElementById('pwd').value
         })
     });

     if (response.ok) {
         toast.show('Inicio de sesión exitoso', 'success');
         window.location.href = '/main.html';
     } else {
         const data = await response.json();
         toast.show(data.message || 'Error al iniciar sesión', 'error');
     }
 } catch (error) {
     toast.show('Error de conexión', 'error');
 } finally {
     loginBtn.disabled = false;
     loginBtn.value = 'Iniciar Sesión';
 }
});