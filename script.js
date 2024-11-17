// Replace with your Unsplash API Key
const UNSPLASH_API_KEY = '86zIQoKAkB10aD2xV3OPJdbk5CetwlHGNN3ed7mGUAA';

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const query = document.getElementById('searchInput').value;
  const resultsContainer = document.getElementById('results');

  // Clear previous results
  resultsContainer.innerHTML = '';

  try {
    // Fetch images from Unsplash API
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}&per_page=12`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();

    // Display images
    data.results.forEach(image => {
      const col = document.createElement('div');
      col.classList.add('col-lg-3', 'col-md-4', 'col-sm-6');
      col.innerHTML = `
        <div class="card shadow-sm">
          <img src="${image.urls.small}" class="card-img-top" alt="${image.alt_description}">
          <div class="card-body">
            <p class="card-text">${image.alt_description || 'No description available'}</p>
          </div>
        </div>
      `;
      resultsContainer.appendChild(col);
    });
  } catch (error) {
    resultsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
});




// Replace with your OpenWeatherMap API Key
const API_KEY = 'c3b67b34b4df69a7d78ea0599b68b33e';

document.getElementById('weatherForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const city = document.getElementById('cityInput').value;
  const weatherResult = document.getElementById('weatherResult');

  // Clear previous result
  weatherResult.style.display = 'none';
  weatherResult.innerHTML = '';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();

    weatherResult.style.display = 'block';
    const icon = data.weather[0].icon;

    weatherResult.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.weather[0].description}">
  <h4>${data.name}, ${data.sys.country}</h4>
  <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
   <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    `;
  } catch (error) {
    weatherResult.style.display = 'block';
    weatherResult.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
});





// DOM Elements
const launchesContainer = document.getElementById('launches');
const pastLaunchesBtn = document.getElementById('pastLaunchesBtn');
const upcomingLaunchesBtn = document.getElementById('upcomingLaunchesBtn');

// Fetch and Display Launches
async function fetchLaunches(endpoint) {
  launchesContainer.innerHTML = '<p class="text-center">Loading...</p>';
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/launches/${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch launches');
    const launches = await response.json();

    displayLaunches(launches);
  } catch (error) {
    launchesContainer.innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
  }
}

// Display Launches in the DOM
function displayLaunches(launches) {
  launchesContainer.innerHTML = '';

  launches.forEach((launch) => {
    const launchCard = document.createElement('div');
    launchCard.classList.add('col-md-6', 'col-lg-4', 'mb-4');

    launchCard.innerHTML = `
      <div class="card shadow-sm">
        <img src="${launch.links.patch.small || 'https://via.placeholder.com/150'}" 
             class="card-img-top" 
             alt="${launch.name}">
        <div class="card-body">
          <h5 class="card-title">${launch.name}</h5>
          <p class="card-text"><strong>Date:</strong> ${new Date(launch.date_utc).toLocaleString()}</p>
          <p class="card-text">
            <strong>Status:</strong> 
            ${launch.success === true ? '✅ Success' : launch.success === false ? '❌ Failure' : '🚀 Upcoming'}
          </p>
          <a href="${launch.links.webcast || '#'}" class="btn btn-primary" target="_blank" ${!launch.links.webcast ? 'disabled' : ''}>
            Watch Video
          </a>
        </div>
      </div>
    `;
    launchesContainer.appendChild(launchCard);
  });
}

// Event Listeners
pastLaunchesBtn.addEventListener('click', () => fetchLaunches('past'));
upcomingLaunchesBtn.addEventListener('click', () => fetchLaunches('upcoming'));

// Load Past Launches on Page Load
fetchLaunches('past');
