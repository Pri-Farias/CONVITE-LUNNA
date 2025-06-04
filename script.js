document.addEventListener('DOMContentLoaded', () => {
    const initialScreen = document.getElementById('initial-screen');
    const closedLetter = document.getElementById('closed-letter');
    const tapToOpenText = document.getElementById('tap-to-open');
    const openLetterScreen = document.getElementById('open-letter-screen');
    const letterContentElement = document.getElementById('letter-content');
    const bgMusic = document.getElementById('bg-music');

    const invitationText = `Prezado(a) bruxinho(a),\n\nRecebemos informações ultra-secretas (vazadas por um elfo fofoqueiro) de que no dia 19 de junho, uma bruxinha poderosa chamada <span class="guest-name">LUNNA</span> vai completar mais um ciclo encantado! 🪄🎂\n\nE como manda a tradição da magia... vai ter: bolinho que desaparece, docinho que hipnotiza, sorrisos que brilham no escuro e amigos mágicos reunidos pra celebrar!\n\n📅 Data encantada: 19/06 (quarta-feira)\n⏰ Horário do feitiço: 18h, sem atraso ou vira sapo!\n📍 Local encantado: No Refúgio Secreto da Lunna\n\nMas calma, nada de dragões, vassouras desgovernadas ou aulas de poções! É só um bolinho mesmo, daqueles que somem rapidinho quando a gente diz "Aparecium Brigadeirus!" 🍰✨`;

    let isLetterOpened = false;

    function typeWriter(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = ''; // Limpa o conteúdo antes de começar
        let currentHTML = '';
        let inTag = false;

        function type() {
            if (i < text.length) {
                const char = text.charAt(i);
                if (char === '<') {
                    inTag = true;
                }
                currentHTML += char;
                if (char === '>') {
                    inTag = false;
                }

                // Atualiza o innerHTML somente se não estiver no meio de uma tag
                // ou se for o último caractere da tag
                if (!inTag || (inTag && text.indexOf('>', i) === i) ) {
                     // Para renderizar tags HTML corretamente durante a digitação
                    let tempContainer = document.createElement('div');
                    tempContainer.innerHTML = currentHTML + (inTag ? '' : '_'); // Adiciona cursor piscando
                    element.innerHTML = tempContainer.innerHTML;
                }


                // Se não estiver dentro de uma tag, avance normalmente.
                // Se estiver dentro de uma tag, pule para o final da tag para imprimi-la de uma vez.
                if (inTag && text.indexOf('>', i) !== -1 && char !== '>') {
                    // Não avançar o i aqui, ele será avançado naturalmente
                }


                i++;
                element.scrollTop = element.scrollHeight; // Auto-scroll durante a digitação
                setTimeout(type, speed);

            } else {
                // Remove o cursor ao final
                element.innerHTML = currentHTML.replace(/_$/, '');
                if (callback) {
                    callback();
                }
            }
        }
        type();
    }


    function openTheLetter() {
        if (isLetterOpened) return;
        isLetterOpened = true;

        closedLetter.style.transform = 'scale(0) rotate(360deg)';
        closedLetter.style.opacity = '0';
        tapToOpenText.style.opacity = '0';

        bgMusic.play().catch(error => {
            console.warn("Autoplay da música foi bloqueado pelo navegador:", error);
        });
        bgMusic.volume = 0.3;

        setTimeout(() => {
            initialScreen.style.display = 'none';
            openLetterScreen.style.display = 'flex'; // Mudado de 'block' para 'flex'

            requestAnimationFrame(() => {
                openLetterScreen.classList.add('visible');
            });

            setTimeout(() => {
                typeWriter(letterContentElement, invitationText, 35); // Velocidade um pouco menor
            }, 700); // Atraso um pouco maior para garantir que a carta está visível

        }, 500);
    }

    initialScreen.addEventListener('click', openTheLetter);
    initialScreen.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            openTheLetter();
        }
    });
});