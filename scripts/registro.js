 // Load header component
 fetch('../components/header-auth.html')
 .then(response => response.text())
 .then(data => {
     document.getElementById('header-placeholder').innerHTML = data;
 });

// Character count updates
document.querySelectorAll('input[maxlength]').forEach(element => {
 const counter = element.nextElementSibling;
 if (counter && counter.classList.contains('character-count')) {
     element.addEventListener('input', function() {
         counter.textContent = `${this.value.length}/${this.maxLength}`;
     });
 }
});

// Password validation
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const requirements = {
 length: /.{8,}/,
 uppercase: /[A-Z]/,
 lowercase: /[a-z]/,
 number: /[0-9]/,
 special: /[^A-Za-z0-9]/
};

password.addEventListener('input', function() {
 Object.keys(requirements).forEach(req => {
     const element = document.getElementById(req);
     if (requirements[req].test(this.value)) {
         element.classList.add('valid');
     } else {
         element.classList.remove('valid');
     }
 });
});

// Form submission
document.getElementById('registroForm').addEventListener('submit', async function(e) {
 e.preventDefault();
 const submitBtn = document.getElementById('submitBtn');
 
 // Validate password match
 if (password.value !== confirmPassword.value) {
     toastr.error('Las contraseñas no coinciden');
     return;
 }

 // Validate password requirements
 for (const [key, regex] of Object.entries(requirements)) {
     if (!regex.test(password.value)) {
         toastr.error('La contraseña no cumple con todos los requisitos');
         return;
     }
 }

 submitBtn.disabled = true;
 submitBtn.textContent = 'Registrando...';

 try {
     const formData = new FormData(this);
     const response = await fetch('/api/register', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(Object.fromEntries(formData))
     });

     if (response.ok) {
         toastr.success('Registro exitoso');
         setTimeout(() => window.location.href = 'login.html', 2000);
     } else {
         const data = await response.json();
         toastr.error(data.message || 'Error en el registro');
     }
 } catch (error) {
     toastr.error('Error de conexión');
     console.error('Error:', error);
 } finally {
     submitBtn.disabled = false;
     submitBtn.textContent = 'Registrarse';
 }
});