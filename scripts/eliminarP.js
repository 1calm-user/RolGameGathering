// Load header component
fetch('../components/header.html')
.then(response => response.text())
.then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    document.querySelector('#eliminarP').classList.add('active');
})
.catch(error => {
    console.error('Error loading header:', error);
    showToast('Error al cargar el encabezado', true);
});

let personajeActual = null;

function showToast(message, isError = false) {
Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: isError ? "#ff4444" : "#00b09b",
    stopOnFocus: true
}).showToast();
}

function setLoading(button, isLoading) {
const buttonText = button.querySelector('.button-text');
const loader = button.querySelector('.loader');
button.disabled = isLoading;
buttonText.style.display = isLoading ? 'none' : 'block';
loader.style.display = isLoading ? 'block' : 'none';
}

function validarBusqueda() {
const searchInput = document.getElementById('searchInput');
const searchError = document.getElementById('searchError');
const value = searchInput.value.trim();

if (!value) {
    searchError.textContent = 'Por favor, ingrese un ID o nombre de personaje';
    return false;
}
searchError.textContent = '';
return true;
}

async function buscarPersonaje() {
if (!validarBusqueda()) return;

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput').value;
setLoading(searchButton, true);

try {
    const response = await fetch(`/buscar-personaje?query=${encodeURIComponent(searchInput)}`);
    const data = await response.json();

    if (data.success && data.personaje) {
        personajeActual = data.personaje;
        mostrarInformacionPersonaje(data.personaje);
    } else {
        showToast('Personaje no encontrado', true);
        document.getElementById('personajeInfo').style.display = 'none';
    }
} catch (error) {
    console.error('Error:', error);
    showToast('Error al buscar el personaje', true);
} finally {
    setLoading(searchButton, false);
}
}

function mostrarInformacionPersonaje(personaje) {
const detalles = document.getElementById('personajeDetalles');
detalles.innerHTML = `
    <div class="personaje-detalle">
        <p><strong>ID:</strong> ${personaje.id}</p>
        <p><strong>Nombre:</strong> ${personaje.nombre}</p>
        <p><strong>Clase:</strong> ${personaje.clase}</p>
        <p><strong>Nivel:</strong> ${personaje.nivel}</p>
        <p><strong>Raza:</strong> ${personaje.raza}</p>
    </div>
`;
document.getElementById('personajeInfo').style.display = 'block';
}

function mostrarConfirmacion() {
if (!personajeActual) return;
document.getElementById('confirmMessage').textContent = 
    `¿Está seguro que desea eliminar el personaje ${personajeActual.nombre}?`;
document.getElementById('confirmModal').style.display = 'block';
}

function cerrarModal() {
document.getElementById('confirmModal').style.display = 'none';
}

async function eliminarPersonaje() {
if (!personajeActual) return;

const deleteButton = document.querySelector('#confirmModal .delete-btn');
setLoading(deleteButton, true);

try {
    const response = await fetch('/eliminar-personaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: personajeActual.id })
    });

    const data = await response.json();

    if (data.success) {
        showToast('Personaje eliminado exitosamente');
        document.getElementById('searchInput').value = '';
        document.getElementById('personajeInfo').style.display = 'none';
        cerrarModal();
        personajeActual = null;
    } else {
        showToast('Error al eliminar el personaje: ' + data.message, true);
    }
} catch (error) {
    console.error('Error:', error);
    showToast('Error al eliminar el personaje', true);
} finally {
    setLoading(deleteButton, false);
}
}

// Event Listeners
document.getElementById('searchInput').addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
    buscarPersonaje();
}
});

// Close modal when clicking outside
window.onclick = function(event) {
const modal = document.getElementById('confirmModal');
if (event.target === modal) {
    cerrarModal();
}
}