// Aguarda o documento HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. BANCO DE DADOS DE LOGOS (Caminhos) ---
    // É AQUI QUE VOCÊ DEVE ADICIONAR OS CAMINHOS
    // Certifique-se que o caminho começa com './' e bate com a pasta (ex: 'logos')
    // e o nome exato do arquivo (ex: 'neon.png').
    const logoMap = {
        "Banco Neon": "./logos/neon.png",
        "Nubank": "./logos/nubank.png",
        "Caixa": "./logos/caixa.jpg",
        "Banco do Brasil": "./logos/bb.png"
        // Adicione quantos bancos quiser...
    };

    // --- 2. SELEÇÃO DOS ELEMENTOS ---
    const appNameInput = document.getElementById("appName");
    const pixAmountInput = document.getElementById("pixAmount");
    const logoSelect = document.getElementById("logoSelect");
    const generateBtn = document.getElementById("generateBtn");
    const delaySelect = document.getElementById("delaySelect");

    const notification = document.getElementById("notification");
    const notifyLogo = document.getElementById("notifyLogo");
    const notifyAppName = document.getElementById("notifyAppName");
    const notifyBody = document.getElementById("notifyBody");

    // --- 3. FUNÇÃO PARA PREENCHER O SELETOR DE LOGOS ---
    function populateLogoSelector() {
        const bankNames = Object.keys(logoMap);
        
        logoSelect.innerHTML = ""; // Limpa opções padrão

        bankNames.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            logoSelect.appendChild(option);
        });
    }

    // --- 4. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO ---
    function updateNotification() {
        // Pega o nome do banco do seletor
        const selectedBankName = logoSelect.value;
        const appName = selectedBankName; 

        // Pega e formata o valor do PIX
        const pixAmount = parseFloat(pixAmountInput.value) || 0;
        const formattedAmount = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(pixAmount);

        // Atualiza os textos
        appNameInput.value = appName; // Atualiza o campo de input
        notifyAppName.innerText = appName;
        notifyBody.innerText = `Você recebeu um PIX de ${formattedAmount}.`;

        // Lida com a imagem (Logo)
        const logoPath = logoMap[selectedBankName]; // Pega o caminho da imagem
        if (logoPath) {
            notifyLogo.src = logoPath; // Define o 'src' da imagem para o caminho do arquivo
        } else {
            notifyLogo.src = "placeholder.png"; // Imagem padrão
        }
        
        // Aplica o Atraso (Delay)
        const delayInSeconds = parseInt(delaySelect.value, 10);
        const delayInMilliseconds = delayInSeconds * 1000;

        notification.style.opacity = "0"; // Esconde

        setTimeout(() => {
            notification.style.opacity = "1"; // Mostra
        }, delayInMilliseconds);
    }

    // --- 5. INICIALIZAÇÃO ---
    populateLogoSelector(); // Preenche o menu dropdown assim que a página carrega
    generateBtn.addEventListener("click", updateNotification);
});
