document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script iniciado.");

    // Elementos da UI
    const initialScreen = document.getElementById('initial-screen');
    const scrollScreen = document.getElementById('scroll-screen');
    const inviteTextWrapper = document.getElementById('invite-text-wrapper');
    const backgroundMusic = document.getElementById('background-music');
    const crestImage = document.getElementById('crest-img');

    console.log("Elemento initialScreen:", initialScreen);
    console.log("Elemento scrollScreen:", scrollScreen);
    console.log("Elemento crestImage:", crestImage);
    console.log("Elemento backgroundMusic:", backgroundMusic); // Log para a música

    // Configurações
    const scrollOpenDuration = 20000;
    const typingSpeed = 40;
    let autoCloseTimer = null;
    let userHasInteracted = false; // Nova flag para controlar a primeira interação

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
            console.log("Todas as linhas escritas. Agendando fechamento.");
            autoCloseTimer = setTimeout(hideScroll, scrollOpenDuration);
        }
    }

    function playMusic() {
        if (backgroundMusic && typeof backgroundMusic.play === 'function') {
            // Verifica se o usuário já interagiu ou se a música está pausada
            if (userHasInteracted && backgroundMusic.paused) {
                backgroundMusic.currentTime = 0; // Reinicia a música
                const playPromise = backgroundMusic.play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Autoplay iniciado com sucesso
                        console.log("Música tocando.");
                    }).catch(error => {
                        // Autoplay foi bloqueado.
                        console.error("Erro ao tentar tocar música:", error);
                        // Aqui, em alguns casos, o navegador pode mostrar um controle de play/pause nativo.
                        // Ou você poderia mostrar um botão "Tocar Música" se o autoplay falhar consistentemente.
                    });
                }
            } else if (!userHasInteracted) {
                console.log("Música não pode tocar ainda, aguardando interação do usuário.");
            }
        } else {
            console.warn("Elemento de música não encontrado ou não é um elemento de áudio válido.");
        }
    }

    function showScroll() {
        console.log("Função showScroll() chamada.");

        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("ERRO: Elemento 'initial-screen', 'scroll-screen' ou 'crest-img' NÃO ENCONTRADO.");
            return;
        }

        initialScreen.classList.remove('active');
        scrollScreen.classList.add('active');
        crestImage.style.display = 'block';
        console.log("Telas trocadas. Brasão visível.");

        inviteTextWrapper.innerHTML = '';
        writeAllLines(invitationTextLines);

        // Tenta tocar a música AGORA que o usuário interagiu (clicou para abrir)
        playMusic();
    }

    function hideScroll() {
        console.log("Função hideScroll() chamada.");

        if (!initialScreen || !scrollScreen || !crestImage) {
            console.error("ERRO: Elemento 'initial-screen', 'scroll-screen' ou 'crest-img' NÃO ENCONTRADO ao fechar.");
            return;
        }

        scrollScreen.classList.remove('active');
        crestImage.style.display = 'none';
        initialScreen.classList.add('active');
        console.log("Pergaminho fechado. Tela inicial reativada.");

        if (backgroundMusic && typeof backgroundMusic.pause === 'function' && !backgroundMusic.paused) {
            backgroundMusic.pause();
            console.log("Música pausada.");
        }
        // Não resetamos userHasInteracted aqui, pois a primeira interação já ocorreu.
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
    }

    // --- Event Listener para a primeira interação ---
    if (initialScreen) {
        initialScreen.addEventListener('click', () => {
            console.log("CLIQUE DETECTADO em initialScreen!");

            if (!userHasInteracted) {
                userHasInteracted = true; // Marca que o usuário interagiu pela primeira vez
                console.log("Primeira interação do usuário registrada.");

                // Tenta "desbloquear" o áudio, especialmente útil para iOS Safari.
                // Às vezes, um play() seguido de um pause() no primeiro evento de clique
                // é necessário para permitir futuros plays programáticos.
                if (backgroundMusic && typeof backgroundMusic.play === 'function') {
                    const unlockPromise = backgroundMusic.play();
                    if (unlockPromise !== undefined) {
                        unlockPromise.then(() => {
                            if (backgroundMusic && typeof backgroundMusic.pause === 'function') {
                                backgroundMusic.pause(); // Pausa imediatamente.
                                console.log("Áudio desbloqueado e pausado.");
                            }
                        }).catch((error) => {
                            console.warn("Tentativa de desbloqueio de áudio falhou (pode ser normal):", error);
                        });
                    }
                }
            }
            showScroll(); // Chama a função para mostrar o pergaminho (que agora tentará tocar a música)
        }, { once: false }); // { once: false } é o padrão, mas só para deixar claro que este listener continua ativo.
    } else {
        console.error("ERRO CRÍTICO: Elemento 'initial-screen' NÃO ENCONTRADO no HTML.");
    }
});