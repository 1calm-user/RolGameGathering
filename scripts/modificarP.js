// Load header component
      fetch("../components/header.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("header-placeholder").innerHTML = data;
          document.querySelector("#modificarP").classList.add("active");
        });

      // Character count updates
      document
        .querySelectorAll("input[maxlength], textarea[maxlength]")
        .forEach((element) => {
          const counter = element.nextElementSibling;
          if (counter && counter.classList.contains("character-count")) {
            element.addEventListener("input", function () {
              counter.textContent = `${this.value.length}/${this.maxLength}`;
            });
          }
        });

      // Range slider value update
      const dexteritySlider = document.getElementById("dexterity");
      const rangeValue = dexteritySlider.nextElementSibling;
      dexteritySlider.addEventListener("input", function () {
        rangeValue.textContent = this.value;
      });

      document.addEventListener("DOMContentLoaded", function() {
        // Obtener el parámetro 'id' de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const charId = urlParams.get('id'); // Obtener el id del personaje desde la URL
        
        if (charId) {
            // Hacer una solicitud GET para obtener los datos del personaje
            fetch(`/api/characters/${charId}`)
                .then(response => response.json())
                .then(data => {
                  let objetos = data.objects;
                  objetos = objetos.split(" y ");
                    // Rellenar el formulario con los datos obtenidos
                    document.getElementById('char_id').value = data.char_id;  // Rellenar el campo oculto con el ID
                    document.getElementById('char_name').value = data.char_name;
                    document.getElementById('race').value = data.race;
                    document.getElementById('char_weight').value = data.char_weight;
                    document.getElementById('weapons').value = objetos[0];
                    document.getElementById('items').value = objetos[1];
                    document.getElementById('abilities').value = data.abilities;
                    document.getElementById('dexterity').value = data.dexterity;
                    document.querySelector('.range-value').textContent = data.dexterity;
                    document.querySelector('.character-count').textContent = `${data.char_name.length}/50`; // Para el nombre del personaje
                    document.querySelector('#items + .character-count').textContent = `${data.items.length}/100`; // Para los objetos
                    document.querySelector('#abilities + .character-count').textContent = `${data.abilities.length}/500`; // Para las habilidades
                    document.querySelector('#weapons + .character-count').textContent = `${data.weapons.length}/100`; // Para las armas
                })
                .catch(error => {
                    console.error('Error al obtener los datos del personaje:', error);
                    toastr.error('Error al cargar los datos del personaje');
                });
        } else {
            // Si no hay ID en la URL, mostrar un error o redirigir
            toastr.error('No se ha proporcionado un ID válido para editar');
            window.location.href = 'verP.html'; // Redirigir a otra página si no hay ID
        }
      });

      // Form submission
      document
        .getElementById("modifyCharacterForm")
        .addEventListener("submit", async function (e) {
          e.preventDefault();
          const submitBtn = document.getElementById("submitBtn");
          submitBtn.disabled = true;
          submitBtn.textContent = "Guardando...";

          try {
            const formData = {
              char_name: document.getElementById("char_name").value,
              race: document.getElementById("race").value,
              char_weight: document.getElementById("char_weight").value,
              objects:
                document.getElementById("weapons").value +
                " y " +
                document.getElementById("items").value,
              abilities: document.getElementById("abilities").value,
              dexterity: document.getElementById("dexterity").value,
            };
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            const response = await fetch("/api/characters/" + id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });

            if (response.ok) {
              toastr.success("Personaje modificado exitosamente");
              setTimeout(() => (window.location.href = "verP.html"), 2000);
            } else {
              toastr.error("Error al modificar el personaje");
            }
          } catch (error) {
            toastr.error("Error de conexión");
            console.error("Error:", error);
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Guardar Cambios";
          }
        });
