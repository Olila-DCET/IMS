let inventory = [];

function openModal() {
    document.getElementById("itemModal").style.display = "block";
}

function closeModal() {
    document.getElementById("itemModal").style.display = "none";
    clearFields();
}

function addItem() {
    const name = document.getElementById('name').value;
    const details = document.getElementById('details').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('imageInput').files[0];

    if (name === '' || details === '' || quantity === '' || price === '' || !imageInput) {
        alert('Please fill all fields and upload an image');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageInput);
    reader.onload = function () {
        const dateAdded = new Date().toISOString(); // use ISO for better sorting
        const item = {
            id: Date.now(),
            name,
            details,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            dateAdded,
            image: reader.result
        };
        inventory.push(item);
        saveToLocalStorage();
        updateInventory();
        closeModal();
    };
}

function deleteItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    saveToLocalStorage();
    updateInventory();
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    document.getElementById('name').value = item.name;
    document.getElementById('details').value = item.details;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('price').value = item.price;

    deleteItem(id);
    openModal();
}

function updateInventory(items = inventory) {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '';

    items.forEach(item => {
        inventoryList.innerHTML += `
            <tr>
                <td><img src="${item.image}" alt="Item Image"></td>
                <td>${item.name}</td>
                <td>${item.details}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${new Date(item.dateAdded).toLocaleString()}</td>
                <td>
                    <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function searchItem() {
    const searchText = document.getElementById('search').value.toLowerCase();
    const filteredItems = inventory.filter(item => item.name.toLowerCase().includes(searchText));
    updateInventory(filteredItems);
}

function clearFields() {
    document.getElementById('name').value = '';
    document.getElementById('details').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const preview = document.getElementById('imagePreview');
        preview.src = reader.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function sortInventory() {
    const option = document.getElementById('sortOption').value;
    let sorted = [...inventory];

    switch (option) {
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'quantity':
            sorted.sort((a, b) => a.quantity - b.quantity);
            break;
        case 'price':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'date':
            sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        default:
            break;
    }

    updateInventory(sorted);
}

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('inventory');
    if (data) {
        inventory = JSON.parse(data);
        updateInventory();
    }
}

window.onload = loadFromLocalStorage;

window.onclick = function (event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        closeModal();
    }
};
