var generateBtn = document.getElementById("generateBtn");
var mealNameContainer = document.getElementById("meal-name");
var thumbnailContainer = document.getElementById("thumbnail");
var youtubeLinkContainer = document.getElementById("youtube-link");
var favoriteMealContainer = document.getElementById("favorite-meal");
var scrollBoxContainer = document.getElementById("scroll-box");
var ingredientsListContainer = document.getElementById("ingredients-list");
var rerollButtonContainer = document.getElementById("reroll");
var categories = document.getElementById("categories");
var regions = document.getElementById("regions");
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
  font-size: 72px;
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
    var mealName = data.meals[0].strMeal;
    var thumbnailLink = data.meals[0].strMealThumb;
    var youtubeLink = data.meals[0].strYoutube;
    var ingredient;

    let youtubeBtnEl = document.createElement("button");
    let favoriteMealBtnEl = document.createElement("button");
    let rerollBtnEl = document.createElement("button");

    $("#youtube-link").append(youtubeBtnEl);
    youtubeBtnEl.setAttribute("id", "youtubeBtn");
    $("#favorite-meal").append(favoriteMealBtnEl);
    favoriteMealBtnEl.setAttribute("id", "favoriteMealBtn");
    $("#reroll").append(rerollBtnEl);
    rerollBtnEl.setAttribute("id", "rerollBtn");

    mealNameContainer.textContent = mealName;
    thumbnailContainer.setAttribute("src", thumbnailLink);
    youtubeBtnEl.innerHTML =
      " <a href= " +
      youtubeLink +
      '><img src="images/youtubelogo.png" height="50"/></a>';
    favoriteMealBtn.textContent = "Favorite This Meal";
    scrollBoxContainer.setAttribute(
      "style",
      `width: 450px;
    height: 150px;
    line-height: 3em;
    overflow: scroll;
    padding: 5px;
    background-color: #fcfadd;
    color: #714d03;
    border: 4px double #debb07;`
    );
    scrollBoxContainer.innerHTML = `<h4>Ingredients</h4>`;

    favoriteMealBtnEl.setAttribute("class", "exists");
    rerollBtnEl.setAttribute("class", "exists");
    rerollBtnEl.textContent = "Try Something Different";
    mealId = data.meals[0].idMeal;
  } else {
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
      localStorage.setItem(savedMeal, savedMeal);
    });
}

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

generateBtn.addEventListener("click", getRandomMeal);
