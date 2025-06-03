document.addEventListener('DOMContentLoaded', () => {
    const telaInicial = document.getElementById('tela-inicial');
    const cartaFechada = document.getElementById('carta-fechada');
    const instrucaoAbrir = document.getElementById('instrucao-abrir');

    const cartaContainer = document.getElementById('carta-container');
    const cartaAberta = document.getElementById('carta-aberta');
    const textoConviteEl = document.getElementById('texto-convite');
    const musicaFundo = document.getElementById('musica-fundo');
    const corujaAnimacao = document.getElementById('coruja-animacao');

    // Elementos da área de confirmação
    const areaConfirmacao = document.getElementById('area-confirmacao');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const mensagemConfirmado = document.getElementById('mensagem-confirmado');

    // --- NOVO TEXTO DO CONVITE ---
    const textoCompleto = `Prezado(a) bruxinho(a),\n\nRecebemos informações ultra-secretas (vazadas por um elfo fofoqueiro) de que no dia 19 de junho, uma bruxinha poderosa chamada Lunna vai completar mais um ciclo encantado! 🪄🎂\n\nE como manda a tradição da magia... vai ter: bolinho que desaparece, docinho que hipnotiza, sorrisos que brilham no escuro e amigos mágicos reunidos pra celebrar!\n\n📅 Data encantada: 19/06 (quinta-feira)\n⏰ Horário do feitiço: 18h, sem atraso ou vira sapo!\n📍 Lugar secreto (mas nem tanto): Rua 13 Polar, nº71 – Vila Velha\n\nMas calma, nada de dragões, vassouras desgovernadas ou aulas de poções! É só um bolinho mesmo, daqueles que somem rapidinho quando a gente diz "Aparecium Brigadeirus!" 🍰✨`;

    let timeoutFecharCarta;
    const tempoParaFecharSemInteracao = 18000; // 18 segundos para fechar se não houver interação com o botão
    const tempoParaFecharAposConfirmacao = 7000; // 7 segundos para fechar após confirmar presença

    function efeitoMaquinaDeEscrever(texto, elemento, callback) {
        let i = 0;
        elemento.innerHTML = '';
        function escrever() {
            if (i < texto.length) {
                // Para interpretar tags HTML como <strong> no meio do texto
                if (texto.substring(i).startsWith("<strong>")) {
                    let endTagIndex = texto.indexOf("</strong>", i);
                    elemento.innerHTML += texto.substring(i, endTagIndex + 9);
                    i = endTagIndex + 9;
                } else if (texto.substring(i).startsWith("<em>")) { // Exemplo se quisesse usar <em>
                    let endTagIndex = texto.indexOf("</em>", i);
                    elemento.innerHTML += texto.substring(i, endTagIndex + 5);
                    i = endTagIndex + 5;
                }
                else {
                    elemento.innerHTML += texto.charAt(i);
                    i++;
                }
                setTimeout(escrever, 35); // Ajuste a velocidade aqui (ms)
            } else if (callback) {
                callback();
            }
        }
        escrever();
    }

    function mostrarAreaConfirmacao() {
        areaConfirmacao.classList.remove('escondido');
        areaConfirmacao.classList.add('visivel-block'); // Usar a classe correta para display block
        // Agendar o fechamento da carta se não houver interação com o botão
        clearTimeout(timeoutFecharCarta); // Limpa timeout anterior se houver
        timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharSemInteracao);
    }

    function abrirCarta() {
        telaInicial.style.opacity = '0';
        telaInicial.style.transform = 'scale(0.5)';

        setTimeout(() => {
            telaInicial.classList.add('escondido');
            instrucaoAbrir.classList.add('escondido');

            cartaContainer.classList.remove('escondido');
            cartaContainer.classList.add('visivel');
            
            void cartaAberta.offsetWidth; 
            
            cartaAberta.style.opacity = '1';
            cartaAberta.style.transform = 'scale(1)';

            musicaFundo.play().catch(error => {
                console.log("Autoplay foi bloqueado:", error);
            });

            efeitoMaquinaDeEscrever(textoCompleto, textoConviteEl, mostrarAreaConfirmacao);

        }, 500);
    }

    function fecharCartaEMostrarCoruja() {
        // Para a música ao fechar
        if (!musicaFundo.paused) {
            let volume = musicaFundo.volume;
            const fadeOutInterval = setInterval(() => {
                volume -= 0.1;
                if (volume < 0) {
                    volume = 0;
                }
                musicaFundo.volume = volume;
                if (musicaFundo.volume <= 0) {
                    musicaFundo.pause();
                    musicaFundo.currentTime = 0; // Opcional: resetar para o início
                    musicaFundo.volume = 1; // Restaurar volume para a próxima vez
                    clearInterval(fadeOutInterval);
                }
            }, 100); // Diminui o volume a cada 100ms
        }


        cartaContainer.classList.add('fechando');
        
        setTimeout(() => {
            cartaAberta.style.opacity = '0';
            cartaAberta.style.transform = 'scale(0.8)';
            cartaContainer.classList.remove('visivel');
            cartaContainer.classList.add('escondido');
            
            telaInicial.classList.remove('escondido');
            void telaInicial.offsetWidth;
            telaInicial.style.opacity = '1';
            telaInicial.style.transform = 'scale(1)';
            instrucaoAbrir.classList.add('escondido'); // Não mostrar "Toque para abrir"

            corujaAnimacao.classList.remove('escondido');
            void corujaAnimacao.offsetWidth;
            corujaAnimacao.classList.add('pousar');

        }, 700);
    }

    // Event listener para clicar na carta fechada
    telaInicial.addEventListener('click', abrirCarta);

    // Event listener para o botão de confirmação
    btnConfirmar.addEventListener('click', () => {
        clearTimeout(timeoutFecharCarta); // Cancela o fechamento automático ao interagir

        const nomeConvidado = prompt("Por favor, digite o nome do(a) bruxinho(a) para confirmar a presença:");

        if (nomeConvidado && nomeConvidado.trim() !== "") {
            mensagemConfirmado.textContent = `Presença mágica de ${nomeConvidado.trim()} confirmada! Prepare sua varinha! 🦉`;
            mensagemConfirmado.classList.remove('escondido');
            btnConfirmar.classList.add('escondido'); // Esconde o botão após a confirmação
            
            // Agenda o fechamento da carta após a confirmação
            timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharAposConfirmacao);
        } else {
            // Se o usuário cancelar ou não digitar nada, reagendar o fechamento
            // para que a carta não fique aberta indefinidamente.
            alert("Parece que você não digitou um nome. A coruja precisa de um nome para a lista! 😉");
            timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharSemInteracao / 2); // Fecha mais rápido se ele cancelou
        }
    });

    // Opcional: se quiser parar o fechamento automático ao interagir com a carta aberta (além do botão)
    // cartaAberta.addEventListener('click', (event) => {
    //     // Não cancelar se o clique for no botão de confirmar
    //     if (event.target !== btnConfirmar && !btnConfirmar.contains(event.target)) {
    //         clearTimeout(timeoutFecharCarta);
    //         console.log("Fechamento automático cancelado pelo clique na carta.");
    //         // Você pode re-agendar aqui se quiser um tempo maior de leitura após o clique
    //         // timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharSemInteracao * 2);
    //     }
    // });
});