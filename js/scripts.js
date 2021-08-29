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

const createModal = (data) => {
   const html = 
      `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
              <h3 id="name" class="modal-name cap">name</h3>
              <p class="modal-text">email</p>
              <p class="modal-text cap">city</p>
              <hr>
              <p class="modal-text">(555) 555-5555</p>
              <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
              <p class="modal-text">Birthday: 10/21/2015</p>
          </div>
      </div>`;
      return html
}

gallery.addEventListener('click', e => {
   let image, name, email, city, cell, address, bday; 
   if (e.target.className === 'card') {
      console.log(e.target.querySelector('h3').textContent)
   } else if (e.target.parentNode.className === 'card') {
      console.log(e.target.parentNode.querySelector('h3').textContent)
   } else if (e.target.parentNode.parentNode.className === 'card') {
      console.log(e.target.parentNode.parentNode.querySelector('h3').textContent)
   } 
})