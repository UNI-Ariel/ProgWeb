let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

window.addEventListener('load', (event) =>{
    logScreenSize();
    setTime();
});

function logScreenSize(){                       //Mutation Event Deprecated
  console.log(document.body.offsetWidth +
    'x' + document.body.offsetHeight);
}

function setTime(){
  time.innerHTML = Date();
}
