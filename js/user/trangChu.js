fetch('./html/user/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        if (typeof initHeader === 'function') {
            initHeader();
        }
    });
fetch('./html/user/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

function toggleReturnDate() {
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;
    const returnDateContainer = document.getElementById('return-date-container');

    if (tripType === 'one-way') {
        returnDateContainer.style.opacity = '0.5';
        returnDateContainer.style.pointerEvents = 'none';
        document.getElementById('return-date').value = '';
    } else {
        returnDateContainer.style.opacity = '1';
        returnDateContainer.style.pointerEvents = 'auto';
    }
}

function togglePassengerDropdown(event) {
    if (event) event.stopPropagation();
    document.getElementById('passenger-dropdown').classList.toggle('show');
}

function closePassengerDropdown(event) {
    if (event) event.stopPropagation();
    document.getElementById('passenger-dropdown').classList.remove('show');
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('passenger-dropdown');
    const passengerInput = document.querySelector('.passenger-input');

    if (dropdown && dropdown.classList.contains('show') && !passengerInput.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

let adultCount = 1;
let childCount = 0;

function updateCount(type, delta) {
    if (type === 'adult') {
        adultCount += delta;
        if (adultCount < 1) adultCount = 1; // Minimum 1 adult
        document.getElementById('adult-count').innerText = adultCount;
    } else if (type === 'child') {
        childCount += delta;
        if (childCount < 0) childCount = 0; // Minimum 0 child
        document.getElementById('child-count').innerText = childCount;
    }

    document.getElementById('total-passengers').innerText = adultCount + childCount;
}

function searchFlights() {
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;
    const departureAirport = document.querySelectorAll('.location-input input')[0].value.trim();
    const arrivalAirport = document.querySelectorAll('.location-input input')[1].value.trim();
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;

    if (!departureAirport || !arrivalAirport || !departureDate) {
        alert("Vui lòng nhập đầy đủ thông tin hành trình (Sân bay đi, Sân bay đến, Ngày đi).");
        return;
    }

    if (departureAirport.toLowerCase() === arrivalAirport.toLowerCase()) {
        alert("Sân bay đi và sân bay đến không được trùng nhau.");
        return;
    }

    if (tripType === 'round-trip') {
        if (!returnDate) {
            alert("Vui lòng chọn ngày về.");
            return;
        }
        if (new Date(returnDate) < new Date(departureDate)) {
            alert("Ngày về phải sau ngày khởi hành.");
            return;
        }
    }

    if (adultCount === 0 && childCount > 0) {
        alert("Trẻ em phải đi cùng ít nhất một người lớn.");
        return;
    }

    document.querySelector('.route-info').innerHTML = `<strong>${departureAirport.toUpperCase()}</strong> <i class="fa-solid fa-arrow-right"></i> <strong>${arrivalAirport.toUpperCase()}</strong>`;

    let summaryText = `${formatDate(departureDate)} | ${adultCount} Người lớn`;
    if (childCount > 0) summaryText += `, ${childCount} Trẻ em`;
    document.querySelector('.meta-info').innerHTML = `<span id="summary-date">${summaryText}</span>`;

    const resultsSection = document.getElementById('search-results-section');
    resultsSection.style.display = 'block';

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

function showFlightDetails(flightCode, airline, aircraft) {
    document.getElementById('detail-flight-code').innerText = flightCode;
    document.getElementById('detail-airline').innerText = airline;
    document.getElementById('detail-aircraft').innerText = aircraft;

    const modal = document.getElementById('flight-details-modal');
    modal.classList.add('active');
}

function closeFlightDetails() {
    const modal = document.getElementById('flight-details-modal');
    modal.classList.remove('active');
}