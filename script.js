document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script completo iniciado.");

    // Elementos da UI
    const initialScreen = document.getElementById('initial-screen');
    const scrollScreen = document.getElementById('scroll-screen');
    const inviteTextWrapper = document.getElementById('invite-text-wrapper');
    const backgroundMusic = document.getElementById('background-music');
    const crestImage = document.getElementById('crest-img');

    console.log("Elemento initialScreen:", initialScreen);
    console.log("Elemento scrollScreen:", scrollScreen);
    console.log("Elemento inviteTextWrapper:", inviteTextWrapper); // Verifique se este é encontrado
    // ... outros logs de elementos ...

    // Configurações
    const scrollOpenDuration = 20000;
    const typingSpeed = 40;
    let autoCloseTimer = null;
    let userHasInteracted = false;
    let audioCanPlay = false;

    // Texto do convite
    const invitationTextLines = [
        "Prezado(a) bruxinho(a),",
        "Um elfo fofoqueiro contou: no dia <strong>19/06</strong>, a bruxinha poderosa <strong>LUNNA</strong> completa mais um ciclo encantado! ✨🧁",
        "Pra celebrar, teremos um bolinho que desaparece, docinhos mágicos e sorrisos brilhando no escuro! Nada de dragões ou aulas de poções — é só um bolinho, mesmo!",
        "📅 Data encantada: <strong>19/06 (quinta-feira)</strong>",
        "⏰ Horário do feitiço: <strong>18h</strong> (sem atraso ou vira sapo!)",
        "📍 Local encantado: <strong>No Refúgio Secreto da Lunna</strong>",
        "Esperamos você pra espalhar magia e dar boas risadas! 🎉"
    ];

    // --- Lógica de Áudio ---
    if (backgroundMusic) {
        console.log("Configurando listeners para o elemento de áudio.");
        backgroundMusic.load();
        backgroundMusic.addEventListener('canplaythrough', () => {
            console.log("ÁUDIO: Evento 'canplaythrough' disparado. Áudio pronto para tocar.");
            audioCanPlay = true;
        });
        backgroundMusic.addEventListener('error', (e) => { /* ...lógica de erro como antes... */ });
    } else {
        console.error("ERRO CRÍTICO: Elemento de áudio 'background-music' NÃO ENCONTRADO.");
    }

    // --- Funções do Convite ---
    function typeWriterEffect(element, text, speed, callback) {
        let i = 0;
        // Verifica se o elemento existe antes de tentar modificar o innerHTML
        if (!element) {
            console.error("TEXTO ERRO: Elemento para typeWriterEffect é nulo. Texto:", text);
            if (callback) callback(); // Chama o callback para não travar a sequência
            return;
        }
        element.innerHTML = ""; // Limpa o conteúdo anterior
        element.classList.add('typing-cursor');

        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '<') { // Lida com tags HTML
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
                if (callback) callback(); // Chama a próxima função se houver
            }
        }
        type();
    }

    function writeAllLines(lines, index = 0) {
        // Verifica se inviteTextWrapper existe
        if (!inviteTextWrapper) {
            console.error("TEXTO ERRO: inviteTextWrapper não encontrado para escrever as linhas.");
            // Se não puder escrever, ainda agenda o fechamento para não ficar aberto indefinidamente
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
            autoCloseTimer = setTimeout(hideScroll, scrollOpenDuration);
            return;
        }

        if (index < lines.length) {
            const lineText = lines[index];
            const p = document.createElement('p');
            inviteTextWrapper.appendChild(p); // Adiciona o parágrafo ao wrapper
            typeWriterEffect(p, lineText, typingSpeed, () => { // Aplica o efeito ao parágrafo
                writeAllLines(lines, index + 1); // Chama recursivamente para a próxima linha
            });
        } else {
            // Todas as linhas foram escritas
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
            console.log("TEXTO: Todas as linhas escritas. Agendando fechamento do pergaminho.");
            autoCloseTimer = setTimeout(hideScroll, scrollOpenDuration);
        }
    }

    function tryPlayMusic() {
        if (backgroundMusic && audioCanPlay && userHasInteracted && backgroundMusic.paused) {
            console.log("ÁUDIO: Tentando tocar a música...");
            backgroundMusic.currentTime = 0;
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("ÁUDIO: Música tocando com sucesso!");
                }).catch(error => {
                    console.error("ÁUDIO: Erro ao tentar tocar música:", error.name, error.message);
                });
            }
        } else {
            // ... (logs de aviso como antes) ...
            let reason = [];
            if (!backgroundMusic) reason.push("elemento de áudio não encontrado");
            if (!audioCanPlay) reason.push("áudio não está pronto");
            if (!userHasInteracted) reason.push("usuário ainda não interagiu");
            if (backgroundMusic && !backgroundMusic.paused) reason.push("música não está pausada (ou já está tocando)");
            console.warn(`ÁUDIO: Não foi possível tocar a música agora. Razão(ões): ${reason.join(', ')}.`);
        }
    }

    function showScroll() {
        console.log("CONVITE: Função showScroll() chamada.");
        if (!initialScreen || !scrollScreen || !crestImage || !inviteTextWrapper) {
            console.error("CONVITE ERRO: Elementos da UI ausentes ao tentar mostrar o pergaminho.");
            return;
        }

        initialScreen.classList.remove('active');
        scrollScreen.classList.add('active');
        crestImage.style.display = 'block';

        // Verifica se inviteTextWrapper existe ANTES de tentar limpar e escrever
        if (inviteTextWrapper) {
            inviteTextWrapper.innerHTML = ''; // Limpa texto anterior
            writeAllLines(invitationTextLines); // Começa a escrever o texto
        } else {
            console.error("TEXTO ERRO: inviteTextWrapper é nulo em showScroll(). O texto não será exibido.");
        }

        tryPlayMusic();
    }

    function hideScroll() {
        console.log("CONVITE: Função hideScroll() chamada.");
        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("CONVITE ERRO: Elementos da UI ausentes ao tentar fechar o pergaminho.");
            return;
        }
        scrollScreen.classList.remove('active');
        crestImage.style.display = 'none';
        initialScreen.classList.add('active');

        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
            console.log("ÁUDIO: Música pausada.");
        }
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
    }

    // --- Event Listener Principal para Abrir o Convite ---
    if (initialScreen) {
        initialScreen.addEventListener('click', () => {
            console.log("CONVITE: CLIQUE DETECTADO em initialScreen!");
            if (!userHasInteracted) {
                userHasInteracted = true;
                console.log("ÁUDIO: Primeira interação do usuário registrada (flag userHasInteracted = true).");
            }
            showScroll();
        });
    } else {
        console.error("ERRO CRÍTICO: Elemento 'initial-screen' NÃO ENCONTRADO no HTML.");
    }
});