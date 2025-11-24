document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONFIGURAÇÃO DOS BANCOS ---
    // ATENÇÃO: Você precisa ter a pasta "logos" com essas imagens dentro.
    const logoMap = {
        "Nubank": "./logos/nubank.png",
        "Inter": "./logos/inter.png",
        "Itaú": "./logos/itau.png",
        "Banco do Brasil": "./logos/bb.png",
        "Santander": "./logos/santander.png",
        "Caixa": "./logos/caixa.jpg",
        "Bradesco": "./logos/bradesco.png",
        "Banco Neon": "./logos/neon.png",
        "C6 Bank": "./logos/c6.png"
    };

    // --- 2. SELEÇÃO DE ELEMENTOS ---
    const logoSelect = document.getElementById("logoSelect");
    const senderNameInput = document.getElementById("senderName");
    const pixAmountInput = document.getElementById("pixAmount");
    const delaySelect = document.getElementById("delaySelect");

    const generateBtn = document.getElementById("generateBtn");
    const requestPermBtn = document.getElementById("requestPermBtn");

    // Elementos da Prévia (Preview)
    const notificationPreview = document.getElementById("notification");
    const notifyLogo = document.getElementById("notifyLogo");
    const notifyAppName = document.getElementById("notifyAppName");
    const notifyBody = document.getElementById("notifyBody");

    // --- 3. PREENCHER O MENU DE BANCOS ---
    function populateLogoSelector() {
        logoSelect.innerHTML = "";
        Object.keys(logoMap).forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            logoSelect.appendChild(option);
        });
    }

    // --- 4. PEDIR PERMISSÃO AO CELULAR ---
    function checkPermission() {
        if (!("Notification" in window)) {
            // Se o navegador for muito antigo
            return;
        }

        if (Notification.permission !== "granted") {
            requestPermBtn.style.display = "block"; // Mostra o botão verde
        } else {
            requestPermBtn.style.display = "none"; // Já tem permissão
        }
    }

    // Quando clicar no botão verde de permissão
    requestPermBtn.addEventListener("click", () => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                requestPermBtn.style.display = "none";
                alert("Permissão concedida! As notificações aparecerão na barra de status.");
            }
        });
    });

    // --- 5. FUNÇÃO QUE CRIA A NOTIFICAÇÃO ---
    function scheduleNotification() {
        // Coleta os dados digitados
        const bankName = logoSelect.value;
        const senderName = senderNameInput.value;
        const rawAmount = parseFloat(pixAmountInput.value) || 0;

        // Formata dinheiro (R$ 1.000,00)
        const formattedAmount = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(rawAmount);

        // Caminho da imagem
        const logoPath = logoMap[bankName];

        // --- Atualiza a Prévia na Tela (O desenho no site) ---
        notifyAppName.innerText = bankName;
        // Monta o texto igual ao PIX real
        notifyBody.innerHTML = `Você recebeu uma transferência de <strong>${senderName}</strong> no valor de ${formattedAmount}`;
        notifyLogo.src = logoPath || "placeholder.png";

        // Muda botão para "Aguardando..."
        generateBtn.innerText = `Aguardando ${delaySelect.value}s...`;
        generateBtn.disabled = true;
        notificationPreview.style.opacity = "0"; // Esconde prévia anterior

        // Calcula o tempo
        const delayInMs = parseInt(delaySelect.value) * 1000;

        // --- ESPERA E DISPARA ---
        setTimeout(() => {
            // 1. Mostra o desenho na tela do site
            notificationPreview.style.opacity = "1";

            // 2. Tenta disparar a Notificação REAL do Sistema
            if (Notification.permission === "granted") {

                // Cria a notificação nativa (Barra de tarefas/status)
                new Notification(`Pix recebido: ${formattedAmount}`, {
                    body: `Você recebeu uma transferência de ${senderName} no ${bankName}.`,
                    icon: logoPath,
                    vibrate: [200, 100, 200],
                    timestamp: Date.now() // Isso força o sistema a ver como "agora"
                });

            } else if (Notification.permission !== "denied") {
                // Se o usuário esqueceu de habilitar
                alert("Para ver a notificação fora do site, clique em 'Habilitar Notificações' primeiro.");
            }

            // Reseta o botão
            generateBtn.innerText = "Agendar Notificação";
            generateBtn.disabled = false;

        }, delayInMs);
    }

    // Roda ao iniciar
    populateLogoSelector();
    checkPermission();
    generateBtn.addEventListener("click", scheduleNotification);
});
