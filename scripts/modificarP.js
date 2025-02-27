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
