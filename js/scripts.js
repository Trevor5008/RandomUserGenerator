const gallery = document.getElementById('gallery');

/**
 * Helper that provides error handling for our api call
 * @param {Promise} res - Response from our fetch 
 * @returns resolution/rejection depending on status 
 */
const checkStatus = (res) => {
   if (res.ok) {
      return Promise.resolve(res);
   } 
   return Promise.reject(new Error(res.statusText));
};

// Fetches 12 randomized users data from randomuser api
fetch('https://randomuser.me/api/?results=12')
   .then(checkStatus)
   // convert to json
   .then(res => res.json())
   .then(data => populateGallery(data.results))
   .catch(err => console.log('Looks like there was a problem...', err));

/**
 * Helper that generates HTML template w/data
 * @param {Object} data - info for each user 
 * @returns HTML template string
 */
const createCard = data => {
   const html = 
      `<div class="card">
         <div class="card-img-container">
            <img class="card-img" src="${data.picture.thumbnail}" alt="profile picture">
         </div>
         <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
               <p class="card-text">${data.email}</p>
               <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
         </div>
      </div>`;
   return html;
};

/**
 * Populates 12 user data cards on the web page
 * @param {String} cards - HTML template string 
 */
const populateGallery = (cards) => {
   cards.map(card => gallery.insertAdjacentHTML('beforeend', createCard(card)));
};