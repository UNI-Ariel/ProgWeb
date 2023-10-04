var menu = document.getElementById("sideMenu");
var menuO = document.getElementById("sideMenuBackground");
var contenido = document.getElementById("content");

var reserva = document.getElementById("reserva");
var consulta = document.getElementById("consulta");

reserva.addEventListener("click", function() {
  mostrarContenido("reserva");
});
consulta.addEventListener("click",  function() {
  mostrarContenido("consulta");
});

const paginas = [
  {
    type : 'consultas',
    file : 'consultaAula.html'
  },
  {
    type : 'reservas',
    file : 'reservaAula.html'
  }
]

function showNav() {
  menu.style.width = "200px";
  menuO.style.display = "block";
}

function closeNav() {
  menu.style.width = "0";
  menuO.style.display = "none";
}

function mostrarContenido(tipo){
  tipo = String(tipo);
  if (tipo === "consulta"){
    content.innerHTML = "<p>Usted ha seleccionado cosultas.</p>";
  }
  else{
    content.innerHTML = "<p>Usted ha seleccionado reservas.</p>";
  }
  closeNav();
}
