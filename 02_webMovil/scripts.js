let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

function logScreenSize(){
  console.log(document.body.offsetWidth +
    'x' + document.body.offsetHeight);
}

function setDynamicElements(){
  setTime();
  logScreenSize();
}

function setTime(){
  time.innerHTML = Date();
}
