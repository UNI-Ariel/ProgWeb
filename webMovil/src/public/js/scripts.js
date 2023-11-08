let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

document.getElementById('close-msg')?.addEventListener('click', closeMessage);
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
/*
function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    console.log(JSON.stringify(result));
    return JSON.stringify(result); //JSON
 }
 document.querySelector('#archivocsv')
  .addEventListener('change',csvJSON, false);
*/
/* function editAmbiente(event){
    const row = event.target.closest('tr');
    try{
        fetch
    }
} */