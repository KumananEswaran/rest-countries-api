const global = {
	currentPage: window.location.pathname,
};

async function displayCountries() {
	const result = await fetchAPIData('all');

	console.log(result);

	result.forEach((data) => {
		const div = document.createElement('div');
		div.classList.add('section');
		div.innerHTML = `
				<div>
					<a href="country-details.html?id=${data.cca2}">
						<img src="${data.flags.png}" alt="" />
					</a>
				</div>
				<div class="details">
					<p>${data.name.common}</p>
					<p class="country-details"><span>Population: </span>${addCommasToNumber(
						data.population
					)}</p>
					<p class="country-details"><span>Region: </span>${data.region}</p>
					<p class="country-details"><span>Capital: </span>${data.capital}</p>
				</div>
    `;

		document.querySelector('.section-container').appendChild(div);
	});
}

// Fetch and display countries
async function fetchAndDisplayCountries() {
	const countries = await fetchAPIData('all');

	// Add event listener for the filter dropdown
	const regionSelect = document.getElementById('region');
	regionSelect.addEventListener('change', (event) => {
		const selectedRegion = event.target.value;

		const filteredCountries = countries.filter(
			(country) => country.region === selectedRegion
		);

		const filterLabel = document.querySelector('.filter-label');
		filterLabel.classList.add('hide');
		displayFilteredCountries(filteredCountries);
	});

	// Add event listener for search bar
	const searchInput = document.querySelector('.search-input');

	searchInput.addEventListener('input', (event) => {
		const searchedCountry = event.target.value.toLowerCase();

		const filteredCountries = countries.filter((country) =>
			country.name.common.toLowerCase().includes(searchedCountry)
		);
		displayFilteredCountries(filteredCountries);
	});
}

// Function to display countries based on the filter
function displayFilteredCountries(countries) {
	const container = document.querySelector('.section-container');
	container.innerHTML = '';

	countries.forEach((data) => {
		const div = document.createElement('div');
		div.classList.add('section');
		div.innerHTML = `
			<div>
				<a href="country-details.html?id=${data.cca2}">
					<img src="${data.flags.png}" alt="" />
				</a>
				</div>
				<div class="details">
					<p>${data.name.common}</p>
					<p class="country-details"><span>Population: </span>${addCommasToNumber(
						data.population
					)}</p>
					<p class="country-details"><span>Region: </span>${data.region}</p>
					<p class="country-details"><span>Capital: </span>${data.capital}</p>
			</div>
		`;
		container.appendChild(div);
	});
}

// Display Country Details
async function displayCountryDetails() {
	const countryId = window.location.search.split('=')[1];

	const country = await fetchAPIData(`alpha?codes=${countryId}`);

	const result = await fetchAPIData('all');

	const borderCodes = country[0].borders;

	// Check if the country has borders
	if (!borderCodes || borderCodes.lenth === 0) {
		const div = document.createElement('div');
		div.classList.add('country');

		div.innerHTML = `
			<div class="country-image">
				<img src="${country[0].flags.png}" alt="" />
			</div>
			<div class="info">
				<div class="country-name">
					<p>${country[0].name.common}</p>
				</div>
				<div class="country-info">
					<div class="country-info-1">
						<p><span>Native Name: </span>${Object.values(country[0].name.nativeName)
							.map((native) => native.common)
							.slice(0, 1)
							.join(', ')}</p>
						<p><span>Population: </span>${addCommasToNumber(country[0].population)}</p>
						<p><span>Region: </span>${country[0].region}</p>
						<p><span>Sub Region: </span>${country[0].subregion}</p>
						<p><span>Capital: </span>${country[0].capital}</p>
					</div>
					<div class="country-info-2">
						<p><span>Top Level Domain: </span>${country[0].tld}</p>
						<p><span>Currencies: </span>${Object.values(country[0].currencies)[0].name}</p>
						<p><span>Languages: </span>${Object.values(country[0].languages)
							.splice(0, 3)
							.join(', ')}</p>
					</div>
				</div>
				<div class="border">
					<p></p>
				</div>
			</div>
		`;

		document.querySelector('.country-container').appendChild(div);
	} else {
		const borderCountries = borderCodes
			.map((code) => {
				return result.find((r) => r.cca3 === code);
			})
			.filter(Boolean);

		const borderCountryNames = borderCountries.map(
			(country) => country.name.common
		);

		const div = document.createElement('div');
		div.classList.add('country');

		div.innerHTML = `
			<div class="country-image">
				<img src="${country[0].flags.png}" alt="" />
			</div>
			<div class="info">
				<div class="country-name">
					<p>${country[0].name.common}</p>
				</div>
				<div class="country-info">
					<div class="country-info-1">
						<p><span>Native Name: </span>${Object.values(country[0].name.nativeName)
							.map((native) => native.common)
							.slice(0, 1)
							.join(', ')}</p>
						<p><span>Population: </span>${addCommasToNumber(country[0].population)}</p>
						<p><span>Region: </span>${country[0].region}</p>
						<p><span>Sub Region: </span>${country[0].subregion}</p>
						<p><span>Capital: </span>${country[0].capital}</p>
					</div>
					<div class="country-info-2">
						<p><span>Top Level Domain: </span>${country[0].tld}</p>
						<p><span>Currencies: </span>${Object.values(country[0].currencies)[0].name}</p>
						<p><span>Languages: </span>${Object.values(country[0].languages)
							.splice(0, 3)
							.join(', ')}</p>
					</div>
				</div>
				<div class="border">
					<p>Border Countries:</p>
					<div class="border-countries">
					</div>
				</div>
			</div>
		`;

		const borderContainer = div.querySelector('.border-countries');
		borderCountryNames.slice(0, 12).forEach((countryName, index) => {
			const borderCountry = borderCountries[index];
			const button = document.createElement('button');
			button.textContent = countryName;

			button.addEventListener('click', () => {
				window.location.href = `country-details.html?id=${borderCountry.cca2}`;
			});

			borderContainer.appendChild(button);
		});

		document.querySelector('.country-container').appendChild(div);
	}
}

async function fetchAPIData(endpoint) {
	const API_URL = 'https://restcountries.com/v3.1/';

	const response = await fetch(`${API_URL}${endpoint}`);

	const data = await response.json();

	return data;
}

function addCommasToNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function darkMode() {
	const body = document.querySelector('body');
	const darkModeButton = document.querySelector('.mode p');

	if (localStorage.getItem('darkMode') === 'enabled') {
		body.classList.add('dark-mode');
	}

	darkModeButton.addEventListener('click', () => {
		body.classList.toggle('dark-mode');

		if (body.classList.contains('dark-mode')) {
			localStorage.setItem('darkMode', 'enabled');
		} else {
			localStorage.setItem('darkMode', 'disabled');
		}
	});
}

darkMode();

function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayCountries();
			fetchAndDisplayCountries();
			break;
		case '/country-details.html':
			displayCountryDetails();
			break;
	}
}

document.addEventListener('DOMContentLoaded', init);
