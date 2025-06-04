document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script iniciado."); // Log 1

    // Elementos da UI
    const initialScreen = document.getElementById('initial-screen');
    const scrollScreen = document.getElementById('scroll-screen');
    const inviteTextWrapper = document.getElementById('invite-text-wrapper');
    const backgroundMusic = document.getElementById('background-music');
    const crestImage = document.getElementById('crest-img');

    // Log para verificar se os elementos foram encontrados
    console.log("Elemento initialScreen:", initialScreen); // Log 2
    console.log("Elemento scrollScreen:", scrollScreen);   // Log 3
    console.log("Elemento crestImage:", crestImage);     // Log 4

    // Configurações
    const scrollOpenDuration = 20000; // Duração que o pergaminho fica aberto
    const typingSpeed = 40;    // Velocidade da "máquina de escrever"
    let autoCloseTimer = null;
    let musicPlayedOnce = false;

    // Texto do convite
    const invitationTextLines = [
        "Prezado(a) bruxinho(a),",
        "Um elfo fofoqueiro contou: no dia <strong>19/06</strong>, a bruxinha poderosa <strong>LUNNA</strong> completa mais um ciclo encantado! ✨🧁",
        "Pra celebrar, teremos um bolinho que desaparece, docinhos mágicos e sorrisos brilhando no escuro! Nada de dragões ou aulas de poções — é só um bolinho, mesmo!",
        "📅 Data encantada: <strong>19/06 (quarta)</strong>",
        "⏰ Horário do feitiço: <strong>18h</strong> (sem atraso ou vira sapo!)",
        "📍 Local encantado: <strong>No Refúgio Secreto da Lunna</strong>",
        "Esperamos você pra espalhar magia e dar boas risadas! 🎉"
    ];

    function typeWriterEffect(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = "";
        element.classList.add('typing-cursor');
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '<') {
                    let tagEnd = text.indexOf('>', i);
                    if (tagEnd !== -1) {
                        element.innerHTML += text.substring(i, tagEnd + 1);
                        i = tagEnd;
                    }
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-cursor');
                if (callback) callback();
            }
        }
        type();
    }

    function writeAllLines(lines, index = 0) {
        if (index < lines.length) {
            const lineText = lines[index];
            const p = document.createElement('p');
            inviteTextWrapper.appendChild(p);
            typeWriterEffect(p, lineText, typingSpeed, () => {
                writeAllLines(lines, index + 1);
            });
        } else {
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
            console.log("Todas as linhas escritas. Agendando fechamento."); // Log 5
            autoCloseTimer = setTimeout(hideScroll, scrollOpenDuration);
        }
    }

    function showScroll() {
        console.log("Função showScroll() chamada."); // Log 6

        // Verifica se os elementos cruciais existem antes de tentar usá-los
        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("ERRO: Elemento 'initial-screen', 'scroll-screen' ou 'crest-img' NÃO ENCONTRADO no HTML. Verifique os IDs!");
            return; // Para a execução da função se elementos não forem achados
        }

        initialScreen.classList.remove('active');
        scrollScreen.classList.add('active');
        crestImage.style.display = 'block'; // Mostra o brasão
        console.log("Telas trocadas. Brasão visível.");

        inviteTextWrapper.innerHTML = ''; // Limpa texto anterior
        writeAllLines(invitationTextLines); // Começa a escrever

        // Lógica da música
        if (backgroundMusic && typeof backgroundMusic.play === 'function') {
            if (!musicPlayedOnce || backgroundMusic.paused) {
                backgroundMusic.currentTime = 0;
                backgroundMusic.play().catch(error => {
                    console.warn("Música não pôde ser iniciada:", error);
                });
                musicPlayedOnce = true;
            }
        } else {
            console.warn("Elemento de música não encontrado ou não é um elemento de áudio válido.");
        }
    }

    function hideScroll() {
        console.log("Função hideScroll() chamada."); // Log 7

        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("ERRO: Elemento 'initial-screen', 'scroll-screen' ou 'crest-img' NÃO ENCONTRADO ao tentar fechar.");
            return;
        }

        scrollScreen.classList.remove('active');
        crestImage.style.display = 'none'; // Esconde o brasão
        initialScreen.classList.add('active');
        console.log("Pergaminho fechado. Tela inicial reativada.");

        if (backgroundMusic && typeof backgroundMusic.pause === 'function' && !backgroundMusic.paused) {
            backgroundMusic.pause();
        }
        musicPlayedOnce = false;
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
    }

    // --- Event Listeners ---
    // Adicionada verificação para garantir que 'initialScreen' existe
    if (initialScreen) {
        initialScreen.addEventListener('click', () => {
            console.log("CLIQUE DETECTADO em initialScreen!"); // Log 8
            
            // Lógica de "desbloqueio" da música
            if (backgroundMusic && typeof backgroundMusic.play === 'function' && backgroundMusic.paused) {
                const promise = backgroundMusic.play();
                if (promise !== undefined) {
                    promise.then(_ => {
                        if (backgroundMusic && typeof backgroundMusic.pause === 'function') {
                             backgroundMusic.pause(); // Pausa imediatamente, só queríamos a permissão
                        }
                    }).catch(error => {
                        // Silencioso aqui, o warning principal é no play() dentro de showScroll
                    });
                }
            }
            showScroll(); // Chama a função para mostrar o pergaminho
        });
    } else {
        console.error("ERRO CRÍTICO: Elemento 'initial-screen' NÃO ENCONTRADO no HTML. O clique não funcionará."); // Log 9
    }
});