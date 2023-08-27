const firebaseConfig = {
  apiKey: "AIzaSyB4y3nG9gFS7tMRfB09-w8fP6dy6ptp35Q",
  authDomain: "auto-vagas.firebaseapp.com",
  projectId: "auto-vagas",
  storageBucket: "auto-vagas.appspot.com",
  messagingSenderId: "998987764573",
  appId: "1:998987764573:web:9a5831101727ce1e958eb4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


async function getVagas(){

  const docRef = db.collection('vagas');
  try{
    const snapshot = await docRef.get();
    let vagas = []

    snapshot.forEach(element => {
      vagas.push(element.data())
    });

    return vagas;
  }catch(erro){
    console.log(erro)
    return []
  }

}


getVagas()
.then((vagas)=>{
  exibirVagas(vagas)
})


const cardRegistro = document.getElementById('cardRegistro')
const cardVaga = document.getElementById('cardVaga')
const cardContent = document.getElementById('cardContent')
const btnEnviarEmail = document.getElementById('btnEnviarEmail')


const name = document.getElementById('name')
const tel = document.getElementById('telefone')

name.addEventListener('input', function() {
  localStorage.name = name.value
});
tel.addEventListener('input', function() {
  localStorage.tel = tel.value
});

if(localStorage.name){
  name.value = localStorage.name
}
if(localStorage.tel){
  tel.value = localStorage.tel
}

function closeCard(){
  document.getElementById('card').style.display = 'none'
}

function goCard(registro, vaga, corpo, email, img){
  document.getElementById('card').style.display = 'block'
  
  const nome = localStorage.name
  const telefone = localStorage.tel
  const nomeVaga = vaga
  const body = `Prezado(a),+%0AEspero+que+esta+mensagem+o+encontre+bem.+Gostaria+de+apresentar+meu+curr%C3%ADculo+em+anexo+como+candidato+%C3%A0+vaga+de+${nomeVaga}+em+sua+empresa.+Acredito+que+minhas+habilidades+e+experi%C3%AAncia+podem+contribuir+significativamente+para+o+crescimento+e+sucesso+da+equipe.+Agrade%C3%A7o+desde+j%C3%A1+pela+aten%C3%A7%C3%A3o+e+considera%C3%A7%C3%A3o.+Estou+%C3%A0+disposi%C3%A7%C3%A3o+para+fornecer+mais+informa%C3%A7%C3%B5es,+participar+de+entrevistas+ou+realizar+quaisquer+etapas+necess%C3%A1rias+do+processo+de+sele%C3%A7%C3%A3o.+%0A%0A%0AAtenciosamente,%0A%0A${nome}%0ATelefone:+${telefone}&fs=1&tf=cm`
  const gmail = `mailto:${email}?subject=${nomeVaga}&body=${body}`
  
  cardRegistro.innerHTML = registro
  cardVaga.innerHTML = vaga
  cardContent.innerHTML = corpo

  document.getElementById('cardImg').src = img
  document.getElementById('btnEnviarEmail').href = gmail
  
}

function exibirVagas(vagas){
  const listaVagas = document.getElementById('listaVagas')


  const agora = new Date();
  const dia = agora.getDate().toString().padStart(2, '0');
  const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
  const ano = agora.getFullYear();



  vagas.forEach((element)=>{
  
    if(dia == element.dia && mes == element.mes && ano == element.ano){
      const registro = `${element.hora}:${element.minuto} - ${element.dia}/${element.mes}/${element.ano}`
      let corpo = ''
      element.content.forEach((e)=>{
        corpo += e
      })
      

      listaVagas.innerHTML += `
        <a href="#card" onclick="goCard('${registro}', '${element.content[1]}', '${corpo}', '${element.email}', '${element.img}')" class="card bg-green-100">
          <img src="${element.img}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${element.vaga}</h5>
          
            <p class="card-text"><small class="text-body-secondary">${registro}</small></p>
          </div>
        </a>
      `;
    }else{
      const registro = `${element.hora}:${element.minuto} - ${element.dia}/${element.mes}/${element.ano}`
      let corpo = ''
      element.content.forEach((e)=>{
        corpo += e
      })

      listaVagas.innerHTML += `
        <a href="#card"  onclick="goCard('${registro}', '${element.content[1]}', '${corpo}', '${element.email}', '${element.img}')" class="card">
          <img src="${element.img}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${element.vaga}</h5>
          
            <p class="card-text"><small class="text-body-secondary">${registro}</small></p>
          </div>
        </a>
      `;
    }
    
  })

}




// let date = new Date();
// let day = String(date.getDate()).padStart(2, "0");
// let month = String(date.getMonth() + 1).padStart(2, "0");
// let year = date.getFullYear();
// let dateTodayNew = `${day}/${month}/${year}`;
// let name = document.getElementById("name");
// let telNumber = document.getElementById("telNumber");
// let listaVagas = document.getElementById("listaVagas");
// let containerTXT = false;
// var BOMD = "";
// let data = new Date();
// let hora = data.getHours();

// function save() {
//   localStorage.setItem("name", name.value);
//   localStorage.setItem("telNumber", telNumber.value);
//   alert("As informações foram salvas!");
// }
// if (localStorage.getItem("name")) {
//   name.value = localStorage.getItem("name");
//   telNumber.value = localStorage.getItem("telNumber");
// }




// if (hora > 4 && hora < 12) {
//   BOMD = "bom dia";
// } else if (hora > 11 && hora < 18) {
//   BOMD = "boa tarde";
// } else if (hora > 17 && hora < 23) {
//   BOMD = "boa noite";
// }

// // let sortedArray = ordenarPorDataDescendente(vagas);

// // // Iterando sobre o array "vagas" e criando os links
// // for (let i = 0; i < sortedArray.length; i++) {
// //   let dateToday = extrairData(sortedArray[i].registro);

// // let corpo = `
// // Prezado(a), ${BOMD}. %0A
// // Espero que esta mensagem o encontre bem. Gostaria de apresentar meu currículo em anexo como candidato à vaga de ${sortedArray[i].body[2]} 
// // em sua empresa. Acredito que minhas habilidades e experiência podem contribuir significativamente para o crescimento e sucesso da equipe. 
// // Agradeço desde já pela atenção e consideração. Estou à disposição para fornecer mais informações, participar de entrevistas ou realizar quaisquer etapas necessárias do processo de seleção. %0A%0A
// // %0A
// // Atenciosamente,%0A%0A${localStorage.getItem("name")}%0A
// // Telefone: ${localStorage.getItem("telNumber")}
// // `;

// //   if (dateTodayNew === dateToday) {
// //     listaVagas.innerHTML += `
// //       <div class="vaga today" id='item${i}'>
// //         <div style='margin-bottom:20px;'>${sortedArray[i].registro} - ${sortedArray[i].body[2]}</div>
// //         <div class='imgDown' onclick="mostrarSobreVaga(this, 'txt${i}'), rolarParaElemento('item${i}')"></div>
// //         <a href="https://mail.google.com/mail/?view=cm&to=${sortedArray[i].email}&su=${sortedArray[i].body[2]}&body=${corpo}" target="_blank">ENVIAR CURRICULO</a>
// //         <div class='conteudoTexto' id='txt${i}'>${retornaP(i)}</div>
// //       </div>
// //     `;
// //   } else {
// //     listaVagas.innerHTML += `
// //     <div class="vaga" id='item${i}'>
// //       <div style='margin-bottom:20px;'>${sortedArray[i].registro} - ${sortedArray[i].body[2]}</div>
// //       <div class='imgDown' onclick="mostrarSobreVaga(this, 'txt${i}'), rolarParaElemento('item${i}')"></div>
// //       <a href="https://mail.google.com/mail/?view=cm&to=${sortedArray[i].email}&su=${sortedArray[i].body[2]}&body=${corpo}" target="_blank">ENVIAR CURRICULO</a>
// //       <div class='conteudoTexto' id='txt${i}'>${retornaP(i)}</div>
// //     </div>
// //     `;
// //   }
// // }

// function retornaP(a) {
//   let componente = sortedArray[a].body;
//   let p = "";

//   if (sortedArray[a].body) {
//     for (let i = 1; i < componente.length - 9; i++) {
//       p += `<p id='sobreVaga'>${sortedArray[a].body[i]}</p>`;
//     }
//   }

//   return p;
// }

// function rolarParaElemento(id) {
//   const elemento = document.getElementById(id);
//   if (elemento) {
//     elemento.scrollIntoView({ behavior: "smooth" });
//   }
// }

// function ordenarPorDataDescendente(arrayDeObjetos) {
//   function compararDatas(a, b) {
//     const dataA = new Date(
//       a.registro.replace(
//         /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})/,
//         "$3-$2-$1T$4:$5"
//       )
//     );
//     const dataB = new Date(
//       b.registro.replace(
//         /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})/,
//         "$3-$2-$1T$4:$5"
//       )
//     );
//     return dataB - dataA;
//   }

//   return arrayDeObjetos.sort(compararDatas);
// }

// function extrairData(frase) {
//   const padraoData = /(\d{2}\/\d{2}\/\d{4})/; // Expressão regular para capturar a data no formato "dd/mm/aaaa"
//   const resultado = padraoData.exec(frase);
//   if (resultado && resultado.length > 1) {
//     return resultado[1]; // O índice 1 contém a data capturada
//   } else {
//     return false; // Retorna false caso a data não seja encontrada na frase
//   }
// }

// function mostrarSobreVaga(i, id) {
//   if (containerTXT == false) {
//     let txt = document.querySelectorAll(".conteudoTexto");
//     for (let a = 0; a < txt.length; a++) {
//       txt[a].style.display = "none";
//     }

//     document.getElementById(id).style.display = "block";
//     i.style.transition = "0ms linear";
//     i.style.backgroundImage = `url('img/icons8-para-cima-com-quadrado-50.png')`;

//     i.parentNode.style.border = "2px solid #24aae7";

//     containerTXT = true;
//   } else {
//     i.style.backgroundImage = `url('img/icons8-para-baixo-com-quadrado-50.png')`;
//     document.getElementById(id).style.display = "none";
//     containerTXT = false;
//   }
// }