// Variables

var generateBtn = document.getElementById("generateBtn");
var mealNameContainer = document.getElementById("meal-name");
var thumbnailContainer = document.getElementById("thumbnail");
var youtubeLinkContainer = document.getElementById("youtube-link");
var favoriteMealContainer = document.getElementById("favorite-meal");
var ingredientsListContainer = document.getElementById("ingredients-list");
var rerollButtonContainer = document.getElementById("reroll");
var categories = document.getElementById("categories");
var regions = document.getElementById("regions");
var loadingIconContainer = document.getElementById("loading-icon");
var favoritesBtn = document.getElementById("favorites-button");
var favoritesDropdown = document.getElementById("favorites-dropdown");
var mealId;

var chosenCategory = "";
var chosenRegion = "";

// Added css styling for headers
const style = document.createElement("style");
style.textContent = `
body {
  background-color: orange;
}
span{
  color:blue;
}
h1{
  color:blue; 
  font-size: 45px;
}
`;
document.head.appendChild(style);

// Event listeners for the dropdown menus
categories.addEventListener("click", function (e) {
  if (e.target.classList.contains("cat")) {
    chosenCategory = e.target.innerText;
    document.getElementById("chosenCat").innerText = chosenCategory;
  }
});

regions.addEventListener("click", function (e) {
  if (e.target.classList.contains("reg")) {
    chosenRegion = e.target.innerText;
    document.getElementById("chosenReg").innerText = chosenRegion;
  }
});

// Fetches a random meal from the mealdb API and uses that data to run generateRandomMeal()
function getRandomMeal() {
  var mealURL = "https://www.themealdb.com/api/json/v1/1/random.php";

  fetch(mealURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      $("#youtubeBtn").remove();
      $("#favoriteMealBtn").remove();
      $("#rerollBtn").remove();
      $("#meal-header").remove();
      $("#thumb").remove();

      generateRandomMeal(data);
    });
}

// First checks if the generated meal meets the requirements selected from the dropdown menus. Then creates
// and positions the elements to display the meal name, a picture of the meal and a link to a youtube recipe.
// In the display, a "reroll" button and favorites button are added

function generateRandomMeal(data) {
  var mealCategory = data.meals[0].strCategory;
  var mealRegion = data.meals[0].strArea;

  if (
    (chosenCategory == "" && chosenRegion == "") ||
    (chosenCategory == "" && chosenRegion == mealRegion) ||
    (chosenCategory == mealCategory && chosenRegion == "") ||
    (mealCategory == chosenCategory && mealRegion == chosenRegion)
  ) {
    //removes the loading icon
    $("#icon-GIF").remove();
    $("#loading-text").remove();

    var mealName = data.meals[0].strMeal;
    var thumbnailLink = data.meals[0].strMealThumb;
    var youtubeLink = data.meals[0].strYoutube;

    let youtubeBtnEl = document.createElement("button");
    let favoriteMealBtnEl = document.createElement("button");
    let rerollBtnEl = document.createElement("button");

    let mealNameEl = document.createElement("h2");
    let thumbnailEl = document.createElement("img");

    $("#meal-name").append(mealNameEl);
    mealNameEl.textContent = mealName;
    mealNameEl.setAttribute("id", "meal-header");
    $("#thumbnail").append(thumbnailEl);
    thumbnailEl.setAttribute("id", "thumb");
    thumbnailEl.setAttribute("src", thumbnailLink);
    $("#youtube-link").append(youtubeBtnEl);
    youtubeBtnEl.setAttribute("id", "youtubeBtn");
    youtubeBtnEl.setAttribute("class", "btn");
    $("#favorite-meal").append(favoriteMealBtnEl);
    favoriteMealBtnEl.setAttribute("id", "favoriteMealBtn");
    $("#reroll").append(rerollBtnEl);
    rerollBtnEl.setAttribute("id", "rerollBtn");

    youtubeBtnEl.innerHTML =
      " <a target='_blank' href= " +
      youtubeLink +
      '><img src="images/youtubelogo.png" height="50"/></a>';
    favoriteMealBtn.textContent = "Favorite This Meal";

    favoriteMealBtnEl.setAttribute("class", "exists btn btn-danger");
    rerollBtnEl.setAttribute("class", "exists btn btn-danger");
    rerollBtnEl.textContent = "Try Something Different";

    // Grabs the mealID number for reference in the saveToFavorites function
    mealId = data.meals[0].idMeal;

  } else {

    // Displays a loading GIF while the function iterates through random meals
    var iconEl = document.createElement("img");
    iconEl.setAttribute("id", "icon-GIF");
    iconEl.setAttribute(
      "src",
      "https://data.whicdn.com/images/124012442/original.gif"
    );
    var loadingTextEl = document.createElement("h1");
    loadingTextEl.setAttribute("id", "loading-text");
    loadingTextEl.textContent = "Cooking something up...";

    if (loadingIconContainer.childNodes.length === 0) {
      loadingIconContainer.appendChild(loadingTextEl);
      loadingIconContainer.appendChild(iconEl);
    }
    getRandomMeal();
  }
}

// Takes the mealID from the currently displayed meal and uses it to reference that meal from
// the mealdb API and saves to an array for local storage
function saveToFavorites() {
  var mealUrlId =
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;

  fetch(mealUrlId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var savedMeal = data.meals[0].strMeal;
      if (!favoritesList.includes(savedMeal)) {
        favoritesList.push(savedMeal);
        localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
      }
    });
}

// Variables for local storage
var favoritesContainer = document.getElementById("favorites-dropdown");
var favoritesList = [];

// Displays the saved meals from the local storage array in a dropdown with the option to
// remove from the array
function displayFavorites() {
  favoritesContainer.innerHTML = "";

  for (var i = 0; i < favoritesList.length; i++) {
    var favoriteItem = favoritesList[i];
    var li = document.createElement("li");
    li.textContent = favoriteItem;
    li.setAttribute("data-index", i);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.setAttribute("class", "btn btn-outline-danger");

    li.appendChild(deleteButton);
    favoritesContainer.appendChild(li);
  }
}

// Re-saves the favoritesList array from local storage
function init() {
  var storedFavorites = JSON.parse(localStorage.getItem("favoritesList"));
  if (storedFavorites !== null) {
    favoritesList = storedFavorites;
  }
}

// Event Listener for the favorites dropdown menu remove button
favoritesDropdown.addEventListener("click", function (e) {
  var element = e.target;
  if (element.classList.contains("btn") === true) {
    var index = element.parentElement.getAttribute("data-index");
    favoritesList.splice(index, 1);
    localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }
});

// Event listeners for the save to favorites and reroll buttons
favoriteMealContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("exists")) {
    saveToFavorites();
  }
});

rerollButtonContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("exists")) {
    getRandomMeal();
  }
});

init();

// Event listeners for the find a meal and favorites dropdown display
favoritesBtn.addEventListener("click", displayFavorites);
generateBtn.addEventListener("click", getRandomMeal);
