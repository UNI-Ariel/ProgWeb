var menu = document.getElementById("sideMenu");
var menuO = document.getElementById("sideMenuBackground");

function showNav() {
  menu.style.width = "200px";
  menuO.style.display = "block";
}

function closeNav() {
  menu.style.width = "0";
  menuO.style.display = "none";
}
