var menu = document.getElementById("sideMenu");
var menuO = document.getElementById("sideMenuBackground");

var iframe = document.createElement("iframe");
var iframeTarget = document.getElementById("frameTarget");

iframe.width = "100%";
iframe.height = "auto";
iframe.style.margin = "0px";
iframe.style.padding = "0px";
iframe.style.border = "none";

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
  menu.style.width = "auto";
  menuO.style.display = "block";
}

function closeNav() {
  menu.style.width = "0";
  menuO.style.display = "none";
}

function formConsulta() {
  iframe.src = paginas[0].file;
  iframe.title = paginas[0].type;
  iframeTarget.replaceWith(iframe);
  closeNav();
}

function formReserva() {
  iframe.src = paginas[1].file;
  iframe.title = paginas[1].type;
  iframeTarget.replaceWith(iframe);
  closeNav();
}