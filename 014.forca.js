let palavras;
let palavraAtual;
let dicasAtuais;
let letrasAdivinhadas;
let erros;
let acertos;
let jogoIniciado = false;

async function carregarPalavras() {
    const resposta = await fetch('015.palavras_forca.json');
    palavras = await resposta.json();
}

function escolherPalavraAleatoria() {
    const indice = Math.floor(Math.random() * palavras.length);
    return palavras[indice];
}

function iniciarJogo() {
    carregarPalavras().then(() => {
        const palavraEscolhida = escolherPalavraAleatoria();
        palavraAtual = palavraEscolhida.palavra.toUpperCase();
        dicasAtuais = palavraEscolhida.dicas;
        letrasAdivinhadas = new Set();
        erros = 0;
        acertos = 0;
        jogoIniciado = true;
        
        atualizarPalavra();
        atualizarDicas();
        criarBotoesLetras();
        limparCanvas();
        desenharForca();
        document.getElementById('mensagem').textContent = '';
    });
}

function atualizarPalavra() {
    const palavraElement = document.getElementById('palavra');
    palavraElement.textContent = palavraAtual
        .split('')
        .map(letra => letrasAdivinhadas.has(letra) ? letra : '_')
        .join(' ');
    
    if (!palavraElement.textContent.includes('_')) {
        finalizarJogo(true);
    }
}

function atualizarDicas() {
    const dicaElement = document.getElementById('dicas');
    if (erros < dicasAtuais.length) {
        dicaElement.textContent = `Dica: ${dicasAtuais[erros]}`;
    }
}

function criarBotoesLetras() {
    const letrasContainer = document.getElementById('letras');
    letrasContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const botao = document.createElement('button');
        botao.textContent = letra;
        botao.className = 'letra';
        botao.addEventListener('click', () => adivinharLetra(letra));
        letrasContainer.appendChild(botao);
    }
}

function adivinharLetra(letra) {
    if (!jogoIniciado || letrasAdivinhadas.has(letra)) return;

    letrasAdivinhadas.add(letra);
    const botao = Array.from(document.querySelectorAll('.letra')).find(b => b.textContent === letra);
    if (botao) botao.disabled = true;

    if (palavraAtual.includes(letra)) {
        acertos += palavraAtual.split(letra).length - 1;
        atualizarPalavra();
    } else {
        erros++;
        atualizarDicas();
        desenharForca();
        if (erros >= 6) {
            finalizarJogo(false);
        }
    }
}

function limparCanvas() {
    const canvas = document.getElementById('forca');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function desenharForca() {
    const canvas = document.getElementById('forca');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Desenhar a estrutura básica da forca (já presente desde o início)
    ctx.beginPath();
    ctx.moveTo(50, 280);
    ctx.lineTo(250, 280);
    ctx.moveTo(100, 280);
    ctx.lineTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.lineTo(200, 80);
    ctx.stroke();

    switch(erros) {
        case 1:
            // Cabeça
            ctx.beginPath();
            ctx.arc(200, 100, 20, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 2:
            // Tronco
            ctx.beginPath();
            ctx.moveTo(200, 120);
            ctx.lineTo(200, 190);
            ctx.stroke();
            break;
        case 3:
            // Braço esquerdo
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(170, 160);
            ctx.stroke();
            break;
        case 4:
            // Braço direito
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(230, 160);
            ctx.stroke();
            break;
        case 5:
            // Perna esquerda
            ctx.beginPath();
            ctx.moveTo(200, 190);
            ctx.lineTo(170, 220);
            ctx.stroke();
            break;
        case 6:
            // Perna direita e olhos X (personagem morto)
            ctx.beginPath();
            ctx.moveTo(200, 190);
            ctx.lineTo(230, 220);
            ctx.stroke();
            
            // Olhos X
            ctx.beginPath();
            ctx.moveTo(190, 95);
            ctx.lineTo(200, 105);
            ctx.moveTo(200, 95);
            ctx.lineTo(190, 105);
            ctx.moveTo(210, 95);
            ctx.lineTo(220, 105);
            ctx.moveTo(220, 95);
            ctx.lineTo(210, 105);
            ctx.stroke();
            break;
    }
}


function finalizarJogo(vitoria) {
    jogoIniciado = false;
    const mensagem = vitoria ? 'Parabéns! Você venceu!' : `Você perdeu. A palavra era: ${palavraAtual}`;
    document.getElementById('mensagem').textContent = mensagem;
    document.querySelectorAll('.letra').forEach(botao => botao.disabled = true);
}

document.addEventListener('DOMContentLoaded', iniciarJogo);

// Adicionar evento de teclado
document.addEventListener('keydown', (event) => {
    const letra = event.key.toUpperCase();
    if (letra.length === 1 && letra >= 'A' && letra <= 'Z') {
        adivinharLetra(letra);
    }
});
