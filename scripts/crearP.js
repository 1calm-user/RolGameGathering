// Load header component
fetch('../components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        document.querySelector('#crearP').classList.add('active');
    });

// Initialize form validation
const form = document.getElementById('createCharacterForm');
const validator = new FormValidator(form);

// Configure toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};

// Update dexterity value display
const dexterityInput = document.getElementById('dexterity');
const dexterityValue = document.getElementById('dexterityValue');
dexterityInput.addEventListener('input', function () {
    dexterityValue.textContent = this.value;
});

// Add character count functionality
const textInputs = [document.getElementById('weapons'), document.getElementById('items')];
const textArea = document.getElementById('abilities');
const charName = document.getElementById('char_name');

function updateCharCount(element, maxLength) {
    const counter = element.nextElementSibling;
    counter.textContent = `${element.value.length}/${maxLength}`;
}

textInputs.forEach(input => {
    input.addEventListener('input', () => updateCharCount(input, 100));
});

textArea.addEventListener('input', () => updateCharCount(textArea, 500));
charName.addEventListener('input', () => updateCharCount(charName, 50));

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validator.validate()) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Creando...';

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/personajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                toastr.success('Personaje creado exitosamente');
                form.reset();
                // Reset all form states
                document.querySelectorAll('.character-count').forEach(counter => {
                    counter.textContent = counter.parentElement.querySelector('input, textarea').maxLength === 500 ? '0/500' : '0/100';
                });
                document.querySelector('#char_name + .character-count').textContent = '0/50';
                dexterityValue.textContent = '50';
                dexterityInput.value = 50;
            } else {
                throw new Error('Error al crear el personaje');
            }
        } catch (error) {
            toastr.error(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Crear Personaje';
        }
    }
});