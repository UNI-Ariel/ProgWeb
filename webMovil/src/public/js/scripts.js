let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

document.getElementById('close-msg')?.addEventListener('click', closeMessage);
document.getElementById('edit-button')?.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    console.log(row);
});

window.addEventListener('load', (event) =>{
    /* logScreenSize(); */
    setTime();
});

/* function logScreenSize(){                       //Mutation Event Deprecated
  console.log(document.body.offsetWidth +
    'x' + document.body.offsetHeight);
} */

function setTime(){
  time.innerHTML = Date();
}

function closeMessage() {
    document.getElementById('message').classList.toggle('hide');
}

/* function editAmbiente(event){
    const row = event.target.closest('tr');
    try{
        fetch
    }
} */