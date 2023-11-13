let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

document.getElementById('close-msg')?.addEventListener('click', closeMessage);

document.getElementById('form-csv')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById('form-csv'));

    console.log(form);

    //leer datos del archivo y construir json
    function leerCsv(evt){
                    
        let file = evt.target.files[0];
        let reader = new FileReader();
        reader.onload= (e) => {
          console.log(e.target.result)    
        };
        reader.readAsText(file);
    }
    document.querySelector('#archivocsv')
     .addEventListener('change',csv, false);
    
    

    //enviar datos
    fetch('http://localhost:9000/subirCSV', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then((res) =>{
        if(!res.ok){
            throw new Error('Fallo la solicitud');
        }
        return res.json();
    }).then((res) => {
        alert(`Respuesta del servidor: ${JSON.stringify(res)}`);
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
});

document.getElementById('update-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const form_data = new FormData(document.getElementById('update-form'));
    const json ={};
    form_data.forEach((v, k) =>{
        json[k] = v;
    });
    fetch('http://localhost:9000/administrativo/editarAula', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then((res) =>{
        if(!res.ok){
            throw new Error('Fallo la solicitud');
        }
        return res.json();
    }).then((res) => {
        alert(`Respuesta del servidor: ${JSON.stringify(res)}`);
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
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