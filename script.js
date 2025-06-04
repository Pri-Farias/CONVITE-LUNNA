document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script completo iniciado.");

    // Elementos da UI
    const initialScreen = document.getElementById('initial-screen');
    const scrollScreen = document.getElementById('scroll-screen');
    const inviteTextWrapper = document.getElementById('invite-text-wrapper');
    const backgroundMusic = document.getElementById('background-music');
    const crestImage = document.getElementById('crest-img');

    // Log para verificar se os elementos foram encontrados
    console.log("Elemento initialScreen:", initialScreen);
    console.log("Elemento scrollScreen:", scrollScreen);
    console.log("Elemento crestImage:", crestImage);
    console.log("Elemento backgroundMusic:", backgroundMusic);
    console.log("Elemento inviteTextWrapper:", inviteTextWrapper);


    // Configurações
    const scrollOpenDuration = 20000;
    const typingSpeed = 40;
    let autoCloseTimer = null;
    let userHasInteracted = false; // Flag para a primeira interação do usuário
    let audioCanPlay = false; // Flag para indicar se o áudio está pronto (canplaythrough)

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
        backgroundMusic.load(); // Tenta carregar o áudio

        backgroundMusic.addEventListener('canplaythrough', () => {
            console.log("ÁUDIO: Evento 'canplaythrough' disparado. Áudio pronto para tocar.");
            audioCanPlay = true;
        });

        backgroundMusic.addEventListener('error', (e) => {
            console.error("ÁUDIO ERRO: Ocorreu um erro com o elemento de áudio.", e);
            let errorMsg = "Erro desconhecido no áudio.";
            if (backgroundMusic.error) {
                switch (backgroundMusic.error.code) {
                    case MediaError.MEDIA_ERR_ABORTED: errorMsg = 'Reprodução abortada.'; break;
                    case MediaError.MEDIA_ERR_NETWORK: errorMsg = 'Erro de rede ao carregar áudio.'; break;
                    case MediaError.MEDIA_ERR_DECODE: errorMsg = 'Erro de decodificação. Arquivo corrompido ou formato inválido.'; break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMsg = 'Fonte de áudio não suportada. Verifique o caminho/formato.'; break;
                    default: errorMsg = `Erro inesperado no áudio (código: ${backgroundMusic.error.code}).`; break;
                }
            }
            console.error("ÁUDIO ERRO DETALHADO:", errorMsg);
            // alert("Problema ao carregar a música: " + errorMsg); // Pode ser muito intrusivo
        });

        // Alguns navegadores precisam de um "empurrãozinho" no primeiro gesto do usuário
        const unlockAudio = () => {
            if (!userHasInteracted) { // Só executa na primeira interação
                userHasInteracted = true;
                console.log("ÁUDIO: Primeira interação do usuário registrada.");
                if (backgroundMusic.paused) { // Só tenta tocar se estiver pausado
                    const promise = backgroundMusic.play();
                    if (promise !== undefined) {
                        promise.then(() => {
                            backgroundMusic.pause(); // Pausa imediatamente, só para "desbloquear"
                            console.log("ÁUDIO: Desbloqueio tentado e áudio pausado.");
                        }).catch(error => {
                            console.warn("ÁUDIO: Tentativa de desbloqueio falhou (pode ser normal em alguns navegadores/cenários):", error.name, error.message);
                        });
                    }
                }
                // Remove o listener de desbloqueio para não ser chamado novamente
                if(initialScreen) initialScreen.removeEventListener('click', unlockAudio);
                document.body.removeEventListener('click', unlockAudio); // Se tiver adicionado ao body
            }
        };

        if (initialScreen) {
             // Adiciona o listener para a primeira interação para desbloquear o áudio
            initialScreen.addEventListener('click', unlockAudio, { once: true });
        } else {
             // Fallback se initialScreen não estiver pronto, tenta no body (menos ideal)
            document.body.addEventListener('click', unlockAudio, { once: true });
            console.warn("initialScreen não encontrado para o listener de desbloqueio de áudio, usando document.body como fallback.");
        }


    } else {
        console.error("ERRO CRÍTICO: Elemento de áudio 'background-music' NÃO ENCONTRADO.");
    }


    // --- Funções do Convite ---
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
            console.log("TEXTO: Todas as linhas escritas. Agendando fechamento do pergaminho.");
            autoCloseTimer = setTimeout(hideScroll, scrollOpenDuration);
        }
    }

    function tryPlayMusic() {
        if (backgroundMusic && audioCanPlay && userHasInteracted) { // Verifica todas as condições
            if (backgroundMusic.paused) { // Só toca se estiver pausado
                console.log("ÁUDIO: Tentando tocar a música...");
                backgroundMusic.currentTime = 0; // Reinicia se for tocar novamente
                const playPromise = backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log("ÁUDIO: Música tocando com sucesso!");
                    }).catch(error => {
                        console.error("ÁUDIO: Erro ao tentar tocar música após interação:", error.name, error.message);
                        if (error.name === "NotAllowedError") {
                            // Isso ainda pode acontecer se a interação não foi "direta" o suficiente
                            // ou se o navegador tem políticas muito estritas.
                            console.warn("ÁUDIO: NotAllowedError - o navegador bloqueou a reprodução.");
                        }
                    });
                }
            } else {
                console.log("ÁUDIO: Música já está tocando ou não está pausada.");
            }
        } else {
            let reason = [];
            if (!backgroundMusic) reason.push("elemento de áudio não encontrado");
            if (!audioCanPlay) reason.push("áudio não está pronto (canplaythrough não disparou)");
            if (!userHasInteracted) reason.push("usuário ainda não interagiu");
            console.warn(`ÁUDIO: Não foi possível tentar tocar a música. Razão(ões): ${reason.join(', ')}.`);
        }
    }

    function showScroll() {
        console.log("CONVITE: Função showScroll() chamada.");

        if (!initialScreen || !scrollScreen || !crestImage || !inviteTextWrapper) {
            console.error("CONVITE ERRO: Um ou mais elementos da UI (initialScreen, scrollScreen, crestImage, inviteTextWrapper) não foram encontrados.");
            return;
        }

        initialScreen.classList.remove('active');
        scrollScreen.classList.add('active');
        crestImage.style.display = 'block';
        console.log("CONVITE: Telas trocadas, brasão visível.");

        inviteTextWrapper.innerHTML = '';
        writeAllLines(invitationTextLines);

        tryPlayMusic(); // Tenta tocar a música
    }

    function hideScroll() {
        console.log("CONVITE: Função hideScroll() chamada.");

        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("CONVITE ERRO: Elementos da UI não encontrados ao tentar fechar.");
            return;
        }

        scrollScreen.classList.remove('active');
        crestImage.style.display = 'none';
        initialScreen.classList.add('active');
        console.log("CONVITE: Pergaminho fechado, tela inicial reativada.");

        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
            console.log("ÁUDIO: Música pausada.");
        }
        // userHasInteracted e audioCanPlay permanecem como estão.
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
    }

    // --- Event Listener Principal para Abrir o Convite ---
    if (initialScreen) {
        initialScreen.addEventListener('click', () => {
            console.log("CONVITE: CLIQUE DETECTADO em initialScreen!");
            // A função unlockAudio já foi chamada via {once: true} se esta não for a primeira vez.
            // Se for a primeira, unlockAudio será chamada pelo listener específico.
            // O importante é que userHasInteracted será true.
            showScroll();
        });
    } else {
        console.error("ERRO CRÍTICO: Elemento 'initial-screen' NÃO ENCONTRADO no HTML. O convite não abrirá.");
    }
});