// Modal Management
const userModal = document.getElementById('userModal');
const bookingModal = document.getElementById('bookingModal');
const userIcon = document.getElementById('userIcon');
const closeUserModal = document.getElementById('closeUserModal');
const closeBooking = document.getElementById('closeBooking');

// User modal controls
userIcon.addEventListener('click', () => {
    userModal.style.display = 'block';
});

closeUserModal.addEventListener('click', () => {
    userModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === userModal) userModal.style.display = 'none';
    if (e.target === bookingModal) bookingModal.style.display = 'none';
});

// Booking modal controls
closeBooking.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

// Toggle between login and signup
function toggleSignup() {
    const loginForm = document.getElementById('userContent');
    const signupForm = document.getElementById('signupContent');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Booking functions
function bookDestination(destination) {
    document.getElementById('bookingItem').value = destination;
    bookingModal.style.display = 'block';
    window.scrollTo(0, 0);
}

function bookHotel(hotel) {
    document.getElementById('bookingItem').value = hotel;
    bookingModal.style.display = 'block';
    window.scrollTo(0, 0);
}

function bookActivity(activity) {
    document.getElementById('bookingItem').value = activity;
    bookingModal.style.display = 'block';
    window.scrollTo(0, 0);
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login successful!');
            userModal.style.display = 'none';
            e.target.reset();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelectorAll('input[type="email"]')[0].value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert('Account created successfully! Please log in.');
            toggleSignup();
            e.target.reset();
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingData = {
        item: document.getElementById('bookingItem').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('phone').value,
        checkinDate: document.getElementById('checkinDate').value,
        checkoutDate: document.getElementById('checkoutDate').value,
        numGuests: document.getElementById('numGuests').value,
        specialRequests: document.getElementById('specialRequests').value,
        paymentMethod: document.getElementById('paymentMethod').value
    };

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Booking confirmed! Confirmation email has been sent.');
            bookingModal.style.display = 'none';
            e.target.reset();
        } else {
            alert(data.message || 'Booking failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Search form submission
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchData = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        travelers: document.getElementById('travelers').value
    };

    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
        });

        const data = await response.json();

        if (data.success) {
            // Display search results
            displaySearchResults(data.results);
        } else {
            alert(data.message || 'No results found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('input, textarea');
    const contactData = {
        name: inputs[0].value,
        email: inputs[1].value,
        message: inputs[2].value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        } else {
            alert(data.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Display search results
function displaySearchResults(results) {
    console.log('Search Results:', results);
    alert(`Found ${results.length} results for your search!`);
    // You can implement additional UI to display results
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        console.log('User logged in:', JSON.parse(user));
        // Update UI to show user is logged in
    }

    // Load initial data
    loadDestinations();
    loadHotels();
    loadActivities();
});

// Load destinations
async function loadDestinations() {
    try {
        const response = await fetch('/api/destinations');
        const data = await response.json();

        if (data.success) {
            const grid = document.getElementById('destinationGrid');
            grid.innerHTML = '';

            data.destinations.forEach(dest => {
                const item = createDestinationCard(dest);
                grid.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}

// Load hotels
async function loadHotels() {
    try {
        const response = await fetch('/api/hotels');
        const data = await response.json();

        if (data.success) {
            const grid = document.getElementById('hotelGrid');
            grid.innerHTML = '';

            data.hotels.forEach(hotel => {
                const item = createHotelCard(hotel);
                grid.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading hotels:', error);
    }
}

// Load activities
async function loadActivities() {
    try {
        const response = await fetch('/api/activities');
        const data = await response.json();

        if (data.success) {
            const grid = document.getElementById('activityGrid');
            grid.innerHTML = '';

            data.activities.forEach(activity => {
                const item = createActivityCard(activity);
                grid.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

// Create destination card
function createDestinationCard(dest) {
    const div = document.createElement('div');
    div.className = 'destination-item';
    div.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" />
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
        <span class="price">From $${dest.price}</span>
        <button class="book-btn" onclick="bookDestination('${dest.name}')">Book Now</button>
    `;
    return div;
}

// Create hotel card
function createHotelCard(hotel) {
    const div = document.createElement('div');
    div.className = 'destination-item';
    div.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}" />
        <h3>${hotel.name}</h3>
        <p>${hotel.description}</p>
        <div class="rating">${'⭐'.repeat(hotel.rating)}</div>
        <span class="price">From $${hotel.price}/night</span>
        <button class="book-btn" onclick="bookHotel('${hotel.name}')">Book Hotel</button>
    `;
    return div;
}

// Create activity card
function createActivityCard(activity) {
    const div = document.createElement('div');
    div.className = 'destination-item';
    div.innerHTML = `
        <img src="${activity.image}" alt="${activity.name}" />
        <h3>${activity.name}</h3>
        <p>${activity.description}</p>
        <span class="price">From $${activity.price}/person</span>
        <button class="book-btn" onclick="bookActivity('${activity.name}')">Book Activity</button>
    `;
    return div;
}

// Utility function to check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Utility function to get logged-in user
function getLoggedInUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('You have been logged out');
    location.reload();
}
