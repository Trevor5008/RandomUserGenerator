const gallery = document.getElementById('gallery');
const searchFld = document.getElementById('search-input');
const searchBtn = document.getElementById('search-submit');
// store randomized user data for re-use
let usersData = [], filteredUsers = []; 
let hasRun = false, hasModal = false;

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

// Fetches 12 randomized users data from randomuser api on load
fetch('https://randomuser.me/api/?nat=au,ca,gb,us&results=12')
   .then(checkStatus)
   .then(res => res.json())
   .then(data => populateGallery(data.results))
   .catch(err => console.log('Looks like there was a problem...', err));

/**
 * Helper used to re-populate gallery with filtered results
 * @param {String} search - name entered in search field 
 */
const filterBySearch = (search) => {
   search = search.toLowerCase();
   filteredUsers = usersData.filter(user => {
      const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
      const isMatch = user.name.first.toLowerCase() === search ||
         user.name.last.toLowerCase() === search || fullName === search;
      return isMatch;
   });
   if (filteredUsers.length > 0) {
      populateGallery(filteredUsers);
   } else {
      gallery.insertAdjacentHTML('beforeend', `<h3>No Results Found...</h3>`)
   }
}
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
            <h3 id="name" class="card-name cap"><span class="awesome">${data.name.first} ${data.name.last}</span></h3>
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
   // store results into global var (only on first load)
   if (!hasRun) {
      usersData = cards;
      hasRun = true;
   }
   cards.map(card => gallery.insertAdjacentHTML('beforeend', createCard(card)));
};

// Formatting helper methods
const formatPhoneNumber = (phone) => {
   const phoneNum = phone.replace(/-|\(|\)|\s/g, ''),
   areaCode = `(${phoneNum.substring(0,3)})`,
   firstThree = `${phoneNum.substring(3,6)}`,
   lastFour = `${phoneNum.substring(6,10)}`;
   return `${areaCode} ${firstThree}-${lastFour}`;
}

const formatAddress = (address) => {
   const number = address.street.number,
   name = address.street.name,
   city = address.city,
   state = address.state,
   zip = address.postcode;
   return `${number} ${name}, ${city}, ${state}, ${zip}`;
}

// formats into xx/xx/xxxx
const formatBirthDay = (bday) => {
   const month = bday.substring(5, 7),
   day = bday.substring(8, 10),
   year = bday.substring(0, 4);
   return `${month}/${day}/${year}`;
};

const createModal = (data) => {
   if (hasModal) {
      // global flag indicates whether modal is present
      gallery.querySelector('.modal-container').remove();
      hasModal = false;
   }
   const phoneNum = formatPhoneNumber(data.cell),
   address = formatAddress(data.location),
   birthDay = formatBirthDay(data.dob.date);
   const html = 
      `<div class="modal-container">
         <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
              <img class="modal-img" src="${data.picture.medium}" alt="profile picture">
              <h3 id="name" class="modal-name cap">
                <span class="awesome">${data.name.first} ${data.name.last}</span>
              </h3>
              <p class="modal-text">${data.email}</p>
              <p class="modal-text cap">${data.location.city}</p>
              <hr>
              <p class="modal-text">${phoneNum}</p>
              <p class="modal-text">${address}</p>
              <p class="modal-text">Birthday: ${birthDay}</p>
            </div>
            <div class="modal-btn-container">
               <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
               <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
         </div>
      </div>`;

   gallery.insertAdjacentHTML('beforeend', html);
   // set flag
   hasModal = true;
   // set event listeners
   attachModalListeners(data);
};

/**
 * Helper for re-attaching listeners for each new modal
 * @param {Array} data - stored users data
 */
const attachModalListeners = (data) => {
   let idx = usersData.indexOf(data);
   const container = gallery.querySelector('.modal-container');
   const modalClose = container.querySelector('#modal-close-btn');
   const nextBtn = container.querySelector('#modal-next');
   const prevBtn = container.querySelector('#modal-prev');
   // modal event listeners
   nextBtn.addEventListener('click', () => {
      if (idx < usersData.length - 1) {
         idx++;
         data = usersData[idx];
         createModal(data);
      }
   });
   prevBtn.addEventListener('click', () => {
      if (idx > 0) {
         idx--;
         data = usersData[idx];
         createModal(data);
      }
   });
   modalClose.addEventListener('click', () => {
      container.remove();
      hasModal = false;
   });
};

// Page Event Listener(s)
searchBtn.addEventListener('click', () => {
   const searchTerm = searchFld.value;
   // clear out exisiting gallery
   while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
   }
   searchTerm ? filterBySearch(searchTerm) : populateGallery(usersData);
});

gallery.addEventListener('click', e => {
   const isCard = e.target.className.substring(0, 4) === 'card';
   let className = e.target.className;
   if (isCard || e.target.className === 'awesome') {
      let target, data; 
      if (className === 'card') {
         target = e.target;
      } else if (className === 'card-info-container' || className === 'card-img-container') {
         target = e.target.parentNode;
      } else if (className === 'card-img' || className === 'card-text'
         || className === 'card-text cap') {
         target = e.target.parentNode.parentNode;
      } else if (className === 'awesome') {
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