/* script.js */
// Sample Data

const destinationForm = document.getElementById('destinationForm');
const destinationsList = document.getElementById('destinationsList');

// Initialize destinations array if empty
let destinations = destinations || [
    { id: 1, name: 'Paris', country: 'France', price: 1200, description: 'City of Love' },
    { id: 2, name: 'Rome', country: 'Italy', price: 1100, description: 'Eternal City' }
];

let bookings = [
    { id: 1, destination: 'Paris', date: '2024-06-15', travelers: 2, status: 'Confirmed' }
];

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar a');

    // Function to update active state based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Update active state on scroll
    window.addEventListener('scroll', updateActiveLink);

    // Update active state when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Initialize Charts
function initializeCharts() {
    // Destinations Chart
    const destCtx = document.getElementById('destinationsChart').getContext('2d');
    new Chart(destCtx, {
        type: 'bar',
        data: {
            labels: destinations.map(d => d.name),
            datasets: [{
                label: 'Visitors',
                data: destinations.map(() => Math.floor(Math.random() * 1000)),
                backgroundColor: '#2196F3' 
            }]
        }
    });

    // Bookings Chart
    const bookCtx = document.getElementById('bookingsChart').getContext('2d');
    new Chart(bookCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Bookings',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#2196F3',
                tension: 0.1
            }]
        }
    });

    // Satisfaction Chart
    const satCtx = document.getElementById('satisfactionChart').getContext('2d');
    new Chart(satCtx, {
        type: 'pie',
        data: {
            labels: ['Excellent', 'Good', 'Average', 'Poor'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#2196F3', // Primary blue
                    '#64B5F6', // Lighter blue
                    '#90CAF9', // Even lighter blue
                    '#BBDEFB'  // Lightest blue
                ]
            }]
        }
    });
}

// CRUD Operations

// Create - Add new destination
function addDestination(e) {
    e.preventDefault();
    const newDest = {
        id: destinations.length + 1,
        name: document.getElementById('destName').value,
        country: document.getElementById('destCountry').value,
        price: parseFloat(document.getElementById('destPrice').value),
        description: document.getElementById('destDescription').value
    };
    destinations.push(newDest);
    renderDestinations();
    destinationForm.reset();
}

function addBooking(e) {
    e.preventDefault();
    const newBooking = {
        id: bookings.length + 1,
        destination: document.getElementById('bookingDestination').value,
        date: document.getElementById('bookingDate').value,
        travelers: parseInt(document.getElementById('travelers').value),
        status: 'Pending'
    };
    bookings.push(newBooking);
    renderBookings();
    e.target.reset();
}

// Read - Render destinations
function renderDestinations() {
    const container = document.getElementById('destinationsList');
    container.innerHTML = destinations.map(dest => `
        <div class="box" data-id="${dest.id}">
            <img src="/api/placeholder/400/300" alt="${dest.name}">
            <h3>${dest.name}, ${dest.country}</h3>
            <p>${dest.description}</p>
            <div class="price">€${dest.price}</div>
            <div class="icons">
                <a href="#" onclick="editDestination(${dest.id})" class="fas fa-edit"></a>
                <a href="#" onclick="deleteDestination(${dest.id})" class="fas fa-trash"></a>
            </div>
        </div>
    `).join('');
}

// Update - Edit destination
function editDestination(id) {
    const dest = destinations.find(d => d.id === id);
    if (dest) {
        document.getElementById('destName').value = dest.name;
        document.getElementById('destCountry').value = dest.country;
        document.getElementById('destPrice').value = dest.price;
        document.getElementById('destDescription').value = dest.description;

        // Change form submit button to update
        const submitBtn = destinationForm.querySelector('button');
        submitBtn.textContent = 'Update Destination';
        destinationForm.setAttribute('data-edit-id', id);

        // Change form submit handler
        destinationForm.removeEventListener('submit', addDestination);
        destinationForm.addEventListener('submit', updateDestination);
    }
}

function updateDestination(e) {
    e.preventDefault();
    const id = parseInt(destinationForm.getAttribute('data-edit-id'));
    const index = destinations.findIndex(d => d.id === id);

    if (index !== -1) {
        destinations[index] = {
            id: id,
            name: document.getElementById('destName').value,
            country: document.getElementById('destCountry').value,
            price: parseFloat(document.getElementById('destPrice').value),
            description: document.getElementById('destDescription').value
        };

        renderDestinations();
        destinationForm.reset();

        // Reset form to add mode
        const submitBtn = destinationForm.querySelector('button');
        submitBtn.textContent = 'Add Destination';
        destinationForm.removeAttribute('data-edit-id');
        destinationForm.removeEventListener('submit', updateDestination);
        destinationForm.addEventListener('submit', addDestination);
    }
}

// Delete - Remove destination
function deleteDestination(id) {
    if (confirm('Are you sure you want to delete this destination?')) {
        destinations = destinations.filter(d => d.id !== id);
        renderDestinations();
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function () {
    renderDestinations();
    destinationForm.addEventListener('submit', addDestination);
});

function renderBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.destination}</td>
            <td>${booking.date}</td>)
`).join('');
}
