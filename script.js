document.addEventListener('DOMContentLoaded', () => {
    const closedLetterScreen = document.getElementById('closed-letter-screen');
    const scrollScreen = document.getElementById('scroll-screen');
    const backgroundMusic = document.getElementById('background-music');

    let isScrollOpen = false;
    let autoCloseTimer;
    let musicCanPlay = false; // Flag para controlar a reprodução de música

    // Tenta tocar a música silenciosamente para habilitar a reprodução em alguns navegadores
    // Ou aguarda a primeira interação do usuário
    function attemptMusicPlay() {
        if (musicCanPlay) return;
        backgroundMusic.play().then(() => {
            musicCanPlay = true;
            // Se quiser que a música pare inicialmente:
            // backgroundMusic.pause();
            // backgroundMusic.currentTime = 0;
        }).catch(error => {
            console.log("Reprodução automática bloqueada, aguardando interação do usuário.", error);
            // A música vai tocar no primeiro clique se o autoplay falhar
        });
    }

    // Chamar a tentativa de play. Em muitos navegadores modernos, isso
    // só funcionará após uma interação do usuário.
    // Poderia ser um botão "Clique para entrar" ou algo assim antes de mostrar a carta.
    // Por agora, vamos tentar no load, e o clique na carta garantirá.
    // document.body.addEventListener('click', attemptMusicPlay, { once: true });
    // Para esta aplicação específica, tocar no clique da carta é mais apropriado.


    function openScroll() {
        if (isScrollOpen) return;

        // Toca a música quando a carta é aberta
        if (musicCanPlay) {
            backgroundMusic.currentTime = 0; // Reinicia a música
            backgroundMusic.play();
        } else {
            // Tenta tocar pela primeira vez
            backgroundMusic.play().then(() => {
                musicCanPlay = true;
            }).catch(error => {
                console.log("Música não pôde ser tocada: ", error);
            });
        }


        closedLetterScreen.classList.remove('active');
        closedLetterScreen.classList.add('hidden'); // Animação de saída

        // Um pequeno atraso para a animação de saída da carta ocorrer antes da entrada do pergaminho
        setTimeout(() => {
            scrollScreen.classList.remove('hidden');
            scrollScreen.classList.add('active');
            isScrollOpen = true;

            // Definir timer para fechar automaticamente após alguns segundos
            // 10000ms = 10 segundos (ajuste conforme necessário)
            autoCloseTimer = setTimeout(closeScroll, 10000);
        }, 500); // Tempo ligeiramente menor que a transição CSS para sobreposição suave
    }

    function closeScroll() {
        if (!isScrollOpen) return;

        clearTimeout(autoCloseTimer);

        if (musicCanPlay) {
            backgroundMusic.pause();
            // Opcional: voltar ao início: backgroundMusic.currentTime = 0;
        }

        scrollScreen.classList.remove('active');
        scrollScreen.classList.add('closing'); // Animação de fechamento mágico

        // A animação do pergaminho leva ~0.7s. A carta reaparece depois.
        setTimeout(() => {
            scrollScreen.classList.add('hidden'); // Esconde completamente
            scrollScreen.classList.remove('closing'); // Reseta para a próxima abertura

            closedLetterScreen.classList.remove('hidden');
            closedLetterScreen.classList.add('reappearing'); // Animação de reentrada

            setTimeout(() => { // Garante que a animação de reaparecimento termine
                closedLetterScreen.classList.remove('reappearing');
                closedLetterScreen.classList.add('active');
            }, 700);

            isScrollOpen = false;
        }, 700);
    }

    closedLetterScreen.addEventListener('click', () => {
        if (!isScrollOpen) {
            openScroll();
        }
    });

    // Opcional: fechar o pergaminho ao clicar nele
    // scrollScreen.addEventListener('click', () => {
    //     if (isScrollOpen) {
    //         closeScroll();
    //     }
    // });

    // Para navegadores que bloqueiam autoplay, o primeiro clique em qualquer lugar
    // pode ser usado para 'desbloquear' o áudio.
    // O clique na carta já serve para isso.
    document.body.addEventListener('click', function enableAudio() {
        if (!musicCanPlay) {
            backgroundMusic.play().then(() => {
                musicCanPlay = true;
                backgroundMusic.pause(); // Pausa imediatamente se não for pra tocar ainda
                backgroundMusic.currentTime = 0;
            }).catch(e => console.log("Usuário precisa interagir para tocar áudio"));
        }
        // Remove este listener após o primeiro clique para não interferir depois
        document.body.removeEventListener('click', enableAudio);
    }, { once: true });

});