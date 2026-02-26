// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    const countryCodeSelect = document.getElementById('countryCode');
    if (countryCodeSelect) {
        loadCountryCodes();
    }

    setupNotifyForm();
});

let countriesData = [];

// Public GitHub URL for country codes JSON
const COUNTRY_JSON_URL = 'https://raw.githubusercontent.com/kkrishnakrr/public-assets/refs/heads/main/json/country-code.json';

function setupNotifyForm() {
    const notifyForm = document.getElementById('notifyForm');
    const notifyEmail = document.getElementById('notifyEmail');
    const notifyStatus = document.getElementById('notifyStatus');

    if (!notifyForm || !notifyEmail || !notifyStatus) {
        return;
    }

    notifyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!notifyEmail.checkValidity()) {
            notifyStatus.textContent = 'Please enter a valid email address.';
            notifyStatus.classList.add('error');
            notifyEmail.focus();
            return;
        }

        notifyStatus.textContent = "Thanks. We'll keep you posted.";
        notifyStatus.classList.remove('error');
        notifyForm.reset();
    });
}

function loadCountryCodes() {
    fetch(COUNTRY_JSON_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            countriesData = data;
            populateCountryDropdown();
        })
        .catch(error => {
            console.error('Error loading country codes:', error);
            // Fallback to basic dropdown with popular countries
            createFallbackDropdown();
        });
}

function populateCountryDropdown() {
    const select = document.getElementById('countryCode');
    if (!select) {
        console.error('Country code select element not found');
        return;
    }
    
    select.innerHTML = '';
    
    // Sort countries alphabetically
    countriesData.sort((a, b) => a.name.localeCompare(b.name));
    
    // Add each country as an option
    countriesData.forEach(country => {
        const option = document.createElement('option');
        const dialCode = country.dial_code.replace(/\s/g, ''); // Remove spaces from dial code
        option.value = dialCode;
        option.textContent = `${country.emoji} ${country.name} ${country.dial_code}`;
        
        // Set India as default selected
        if (country.name === 'India') {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
    
    console.log('Country dropdown populated with', countriesData.length, 'countries');
}

function createFallbackDropdown() {
    const select = document.getElementById('countryCode');
    if (!select) return;
    
    const fallbackCountries = [
        {emoji: '🇮🇳', code: 'IN', dial_code: '+91', name: 'India'},
        {emoji: '🇺🇸', code: 'US', dial_code: '+1', name: 'United States'},
        {emoji: '🇬🇧', code: 'GB', dial_code: '+44', name: 'United Kingdom'},
        {emoji: '🇦🇪', code: 'AE', dial_code: '+971', name: 'UAE'},
        {emoji: '🇸🇬', code: 'SG', dial_code: '+65', name: 'Singapore'},
        {emoji: '🇦🇺', code: 'AU', dial_code: '+61', name: 'Australia'},
        {emoji: '🇨🇦', code: 'CA', dial_code: '+1', name: 'Canada'},
        {emoji: '🇩🇪', code: 'DE', dial_code: '+49', name: 'Germany'},
        {emoji: '🇫🇷', code: 'FR', dial_code: '+33', name: 'France'},
        {emoji: '🇯🇵', code: 'JP', dial_code: '+81', name: 'Japan'}
    ];
    
    select.innerHTML = '';
    
    fallbackCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.dial_code;
        option.textContent = `${country.emoji} ${country.name} ${country.dial_code}`;
        
        if (country.name === 'India') {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
    
    console.log('Fallback country dropdown created with 10 popular countries');
}

function openContactPopup() {
    const contactPopup = document.getElementById('contactPopup');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactPopup) {
        contactPopup.style.display = 'block';
    }
    if (contactForm) {
        contactForm.style.display = 'block';
    }
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

function closeContactPopup() {
    const contactPopup = document.getElementById('contactPopup');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const popupForm = document.querySelector('#contactForm form');

    if (contactPopup) {
        contactPopup.style.display = 'none';
    }
    if (popupForm) {
        popupForm.reset();
    }
    if (contactForm) {
        contactForm.style.display = 'block';
    }
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

window.onclick = function(event) {
    const popup = document.getElementById('contactPopup');
    if (popup && event.target === popup) {
        popup.style.display = 'none';
    }
}

function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Combine country code with phone number
    const countryCode = formData.get('countryCode');
    const phoneNumber = formData.get('phone');
    const fullPhoneNumber = countryCode + ' ' + phoneNumber;
    
    console.log('Submitting form with phone:', fullPhoneNumber);
    
    // Google Form entry IDs from your pre-filled link
    const googleFormData = new FormData();
    googleFormData.append('entry.945275540', formData.get('name'));
    googleFormData.append('entry.618427474', fullPhoneNumber);
    googleFormData.append('entry.1186265837', formData.get('email'));
    googleFormData.append('entry.532939120', formData.get('requirements'));
    
    // Your Google Form ID
    const FORM_ID = '1FAIpQLSdK5v063hIPDZUv1goqDgvYmutRiivTAM1mwmIIIXwZGb6k_w';
    const googleFormURL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
    
    // Submit to Google Forms
    fetch(googleFormURL, {
        method: 'POST',
        body: googleFormData,
        mode: 'no-cors'
    }).then(() => {
        // Show success message
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        form.reset();
    }).catch((error) => {
        alert('There was an error submitting your form. Please try again or email us at founders@thefifthverse.com');
        console.error('Error:', error);
    });
}
