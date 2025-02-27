// Toast notification system
class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                this.container.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Modal dialog system
class Modal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 class="modal-title"></h2>
                <p class="modal-message"></p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-confirm">Confirmar</button>
                    <button class="modal-btn modal-cancel">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        this.modal.querySelector('.close').onclick = () => this.hide();
        this.modal.querySelector('.modal-cancel').onclick = () => this.hide();
    }

    show(title, message, onConfirm) {
        this.modal.querySelector('.modal-title').textContent = title;
        this.modal.querySelector('.modal-message').textContent = message;
        this.modal.querySelector('.modal-confirm').onclick = () => {
            onConfirm();
            this.hide();
        };
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
    }
}

// Form validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.toast = new Toast();
    }

    validate() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'Este campo es obligatorio');
            } else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
                isValid = false;
                this.showFieldError(field, field.title || 'Formato inválido');
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }
}

// Initialize components
const toast = new Toast();
const modal = new Modal();

// Add form validation to all forms
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const validator = new FormValidator(form);
        form.addEventListener('submit', (e) => {
            if (!validator.validate()) {
                e.preventDefault();
                toast.show('Por favor, completa todos los campos requeridos', 'error');
            }
        });
    });
});

// Export components for use in other files
window.toast = toast;
window.modal = modal;