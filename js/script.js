const apiKey = process.env.MARVEL_API_KEY;

const favoriteChars = [];
let currentCharacter = null;

function generateRandomCharId() {
    return Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
  }

async function fetchCharacter() {
    const charId = generateRandomCharId();
    const url = `https://gateway.marvel.com:443/v1/public/characters/${charId}?apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data.results[0];

    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  function randomCharElem(char) {

    const img = document.querySelector('#dynamicImage');
    const charName = document.querySelector('#charName');
    const descr = document.querySelector('#descr');

    img.src = `${char.thumbnail.path}.${char.thumbnail.extension}`;
    img.alt = char.name;
    charName.textContent = char.name;
    descr.innerHTML = `<span>Description: </span>${
      char.description || 'Description not available' // If no description, display "Description not available"
    }`;

    currentCharacter = char; 
  }

  function updateFavoriteCards() {
    const favoriteContainer = document.querySelector(".favorite");
    favoriteContainer.innerHTML = "";
  
    favoriteChars.forEach((char, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
  
      const img = document.createElement("img");
      img.src = `${char.thumbnail.path}.${char.thumbnail.extension}`;
      img.alt = char.name;
      card.appendChild(img);
  
      const name = document.createElement("p");
      name.textContent = char.name;
      card.appendChild(name);
  
      const btnContainer = document.createElement("div");
      btnContainer.classList.add("btn-container");
  
      const viewBtn = document.createElement("button");
      viewBtn.classList.add("btn", "btn-primary", "btn-sm");
      viewBtn.innerHTML = '<i class="bi bi-eye"></i>';
      viewBtn.addEventListener("click", () => randomCharElem(char));
      btnContainer.appendChild(viewBtn);
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
      deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
      deleteBtn.addEventListener("click", () => {
        favoriteChars.splice(index, 1);
        updateFavoriteCards();
      });
      btnContainer.appendChild(deleteBtn);
  
      card.appendChild(btnContainer);
      favoriteContainer.appendChild(card);
    });
  }
  

  async function createRandomChar() {
    const char = await fetchCharacter(); // Wait for character data
    randomCharElem(char);
  }

  function addCurrentCharToFavorites() {
    if (currentCharacter) {
      const isAlreadyFavorite = favoriteChars.some(
        (char) => char.id === currentCharacter.id
      );
      if (!isAlreadyFavorite) {
        favoriteChars.push(currentCharacter);
        updateFavoriteCards();
      } else {
        alert("This character is already in favorites!");
      }
    } 
  }


  
document.addEventListener('DOMContentLoaded', () => {
  // Call randomChar once when the page loads
  createRandomChar();

  
  document.querySelector('#btnRandChar').addEventListener('click', createRandomChar);
  document.querySelector("#btnFavorite").addEventListener("click", addCurrentCharToFavorites);
});


