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

function generateRandomMeal(data) {
  var mealCategory = data.meals[0].strCategory;
  var mealRegion = data.meals[0].strArea;

  if (
    (chosenCategory == "" && chosenRegion == "") ||
    (chosenCategory == "" && chosenRegion == mealRegion) ||
    (chosenCategory == mealCategory && chosenRegion == "") ||
    (mealCategory == chosenCategory && mealRegion == chosenRegion)
  ) {
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
      " <a href= " +
      youtubeLink +
      '><img src="images/youtubelogo.png" height="50"/></a>';
    favoriteMealBtn.textContent = "Favorite This Meal";

    favoriteMealBtnEl.setAttribute("class", "exists btn btn-danger");
    rerollBtnEl.setAttribute("class", "exists btn btn-danger");
    rerollBtnEl.textContent = "Try Something Different";
    mealId = data.meals[0].idMeal;
  } else {
    var iconEl = document.createElement("img");
    iconEl.setAttribute("id", "icon-GIF");
    iconEl.setAttribute(
      "src",
      "https://data.whicdn.com/images/124012442/original.gif"
    );
    var loadingTextEl = document.createElement("h1");
    loadingTextEl.setAttribute("id", "loading-text");
    loadingTextEl.textContent = "Loading...";

    if (loadingIconContainer.childNodes.length === 0) {
      loadingIconContainer.appendChild(loadingTextEl);
      loadingIconContainer.appendChild(iconEl);
    }
    getRandomMeal();
  }
}

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

var favoritesContainer = document.getElementById("favorites-dropdown");
var favoritesList = [];

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

function init() {
  var storedFavorites = JSON.parse(localStorage.getItem("favoritesList"));
  if (storedFavorites !== null) {
    favoritesList = storedFavorites;
  }
}

favoritesDropdown.addEventListener("click", function (e) {
  var element = e.target;
  if (element.classList.contains("btn") === true) {
    var index = element.parentElement.getAttribute("data-index");
    favoritesList.splice(index, 1);
    localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }
});

favoriteMealContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("exists")) {
    saveToFavorites();
    console.log("clicked");
  }
});

rerollButtonContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("exists")) {
    getRandomMeal();
  }
});

init();

favoritesBtn.addEventListener("click", displayFavorites);
generateBtn.addEventListener("click", getRandomMeal);
