const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const fs = require('fs');


//GLOBAL +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  async function buscador(data) {
    console.log(`### Buscando dados... ###`)
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.goto(`${data.link}`);

      const resultado = await page.evaluate(data.script);

      await browser.close();
      return resultado; 
    } catch (err) {
      console.error('### Erro durante a busca: ###');
      console.error(err);
      return [];
    }
  }
  async function salvar(data) {
    let arrayComoString;
    if(data.type == 'txt'){
      arrayComoString = data.conteudo
    }
    else if(data.type == 'array'){
        arrayComoString = `const vagas = ${JSON.stringify(data.conteudo, null, 2)};`;
    }
    else{
      arrayComoString = `module.exports = ${JSON.stringify(data.conteudo, null, 2)};`;
    }
    
    try {
      await fs.promises.writeFile("C:/Users/Gabriel/Documents/GitHub/Meus-Projetos/Auto-Vagas/"+data.nome, arrayComoString, 'utf8');
      console.log(`### Salvarndo arquivo: ${data.nome}. ###`)
    
    } catch (err) {
      console.error('### Erro ao criar o arquivo! ###');
      console.error(err);
    }
  }
  function registrar() {
    const dataAtual = new Date();
  
    // Obtém os componentes da data
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();
  
    // Obtém os componentes da hora
    const hora = String(dataAtual.getHours()).padStart(2, "0");
    const minuto = String(dataAtual.getMinutes()).padStart(2, "0");
  
    // Retorna a data e hora formatada
    return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
  }

// #1 - PASSO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    async function acessarPaginas() {
        console.log(`### Pegando vagas do dia... ###`);

        try {
        const resultado = await buscador({
            link: 'https://onlinevagas.com.br/',
            script: function () {
            let vagasQtd = document.querySelectorAll('.post-box-title a').length;
            let resultado = [];

            for (let i = 0; i < vagasQtd; i++) {
                resultado.push(document.querySelectorAll('.post-box-title a')[i].href);
            }
            return resultado;
            },
        });
        buscarEmails(resultado);

        } catch (err) {
        console.error('### Erro durante pegar vagas do dia ###');
        console.error(err);
        }
    }


// #2 - PASSO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    async function buscarEmails(array) {
        console.log('### Acessando páginas... ###');

        let resultados = [];

        for (const url of array) {
            try {
                let resultado = await buscador({
                    link: url,
                    script: function () {
                        let arroba = '';

                        function verificarArroba(paragrafo) {
                            if (paragrafo.includes('@')) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        let x = document.querySelectorAll('p').length;
                        let allP = []

                        for (let i = 0; i < x; i++) {
                            allP.push(document.querySelectorAll('p')[i].innerText)

                            let l = verificarArroba(document.querySelectorAll('p')[i].innerText);

                            if (l === true) {
                                arroba += document.querySelectorAll('p')[i].innerText + ' ';
                            }
                        }

                        let result = {
                            vaga: document.querySelector('h1 span').innerText,
                            email: arroba.trim(),
                            body: allP
                        };

                        return result;
                    },
                });

                resultados.push(resultado); // Correção: Adicionando o resultado ao array

            } catch (err) {
                console.error(`### Erro durante a busca da URL ${url}: ###`);
            }
        }
        tratarEmail(resultados);
    }


// #3 - PASSO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    async function tratarEmail(vagas) {
        console.log(`### Tratando emails... ###`);

        function extrairEmail(vagaInfo) {
            const { email, vaga, body } = vagaInfo;
            const emailStartIndex = email.indexOf("e-mail:");

            if (emailStartIndex !== -1) {
                const emailText = email.slice(emailStartIndex + 7).trim();
                return { vaga, email: emailText.split(',')[0], body };
            }
            return null; 
        }

        try {
            const emailsVagasExtraidos = vagas.map((vaga) => extrairEmail(vaga)).filter((info) => info !== null);

            gerrarArquivo(emailsVagasExtraidos)

        } catch (err) {
            console.error('Erro ao tratar emails', err);
        }
    }


// #4 - PASSO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let registro = require('./registro.js');

    function verificaExistenciaVaga(objeto, arrayDeObjetos) {
        // Verificar se o array está vazio ou não é um array
        if (!Array.isArray(arrayDeObjetos) || arrayDeObjetos.length === 0) {
        return false;
        }
    
        // Verificar se algum objeto do array possui a propriedade "vaga" com o mesmo valor do objeto fornecido
        return arrayDeObjetos.some(item => item.vaga === objeto.vaga);
    }

    
    function gerrarArquivo(data){
        console.log('### Gerando arquivo TXT ###')

        try{
            let arquivoTxt = ''
            let novasVagas = 0

            data.forEach((objeto)=>{

                //verificar se ja existe no registro
                const objetoParaVerificar = objeto ;
                const resultado = verificaExistenciaVaga(objetoParaVerificar, registro);
                if(resultado == false){
                    novasVagas++
                    if(objeto.registro == 'undefined' || objeto.registro == undefined || objeto.registro == ''){
                        objeto.registro = registrar()
                        objeto.body = objeto.body
                    }
                    registro.push(objeto)
                }


                arquivoTxt += `
                Registro: ${objeto.registro},
                Vaga: ${objeto.vaga},
                Email: ${objeto.email}.
            
            `
            })


            salvar({
                conteudo: arquivoTxt, 
                nome: 'Vagas.txt',
                type: 'txt'

            })
            salvar({
                conteudo: registro, 
                nome: 'registro.js',
            })
            salvar({
                conteudo: registro, 
                nome: 'arrayVagas.js',
                type: 'array'
            })

            setTimeout(() => {
                console.log(`
                //+++++++++++++++++++++++++++++++++++++++++++++//
                // FIM - ${novasVagas} Novas vagas encontradas //
                //+++++++++++++++++++++++++++++++++++++++++++++//
                `)
             
            }, 5000);
        }catch(err){
            console.log('Erro ao salvar arquivo txt ' + err)
        }
    }



acessarPaginas()