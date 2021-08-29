const gallery = document.getElementById('gallery');

let usersData = [];

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
   // store results into global var for retrieval
   usersData = cards;
   console.log(usersData)
   cards.map(card => gallery.insertAdjacentHTML('beforeend', createCard(card)));
};

const createModal = (data) => {
   const html = 
      `<div class="modal-container">
         <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
              <img class="modal-img" src="${data.picture.medium}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
              <p class="modal-text">${data.email}</p>
              <p class="modal-text cap">${data.location.city}</p>
              <hr>
              <p class="modal-text">(555) 555-5555</p>
              <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
              <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
         </div>
      </div>`;
   gallery.insertAdjacentHTML('beforeend', html);
   const modal = gallery.querySelector('.modal-container');
   const modalClose = modal.querySelector('#modal-close-btn');
   modalClose.addEventListener('click', () => {
      modal.remove();
   });
}

gallery.addEventListener('click', e => {
   let targetClass = e.target.className.substring(0, 4);
   if (targetClass === 'card') {
      let target, data; 
      if (e.target.className === 'card') {
         target = e.target;
      } else if (e.target.parentNode.className === 'card') {
         target = e.target.parentNode;
      } else if (e.target.parentNode.parentNode.className === 'card') {
         target = e.target.parentNode.parentNode;
      } 
      // name of target stored as identifier for retrieval
      let name = target.querySelector('h3').textContent;
      for (let i = 0; i < usersData.length; i++) {
         let first = usersData[i].name.first;
         let last = usersData[i].name.last;
         let firstAndLast = `${first} ${last}`;
         if (firstAndLast === name) {
            data = usersData[i];
            break;
         }
      }
      createModal(data);
   } 
});