document.addEventListener('DOMContentLoaded', () => {
    const telaInicial = document.getElementById('tela-inicial');
    // const cartaFechada = document.getElementById('carta-fechada'); // Não usado diretamente em funções
    const instrucaoAbrir = document.getElementById('instrucao-abrir');

    const cartaContainer = document.getElementById('carta-container');
    const cartaAberta = document.getElementById('carta-aberta');
    const textoConviteEl = document.getElementById('texto-convite');
    const musicaFundo = document.getElementById('musica-fundo');
    const corujaAnimacao = document.getElementById('coruja-animacao');
    // --- NOVO TEXTO DO CONVITE ---
    const textoCompleto = `Prezado(a) bruxinho(a),\n\nRecebemos informações ultra-secretas (vazadas por um elfo fofoqueiro) de que no dia 19 de junho, uma bruxinha poderosa chamada Lunna vai completar mais um ciclo encantado! 🪄🎂\n\nE como manda a tradição da magia... vai ter: bolinho que desaparece, docinho que hipnotiza, sorrisos que brilham no escuro e amigos mágicos reunidos pra celebrar!\n\n📅 Data encantada: 19/06 (quinta-feira)\n⏰ Horário do feitiço: 18h, sem atraso ou vira sapo!\n📍 Local encantado: No Refúgio Secreto da Lunna. \n\nMas calma, nada de dragões, vassouras desgovernadas ou aulas de poções! É só um bolinho mesmo, daqueles que somem rapidinho quando a gente diz "Aparecium Brigadeirus!" 🍰✨`;
 let timeoutFecharCarta;
    const tempoParaFecharCartaAberta = 15000; // 15 segundos após o texto terminar de ser escrito. AJUSTE SE NECESSÁRIO.

    function efeitoMaquinaDeEscrever(texto, elemento, callback) {
        let i = 0;
        elemento.innerHTML = ''; // Limpa o conteúdo anterior
        function escrever() {
            if (i < texto.length) {
                // Para interpretar tags HTML como <strong> no meio do texto
                if (texto.substring(i).startsWith("<strong>")) {
                    let endTagIndex = texto.indexOf("</strong>", i);
                    if (endTagIndex === -1) { // Caso não encontre a tag de fechamento
                        elemento.innerHTML += texto.charAt(i); // Escreve como texto normal
                        i++;
                    } else {
                        elemento.innerHTML += texto.substring(i, endTagIndex + 9);
                        i = endTagIndex + 9;
                    }
                } else {
                    elemento.innerHTML += texto.charAt(i);
                    i++;
                }
                setTimeout(escrever, 35); // Ajuste a velocidade aqui (ms)
            } else if (callback) {
                callback(); // Chama o callback quando o texto termina
            }
        }
        escrever();
    }

    function fecharCartaEMostrarCoruja() {
        console.log("Iniciando fecharCartaEMostrarCoruja..."); // Log para depuração

        // Para a música com fade out
        if (musicaFundo && !musicaFundo.paused) {
            let volume = musicaFundo.volume;
            const fadeOutInterval = setInterval(() => {
                volume -= 0.1;
                if (volume < 0.1) { // Deixar um mínimo para não estourar
                    volume = 0;
                }
                musicaFundo.volume = volume;
                if (musicaFundo.volume <= 0) {
                    musicaFundo.pause();
                    musicaFundo.currentTime = 0;
                    musicaFundo.volume = 1; // Restaurar volume para a próxima vez
                    clearInterval(fadeOutInterval);
                    console.log("Música parada.");
                }
            }, 100);
        } else {
            console.log("Música não estava tocando ou elemento não encontrado.");
        }

        // Adiciona classe para animar o fechamento da carta aberta
        if (cartaContainer) {
            cartaContainer.classList.add('fechando');
        } else {
            console.error("Elemento #carta-container não encontrado para fechar.");
            return; // Sai da função se o container não existe
        }
        
        setTimeout(() => {
            console.log("Timeout interno de fecharCartaEMostrarCoruja: Escondendo carta aberta, mostrando inicial e coruja.");
            if (cartaAberta) {
                cartaAberta.style.opacity = '0';
                cartaAberta.style.transform = 'scale(0.8)';
            }
            if (cartaContainer) {
                cartaContainer.classList.remove('visivel');
                cartaContainer.classList.add('escondido');
                cartaContainer.classList.remove('fechando'); // Limpa a classe de animação
            }
            
            if (telaInicial) {
                telaInicial.classList.remove('escondido');
                void telaInicial.offsetWidth; // Forçar reflow
                telaInicial.style.opacity = '1';
                telaInicial.style.transform = 'scale(1)';
            }
            if (instrucaoAbrir) { // Garantir que a instrução de abrir não reapareça
                instrucaoAbrir.classList.add('escondido');
            }

            if (corujaAnimacao) {
                corujaAnimacao.classList.remove('escondido');
                void corujaAnimacao.offsetWidth; // Forçar reflow
                corujaAnimacao.classList.add('pousar');
                console.log("Coruja animada.");
            } else {
                console.error("Elemento #coruja-animacao não encontrado.");
            }

        }, 700); // Duração da animação de fechar (deve corresponder ao CSS transition)
    }

    function abrirCarta() {
        console.log("Abrindo carta...");
        if (!telaInicial || !instrucaoAbrir || !cartaContainer || !cartaAberta || !musicaFundo || !textoConviteEl) {
            console.error("Um ou mais elementos essenciais não foram encontrados no DOM para abrirCarta.");
            return; // Impede a execução se elementos cruciais faltarem
        }

        telaInicial.style.opacity = '0';
        telaInicial.style.transform = 'scale(0.5)';

        setTimeout(() => {
            telaInicial.classList.add('escondido');
            instrucaoAbrir.classList.add('escondido');

            cartaContainer.classList.remove('escondido');
            // Forçar reflow para garantir que a transição de entrada do container funcione
            void cartaContainer.offsetWidth; 
            cartaContainer.classList.add('visivel');
            
            // Forçar reflow para garantir que a transição de entrada da carta aberta funcione
            void cartaAberta.offsetWidth; 
            cartaAberta.style.opacity = '1';
            cartaAberta.style.transform = 'scale(1)';

            musicaFundo.play().catch(error => {
                console.log("Autoplay da música foi bloqueado:", error);
                // Opcional: Mostrar um botão "Tocar Música" se bloqueado
            });

            // O callback aqui agendará o fechamento da carta
            efeitoMaquinaDeEscrever(textoCompleto, textoConviteEl, () => {
                console.log("Texto terminou de ser escrito. Agendando fechamento da carta em " + tempoParaFecharCartaAberta + "ms.");
                clearTimeout(timeoutFecharCarta); // Limpa qualquer timeout anterior (segurança)
                timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharCartaAberta);
            });

        }, 500); // Tempo da animação de fade out da carta fechada
    }


    // Event listener para clicar na carta fechada
    if (telaInicial) {
        telaInicial.addEventListener('click', abrirCarta);
    } else {
        console.error("Elemento #tela-inicial não encontrado para adicionar event listener.");
    }

    // Opcional: se o usuário clicar na carta aberta, cancelar o fechamento automático
    // Isso permite que ele leia por mais tempo se quiser.
    if (cartaAberta) {
        cartaAberta.addEventListener('click', () => {
            if (timeoutFecharCarta) {
                clearTimeout(timeoutFecharCarta);
                console.log("Fechamento automático da carta CANCELADO pelo clique do usuário.");
                // Você pode optar por reagendar com um tempo maior aqui se desejar,
                // ou simplesmente deixar que não feche mais automaticamente.
                // Exemplo: timeoutFecharCarta = setTimeout(fecharCartaEMostrarCoruja, tempoParaFecharCartaAberta * 2);
            }
        });
    }
});