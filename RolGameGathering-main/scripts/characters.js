// Character management class
class CharacterManager {
    constructor() {
        this.characters = [];
        this.initializeEventListeners();
        this.loadCharacters();
    }

    initializeEventListeners() {
        // Form submissions
        const createForm = document.getElementById('createForm');
        const modifyForm = document.getElementById('modifyForm');
        const searchForm = document.getElementById('searchForm');

        if (createForm) createForm.addEventListener('submit', (e) => this.handleCreateSubmit(e));
        if (modifyForm) modifyForm.addEventListener('submit', (e) => this.handleModifySubmit(e));
        if (searchForm) searchForm.addEventListener('submit', (e) => this.handleSearch(e));

        // Table sorting
        const table = document.getElementById('charactersTable');
        if (table) {
            table.querySelectorAll('th').forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.onclick = () => this.sortTable(index);
            });
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    formatTableData(character) {
        return `
            <tr>
                <td>${character.nombre}</td>
                <td>${character.raza}</td>
                <td>${character.peso}</td>
                <td>${character.objetos}</td>
                <td>${character.habilidades}</td>
                <td>${character.destreza}</td>
                <td>
                    <a href="modificarP.html?id=${character.id}" class="btn-edit">Editar</a>
                    <button onclick="characterManager.deleteCharacter(${character.id})" class="btn-delete">Eliminar</button>
                </td>
            </tr>
        `;
    }

    sortTable(columnIndex) {
        const table = document.getElementById('charactersTable');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = table.querySelectorAll('th');
        
        const currentDirection = headers[columnIndex].getAttribute('data-sort') === 'asc' ? 'desc' : 'asc';
        headers.forEach(header => header.removeAttribute('data-sort'));
        headers[columnIndex].setAttribute('data-sort', currentDirection);

        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            return currentDirection === 'asc' ? 
                aValue.localeCompare(bValue) : 
                bValue.localeCompare(aValue);
        });

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }

    async deleteCharacter(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este personaje?')) return;

        try {
            const response = await fetch(`/api/characters/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar el personaje');

            this.showToast('Personaje eliminado con éxito', 'success');
            this.loadCharacters(); // Reload the table
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async loadCharacters() {
        const tableBody = document.querySelector('#charactersTable tbody');
        if (!tableBody) return;

        const loadingIndicator = document.createElement('tr');
        loadingIndicator.innerHTML = '<td colspan="7" class="loading">Cargando personajes...</td>';
        tableBody.appendChild(loadingIndicator);

        try {
            const response = await fetch('/api/characters');
            if (!response.ok) throw new Error('Error al cargar los personajes');

            this.characters = await response.json();
            tableBody.innerHTML = this.characters.map(char => this.formatTableData(char)).join('');
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="7" class="error">${error.message}</td></tr>`;
            this.showToast(error.message, 'error');
        }
    }

    async handleCreateSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const characterData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData)
            });

            if (!response.ok) throw new Error('Error al crear el personaje');

            this.showToast('Personaje creado con éxito', 'success');
            e.target.reset();
            await this.loadCharacters();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async handleModifySubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const characterData = Object.fromEntries(formData.entries());
        const characterId = document.getElementById('modifyCharacter').value;

        try {
            const response = await fetch(`/api/characters/${characterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData)
            });

            if (!response.ok) throw new Error('Error al modificar el personaje');

            this.showToast('Personaje modificado con éxito', 'success');
            await this.loadCharacters();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    handleSearch(e) {
        e.preventDefault();
        const name = document.getElementById('searchName').value.toLowerCase();
        const characterClass = document.getElementById('searchClass').value;

        const filteredCharacters = this.characters.filter(char => {
            const nameMatch = char.name.toLowerCase().includes(name);
            const classMatch = !characterClass || char.class === characterClass;
            return nameMatch && classMatch;
        });

        const tableBody = document.querySelector('#charactersTable tbody');
        if (tableBody) {
            tableBody.innerHTML = filteredCharacters.map(char => this.formatTableData(char)).join('');
        }
    }
}

// Initialize character manager when DOM is loaded
const characterManager = new CharacterManager();