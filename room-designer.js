// Room Designer State
const state = {
    currentTool: 'select',
    currentView: '3d',
    selectedItem: null,
    roomWidth: 500,
    roomLength: 500,
    roomHeight: 300,
    gridSize: 50,
    showGrid: true,
    camera: {
        rotation: 45,
        zoom: 1
    }
};

// Furniture data
const furnitureData = {
    seating: [
        { id: 'sofa1', name: 'Modern Sofa', image: './designyourspace-main/furniture1.png', width: 160, height: 80 },
        { id: 'sofa2', name: 'Sectional Sofa', image: './designyourspace-main/furniture2.png', width: 200, height: 120 },
        { id: 'chair1', name: 'Accent Chair', image: './designyourspace-main/furniture3.png', width: 80, height: 80 },
        { id: 'chair2', name: 'Dining Chair', image: './designyourspace-main/furniture4.png', width: 60, height: 60 },
    ],
    storage: [
        { id: 'cabinet1', name: 'TV Cabinet', image: './designyourspace-main/furniture5.png', width: 180, height: 60 },
        { id: 'shelf1', name: 'Bookshelf', image: './designyourspace-main/furniture6.png', width: 120, height: 180 },
        { id: 'drawer1', name: 'Drawer Unit', image: './designyourspace-main/furniture7.png', width: 100, height: 80 },
        { id: 'table1', name: 'Coffee Table', image: './designyourspace-main/furniture8.png', width: 120, height: 60 },
    ],
    beds: [
        { id: 'bed1', name: 'Double Bed', image: './designyourspace-main/furniture9.png', width: 200, height: 180 },
        { id: 'bed2', name: 'Single Bed', image: './designyourspace-main/furniture10.png', width: 120, height: 200 },
        { id: 'bed3', name: 'Kids Bed', image: './designyourspace-main/furniture11.png', width: 100, height: 180 },
    ],
    lighting: [
        { id: 'lamp1', name: 'Floor Lamp', image: './designyourspace-main/furniture12.png', width: 40, height: 120 },
        { id: 'lamp2', name: 'Table Lamp', image: './designyourspace-main/furniture13.png', width: 30, height: 60 },
        { id: 'chandelier', name: 'Chandelier', image: './designyourspace-main/furniture14.png', width: 80, height: 80 },
    ],
    decor: [
        { id: 'rug1', name: 'Area Rug', image: './designyourspace-main/furniture15.png', width: 200, height: 140 },
        { id: 'plant1', name: 'Indoor Plant', image: './designyourspace-main/furniture16.png', width: 60, height: 120 },
        { id: 'art1', name: 'Wall Art', image: './designyourspace-main/furniture17.png', width: 100, height: 80 },
        { id: 'mirror1', name: 'Mirror', image: './designyourspace-main/furniture18.png', width: 60, height: 100 },
        { id: 'vase1', name: 'Decorative Vase', image: './designyourspace-main/furniture19.png', width: 40, height: 60 },
        { id: 'clock1', name: 'Wall Clock', image: './designyourspace-main/furniture20.png', width: 40, height: 40 },
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeTools();
    initializeViewControls();
    initializeRoomSettings();
    initializeFurnitureItems();
    initializeInteractJS();
    setupEventListeners();
    updateRoom();
});

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', (e) => {
        const isDark = e.target.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initializeTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            state.currentTool = button.dataset.tool;
        });
    });
}

function initializeViewControls() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            state.currentView = button.dataset.view;
            updateRoom();
        });
    });
    
    document.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
        state.camera.zoom = Math.min(state.camera.zoom + 0.1, 2);
        updateRoom();
    });
    
    document.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
        state.camera.zoom = Math.max(state.camera.zoom - 0.1, 0.5);
        updateRoom();
    });
    
    document.querySelector('[data-action="rotate"]').addEventListener('click', () => {
        state.camera.rotation = (state.camera.rotation + 45) % 360;
        updateRoom();
    });
}

function initializeRoomSettings() {
    const roomInputs = {
        width: document.getElementById('room-width'),
        length: document.getElementById('room-length'),
        height: document.getElementById('room-height')
    };
    
    Object.entries(roomInputs).forEach(([dimension, input]) => {
        input.value = state[`room${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`];
        input.addEventListener('change', () => {
            state[`room${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`] = parseInt(input.value) || 500;
            updateRoom();
        });
    });
    
    const showGridCheckbox = document.getElementById('show-grid');
    showGridCheckbox.checked = state.showGrid;
    showGridCheckbox.addEventListener('change', (e) => {
        state.showGrid = e.target.checked;
        updateRoom();
    });
    
    const gridSizeInput = document.getElementById('grid-size');
    gridSizeInput.value = state.gridSize;
    gridSizeInput.addEventListener('change', (e) => {
        state.gridSize = parseInt(e.target.value) || 50;
        updateRoom();
    });
}

function initializeFurnitureItems() {
    const furnitureItems = document.querySelector('.furniture-items');
    furnitureItems.innerHTML = '';
    
    Object.values(furnitureData).flat().forEach(item => {
        const itemElement = createFurnitureItem(item);
        furnitureItems.appendChild(itemElement);
    });
}

function createFurnitureItem(item) {
    const div = document.createElement('div');
    div.className = 'furniture-item';
    div.dataset.id = item.id;
    div.dataset.width = item.width;
    div.dataset.height = item.height;
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" draggable="false">
        <p>${item.name}</p>
    `;
    
    return div;
}

function initializeInteractJS() {
    interact('.furniture-item').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: {
            start(event) {
                const clone = event.target.cloneNode(true);
                clone.classList.add('dragging-clone');
                clone.style.position = 'fixed';
                clone.style.zIndex = '1000';
                document.body.appendChild(clone);
                event.target.classList.add('dragging');
            },
            move(event) {
                const clone = document.querySelector('.dragging-clone');
                const x = (parseFloat(clone.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(clone.getAttribute('data-y')) || 0) + event.dy;
                
                clone.style.transform = `translate(${x}px, ${y}px)`;
                clone.setAttribute('data-x', x);
                clone.setAttribute('data-y', y);
            },
            end(event) {
                const clone = document.querySelector('.dragging-clone');
                const roomView = document.querySelector('.room-view');
                const roomRect = roomView.getBoundingClientRect();
                
                if (isOverRoom(clone, roomRect)) {
                    const roomContainer = document.querySelector('.room-container');
                    const roomContainerRect = roomContainer.getBoundingClientRect();
                    
                    const x = parseFloat(clone.getAttribute('data-x')) || 0;
                    const y = parseFloat(clone.getAttribute('data-y')) || 0;
                    
                    const roomX = x - roomContainerRect.left;
                    const roomY = y - roomContainerRect.top;
                    
                    const snappedX = state.showGrid ? Math.round(roomX / state.gridSize) * state.gridSize : roomX;
                    const snappedY = state.showGrid ? Math.round(roomY / state.gridSize) * state.gridSize : roomY;
                    
                    addFurnitureToRoom(event.target, {
                        x: snappedX,
                        y: snappedY
                    });
                }
                
                clone.remove();
                event.target.classList.remove('dragging');
            }
        }
    });

    interact('.draggable-furniture').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '.room-container',
                endOnly: true
            }),
            interact.modifiers.snap({
                targets: state.showGrid ? [
                    interact.snappers.grid({ x: state.gridSize, y: state.gridSize })
                ] : [],
                range: 10,
                relativePoints: [{ x: 0.5, y: 0.5 }]
            })
        ],
        listeners: {
            start(event) {
                selectFurniture(event.target);
            },
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                
                updateFurniturePosition(target, x, y);
                updatePropertyInputs(target);
            }
        }
    });
}

function isOverRoom(element, roomRect) {
    const elementRect = element.getBoundingClientRect();
    return !(elementRect.right < roomRect.left || 
             elementRect.left > roomRect.right || 
             elementRect.bottom < roomRect.top || 
             elementRect.top > roomRect.bottom);
}

function addFurnitureToRoom(sourceItem, position) {
    const roomContainer = document.querySelector('.room-container');
    const furnitureId = sourceItem.dataset.id;
    const furniture = Object.values(furnitureData).flat().find(item => item.id === furnitureId);
    
    if (!furniture) return;
    
    const furnitureElement = document.createElement('div');
    furnitureElement.className = 'draggable-furniture';
    furnitureElement.id = `furniture-${Date.now()}`;
    furnitureElement.dataset.type = furniture.id;
    furnitureElement.dataset.width = furniture.width;
    furnitureElement.dataset.height = furniture.height;
    
    furnitureElement.innerHTML = `<img src="${furniture.image}" alt="${furniture.name}" draggable="false">`;
    furnitureElement.style.width = `${furniture.width}px`;
    furnitureElement.style.height = `${furniture.height}px`;
    
    roomContainer.appendChild(furnitureElement);
    updateFurniturePosition(furnitureElement, position.x, position.y);
    makeFurnitureSelectable(furnitureElement);
}

function updateFurniturePosition(element, x, y) {
    const rotation = parseInt(element.dataset.rotation || '0');
    element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);
}

function selectFurniture(element) {
    if (state.selectedItem) {
        state.selectedItem.classList.remove('selected');
    }
    
    state.selectedItem = element;
    element.classList.add('selected');
    
    document.querySelector('.selected-item-controls').style.display = 'block';
    updatePropertyInputs(element);
}

function updatePropertyInputs(element) {
    const x = parseFloat(element.getAttribute('data-x')) || 0;
    const y = parseFloat(element.getAttribute('data-y')) || 0;
    const rotation = parseInt(element.dataset.rotation || '0');
    const width = parseInt(element.dataset.width || '0');
    const height = parseInt(element.dataset.height || '0');
    
    document.getElementById('pos-x').value = Math.round(x);
    document.getElementById('pos-y').value = Math.round(y);
    document.getElementById('rotation').value = rotation;
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
}

function makeFurnitureSelectable(element) {
    element.addEventListener('click', (e) => {
        if (state.currentTool === 'select') {
            e.stopPropagation();
            selectFurniture(element);
        }
    });
}

function updateRoom() {
    const container = document.querySelector('.room-container');
    
    container.style.width = `${state.roomWidth}px`;
    container.style.height = `${state.roomLength}px`;
    
    const walls = document.querySelectorAll('.room-wall-left, .room-wall-right');
    walls.forEach(wall => {
        wall.style.height = `${state.roomHeight}px`;
    });
    
    const gridElements = document.querySelectorAll('.room-floor::after, .room-wall-left::after, .room-wall-right::after');
    gridElements.forEach(element => {
        element.style.backgroundSize = `${state.gridSize}px ${state.gridSize}px`;
        element.style.opacity = state.showGrid ? '1' : '0';
    });
    
    if (state.currentView === '2d') {
        container.style.transform = `translate(-50%, -50%) rotateX(90deg) scale(${state.camera.zoom})`;
    } else if (state.currentView === '3d') {
        container.style.transform = `translate(-50%, -50%) rotateX(60deg) rotateZ(${-state.camera.rotation}deg) scale(${state.camera.zoom})`;
    } else {
        container.style.transform = `translate(-50%, -50%) rotateX(0deg) rotateZ(${-state.camera.rotation}deg) scale(${state.camera.zoom})`;
    }
}

function setupEventListeners() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterFurniture(category);
            
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
    
    document.querySelector('.room-view').addEventListener('click', () => {
        if (state.selectedItem && state.currentTool === 'select') {
            state.selectedItem.classList.remove('selected');
            state.selectedItem = null;
            document.querySelector('.selected-item-controls').style.display = 'none';
        }
    });
    
    const propertyInputs = ['pos-x', 'pos-y', 'rotation', 'width', 'height'];
    propertyInputs.forEach(id => {
        document.getElementById(id).addEventListener('change', updateSelectedItemFromInputs);
    });
    
    document.getElementById('rotate-left').addEventListener('click', () => {
        if (state.selectedItem) {
            const currentRotation = parseInt(state.selectedItem.dataset.rotation || '0');
            state.selectedItem.dataset.rotation = (currentRotation - 45) % 360;
            updateSelectedItemFromInputs();
        }
    });
    
    document.getElementById('rotate-right').addEventListener('click', () => {
        if (state.selectedItem) {
            const currentRotation = parseInt(state.selectedItem.dataset.rotation || '0');
            state.selectedItem.dataset.rotation = (currentRotation + 45) % 360;
            updateSelectedItemFromInputs();
        }
    });
    
    document.getElementById('delete-item').addEventListener('click', () => {
        if (state.selectedItem) {
            state.selectedItem.remove();
            state.selectedItem = null;
            document.querySelector('.selected-item-controls').style.display = 'none';
        }
    });
    
    document.getElementById('reset-room').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the room? This will remove all furniture.')) {
            document.querySelectorAll('.draggable-furniture').forEach(item => item.remove());
            state.selectedItem = null;
            document.querySelector('.selected-item-controls').style.display = 'none';
        }
    });
    
    document.getElementById('save-design').addEventListener('click', saveDesign);
    document.getElementById('share-design').addEventListener('click', shareDesign);
    document.getElementById('export-design').addEventListener('click', exportDesign);
}

function updateSelectedItemFromInputs() {
    if (!state.selectedItem) return;
    
    const x = parseFloat(document.getElementById('pos-x').value) || 0;
    const y = parseFloat(document.getElementById('pos-y').value) || 0;
    const rotation = parseInt(document.getElementById('rotation').value) || 0;
    const width = parseInt(document.getElementById('width').value) || 100;
    const height = parseInt(document.getElementById('height').value) || 100;
    
    state.selectedItem.dataset.rotation = rotation;
    state.selectedItem.dataset.width = width;
    state.selectedItem.dataset.height = height;
    state.selectedItem.style.width = `${width}px`;
    state.selectedItem.style.height = `${height}px`;
    
    updateFurniturePosition(state.selectedItem, x, y);
}

function filterFurniture(category) {
    const furnitureItems = document.querySelector('.furniture-items');
    furnitureItems.innerHTML = '';
    
    const items = category === 'all' ? 
        Object.values(furnitureData).flat() : 
        furnitureData[category] || [];
    
    items.forEach(item => {
        const itemElement = createFurnitureItem(item);
        furnitureItems.appendChild(itemElement);
    });
}

function saveDesign() {
    const design = {
        room: {
            width: state.roomWidth,
            length: state.roomLength,
            height: state.roomHeight
        },
        furniture: Array.from(document.querySelectorAll('.draggable-furniture')).map(item => ({
            type: item.dataset.type,
            x: parseFloat(item.getAttribute('data-x')) || 0,
            y: parseFloat(item.getAttribute('data-y')) || 0,
            rotation: parseInt(item.dataset.rotation || '0'),
            width: parseInt(item.dataset.width || '0'),
            height: parseInt(item.dataset.height || '0')
        }))
    };
    
    localStorage.setItem('roomDesign', JSON.stringify(design));
    alert('Design saved successfully!');
}

function shareDesign() {
    alert('Sharing functionality coming soon!');
}

function exportDesign() {
    const design = {
        room: {
            width: state.roomWidth,
            length: state.roomLength,
            height: state.roomHeight
        },
        furniture: Array.from(document.querySelectorAll('.draggable-furniture')).map(item => ({
            type: item.dataset.type,
            x: parseFloat(item.getAttribute('data-x')) || 0,
            y: parseFloat(item.getAttribute('data-y')) || 0,
            rotation: parseInt(item.dataset.rotation || '0'),
            width: parseInt(item.dataset.width || '0'),
            height: parseInt(item.dataset.height || '0')
        }))
    };
    
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-design.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 