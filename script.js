 // Seleciona os elementos do DOM
        const initialScreen = document.getElementById('initialScreen');
        const closedLetter = document.getElementById('closedLetter');
        const tapToOpenButton = document.getElementById('tapToOpenButton');
        const openLetterContent = document.getElementById('openLetterContent');
        const inviteTextElement = document.getElementById('inviteText');
        const backgroundMusic = document.getElementById('backgroundMusic');

        // Texto completo do convite
        const fullInviteText = `Prezado(a) bruxinho(a),

Recebemos informações ultra-secretas (vazadas por um elfo fofoqueiro) de que no dia 19 de junho, uma bruxinha poderosa chamada Lunna vai completar mais um ciclo encantado! 🪄🎂

E como manda a tradição da magia... vai ter:
✨ Bolinho que desaparece
✨ Docinho que hipnotiza
✨ Sorrisos que brilham no escuro
✨ E amigos mágicos reunidos pra celebrar!

📅 Data encantada: 19/06 (quarta-feira)
⏰ Horário do feitiço: 18h, sem atraso ou vira sapo!
📍 Lugar secreto (mas nem tanto): Rua 13 Polar, nº71 – Vila Velha

Mas calma, nada de dragões, vassouras desgovernadas ou aulas de poções!
É só um bolinho mesmo — daquele que some rapidinho quando a gente diz "Aparecium Brigadeirus!" 🍰✨
`;

        // Função para simular o efeito de máquina de escrever
        let charIndex = 0;
        function typeWriter() {
            if (charIndex < fullInviteText.length) {
                inviteTextElement.textContent += fullInviteText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 35); // Ajuste a velocidade da digitação aqui (em milissegundos)
            } else {
                // Remove o cursor piscando após a digitação completa
                inviteTextElement.classList.remove('typewriter-text');
            }
        }

        // Função para abrir a carta
        function openLetter() {
            // Efeito de fade out e scale para a tela inicial
            initialScreen.style.opacity = '0';
            initialScreen.style.transform = 'scale(0.8)';

            // Após a transição, esconde a tela inicial e mostra o conteúdo da carta aberta
            setTimeout(() => {
                initialScreen.style.display = 'none';
                openLetterContent.style.display = 'flex'; // Altera para flex para centralizar o conteúdo
                // Efeito de fade in e scale para a carta aberta
                openLetterContent.style.opacity = '1';
                openLetterContent.style.transform = 'scale(1)';

                // Inicia a música de fundo
                backgroundMusic.play().catch(e => console.error("Erro ao tocar a música:", e));

                // Inicia o efeito de máquina de escrever
                typeWriter();
            }, 1000); // Tempo correspondente à duração da transição CSS
        }

        // Adiciona o evento de clique à carta e ao botão
        closedLetter.addEventListener('click', openLetter);
        tapToOpenButton.addEventListener('click', openLetter);

        // Garante que o conteúdo da carta aberta esteja oculto ao carregar
        openLetterContent.style.display = 'none';

        // Placeholder para as imagens:
        // A imagem do selo (letter-seal), da carta fechada (closed-letter) e do brasão (open-letter-crest) são placeholders.
        // Você deve substituí-las por imagens reais de Hogwarts ou Ministério da Magia.
        // Exemplo:
        // closedLetter.src = 'caminho/para/sua/carta-fechada.png';
        // document.querySelector('.letter-seal').src = 'caminho/para/seu/selo.png';
        // document.querySelector('.open-letter-crest').src = 'caminho/para/seu/brasao.png';

        // A música de fundo também é um placeholder.
        // Substitua 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        // pelo caminho real do seu arquivo 'musica-magica.mp3'.