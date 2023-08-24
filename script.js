let name = document.getElementById("name");
let telNumber = document.getElementById("telNumber");
let containerTXT = false;

function save() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("telNumber", telNumber.value);
  alert("As informações foram salvas!");
}

if (localStorage.getItem("name")) {
  name.value = localStorage.getItem("name");
  telNumber.value = localStorage.getItem("telNumber");
}

let listaVagas = document.getElementById("listaVagas");

let date = new Date();
let day = String(date.getDate()).padStart(2, "0");
let month = String(date.getMonth() + 1).padStart(2, "0");
let year = date.getFullYear();
let dateTodayNew = `${day}/${month}/${year}`;

var BOMD = "";

let data = new Date();
let hora = data.getHours();
if (hora > 4 && hora < 12) {
  BOMD = "bom dia";
} else if (hora > 11 && hora < 18) {
  BOMD = "boa tarde";
} else if (hora > 17 && hora < 23) {
  BOMD = "boa noite";
}

let sortedArray = ordenarPorDataDescendente(vagas);

// Iterando sobre o array "vagas" e criando os links
for (let i = 0; i < sortedArray.length; i++) {
  let dateToday = extrairData(sortedArray[i].registro);

let corpo = `
Prezado(a), ${BOMD}. %0A
Espero que esta mensagem o encontre bem. Gostaria de apresentar meu currículo em anexo como candidato à vaga de ${sortedArray[i].body[2]} 
em sua empresa. Acredito que minhas habilidades e experiência podem contribuir significativamente para o crescimento e sucesso da equipe. 
Agradeço desde já pela atenção e consideração. Estou à disposição para fornecer mais informações, participar de entrevistas ou realizar quaisquer etapas necessárias do processo de seleção. %0A%0A
%0A
Atenciosamente,%0A%0A${localStorage.getItem("name")}%0A
Telefone: ${localStorage.getItem("telNumber")}
`;

  if (dateTodayNew === dateToday) {
    listaVagas.innerHTML += `
      <div class="vaga today" id='item${i}'>
        <div style='margin-bottom:20px;'>${sortedArray[i].registro} - ${sortedArray[i].body[2]}</div>
        <div class='imgDown' onclick="mostrarSobreVaga(this, 'txt${i}'), rolarParaElemento('item${i}')"></div>
        <a href="https://mail.google.com/mail/?view=cm&to=${sortedArray[i].email}&su=${sortedArray[i].body[2]}&body=${corpo}" target="_blank">ENVIAR CURRICULO</a>
        <div class='conteudoTexto' id='txt${i}'>${retornaP(i)}</div>
      </div>
    `;
  } else {
    listaVagas.innerHTML += `
    <div class="vaga" id='item${i}'>
      <div style='margin-bottom:20px;'>${sortedArray[i].registro} - ${sortedArray[i].body[2]}</div>
      <div class='imgDown' onclick="mostrarSobreVaga(this, 'txt${i}'), rolarParaElemento('item${i}')"></div>
      <a href="https://mail.google.com/mail/?view=cm&to=${sortedArray[i].email}&su=${sortedArray[i].body[2]}&body=${corpo}" target="_blank">ENVIAR CURRICULO</a>
      <div class='conteudoTexto' id='txt${i}'>${retornaP(i)}</div>
    </div>
    `;
  }
}

function retornaP(a) {
  let componente = sortedArray[a].body;
  let p = "";

  if (sortedArray[a].body) {
    for (let i = 1; i < componente.length - 9; i++) {
      p += `<p id='sobreVaga'>${sortedArray[a].body[i]}</p>`;
    }
  }

  return p;
}

function rolarParaElemento(id) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.scrollIntoView({ behavior: "smooth" });
  }
}

function ordenarPorDataDescendente(arrayDeObjetos) {
  function compararDatas(a, b) {
    const dataA = new Date(
      a.registro.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5"
      )
    );
    const dataB = new Date(
      b.registro.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5"
      )
    );
    return dataB - dataA;
  }

  return arrayDeObjetos.sort(compararDatas);
}

function extrairData(frase) {
  const padraoData = /(\d{2}\/\d{2}\/\d{4})/; // Expressão regular para capturar a data no formato "dd/mm/aaaa"
  const resultado = padraoData.exec(frase);
  if (resultado && resultado.length > 1) {
    return resultado[1]; // O índice 1 contém a data capturada
  } else {
    return false; // Retorna false caso a data não seja encontrada na frase
  }
}

function mostrarSobreVaga(i, id) {
  if (containerTXT == false) {
    let txt = document.querySelectorAll(".conteudoTexto");
    for (let a = 0; a < txt.length; a++) {
      txt[a].style.display = "none";
    }

    document.getElementById(id).style.display = "block";
    i.style.transition = "0ms linear";
    i.style.backgroundImage = `url('img/icons8-para-cima-com-quadrado-50.png')`;

    i.parentNode.style.border = "2px solid #24aae7";

    containerTXT = true;
  } else {
    i.style.backgroundImage = `url('img/icons8-para-baixo-com-quadrado-50.png')`;
    document.getElementById(id).style.display = "none";
    containerTXT = false;
  }
}