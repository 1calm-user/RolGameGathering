fetch('../components/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                document.querySelector('#modificarP').classList.add('active');
            });

        // Character count updates
        document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(element => {
            const counter = element.nextElementSibling;
            if (counter && counter.classList.contains('character-count')) {
                element.addEventListener('input', function() {
                    counter.textContent = `${this.value.length}/${this.maxLength}`;
                });
            }
        });

        // Range slider value update
        const dexteritySlider = document.getElementById('dexterity');
        const rangeValue = dexteritySlider.nextElementSibling;
        dexteritySlider.addEventListener('input', function() {
            rangeValue.textContent = this.value;
        });

        // Form submission
        document.getElementById('modifyCharacterForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';

            try {
                const formData = new FormData(this);
                const response = await fetch('/api/characters/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                if (response.ok) {
                    toastr.success('Personaje modificado exitosamente');
                    setTimeout(() => window.location.href = 'verP.html', 2000);
                } else {
                    toastr.error('Error al modificar el personaje');
                }
            } catch (error) {
                toastr.error('Error de conexión');
                console.error('Error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Guardar Cambios';
            }
        });