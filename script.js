document.addEventListener('DOMContentLoaded', () => {
    const initialScreen = document.getElementById('initial-screen');
    const closedLetterImg = document.getElementById('closed-letter-img');
    // const tapToOpenText = document.getElementById('tap-to-open-text'); // Já temos initialScreen

    const openedLetterContainer = document.getElementById('opened-letter-container');
    const invitationTextElement = document.getElementById('invitation-text-content');
    const magicMusic = document.getElementById('magic-music');

    const invitationText = `Prezado(a) bruxinho(a),\n\nRecebemos informações ultra-secretas (vazadas por um elfo fofoqueiro) de que no dia 19 de junho, uma bruxinha poderosa chamada\n<span class="guest-name">LUNNA</span>\nvai completar mais um ciclo encantado! 🪄🎂\n\nE como manda a tradição da magia... vai ter:\n\n✨ Bolinho que desaparece\n✨ Docinho que hipnotiza\n✨ Sorrisos que brilham no escuro\n✨ E amigos mágicos reunidos pra celebrar!\n\n📅 Data encantada: 19/06 (quarta-feira)\n⏰ Horário do feitiço: 18h, sem atraso ou vira sapo!\n📍 Lugar secreto (mas nem tanto):\nRua 13 Polar, nº71 – Vila Velha\n\nMas calma, nada de dragões, vassouras desgovernadas ou aulas de poções!\n\nÉ só um bolinho mesmo — daquele que some rapidinho quando a gente diz "Aparecium Brigadeirus!" 🍰✨`;

    let isLetterOpened = false;
    let charIndex = 0;

    function typeWriterEffect() {
        if (charIndex < invitationText.length) {
            let currentChar = invitationText.substring(charIndex, charIndex + 1);
            // Lidar com tags HTML para não digitá-las caractere por caractere visivelmente
            if (currentChar === '<') {
                let closingTagIndex = invitationText.indexOf('>', charIndex);
                if (closingTagIndex !== -1) {
                    invitationTextElement.innerHTML += invitationText.substring(charIndex, closingTagIndex + 1);
                    charIndex = closingTagIndex;
                }
            } else {
                invitationTextElement.innerHTML += currentChar;
            }
            charIndex++;
            invitationTextElement.scrollTop = invitationTextElement.scrollHeight; // Auto-scroll
            setTimeout(typeWriterEffect, 35); // Velocidade da digitação
        }
    }

    function openLetter() {
        if (isLetterOpened) return;
        isLetterOpened = true;

        // Animação de fechar a carta inicial
        initialScreen.classList.add('closing');

        // Tocar música
        magicMusic.volume = 0.25; // Volume suave
        magicMusic.play().catch(error => console.warn("Autoplay da música bloqueado:", error));

        setTimeout(() => {
            initialScreen.classList.add('hidden'); // Esconde a tela inicial
            openedLetterContainer.classList.remove('hidden'); // Mostra o container da carta aberta
            // Força reflow para a animação de entrada funcionar
            requestAnimationFrame(() => {
                 openedLetterContainer.classList.add('visible');
            });


            // Iniciar efeito de máquina de escrever
            invitationTextElement.innerHTML = ''; // Limpa antes de começar
            charIndex = 0; // Reseta o índice para o typewriter
            setTimeout(typeWriterEffect, 500); // Pequeno delay para a carta "assentar"

        }, 500); // Tempo deve ser igual ou um pouco maior que a transição de #closed-letter-img
    }

    initialScreen.addEventListener('click', openLetter);
    initialScreen.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            openLetter();
        }
    });
});