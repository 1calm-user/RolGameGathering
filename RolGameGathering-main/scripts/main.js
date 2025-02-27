// Initialize Toast and Modal systems
const toast = new Toast();
const modal = new Modal();

// Form validators
const createFormValidator = new FormValidator(document.getElementById('createForm'));
const modifyFormValidator = new FormValidator(document.getElementById('modifyForm'));

// Form validation and character count
document.getElementById('abilities').addEventListener('input', function() {
    const maxLength = this.getAttribute('maxlength');
    const currentLength = this.value.length;
    this.nextElementSibling.textContent = `${currentLength}/${maxLength}`;
});

document.getElementById('dexterityRange').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('dexterity').value = value;
    this.nextElementSibling.textContent = value;
});

document.getElementById('dexterity').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('dexterityRange').value = value;
    document.getElementById('dexterityRange').nextElementSibling.textContent = value;
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Character manager is initialized in characters.js
    if (typeof characterManager !== 'undefined') {
        characterManager.loadCharacters();
    }
});