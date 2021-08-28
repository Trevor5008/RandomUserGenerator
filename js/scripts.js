const gallery = document.getElementById('gallery');

const checkStatus = (res) => {
   if (res.ok) {
      return Promise.resolve(res);
   } 
   return Promise.reject(new Error(res.statusText));
};

// pulls 12 randomized users data from api
const userData = fetch('https://randomuser.me/api/?results=12')
   .then(checkStatus)
   // convert to json
   .then(res => res.json())
   .then(data => populateGallery(data.results))
   .catch(err => console.log('Looks like there was a problem...', err));

// data: results array inside of object
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

const populateGallery = (cards) => {
   cards.map(card => gallery.insertAdjacentHTML('beforeend', createCard(card)));
};