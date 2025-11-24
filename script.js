document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONFIGURAÇÃO DOS BANCOS ---
    // Certifique-se de ter a pasta 'logos' com as imagens
    const logoMap = {
        "Nubank": "./logos/nubank.png",
        "Inter": "./logos/inter.png",
        "Itaú": "./logos/itau.png",
        "Banco do Brasil": "./logos/bb.png",
        "Santander": "./logos/santander.png",
        "Caixa": "./logos/caixa.jpg",
        "Bradesco": "./logos/bradesco.png",
        "Banco Neon": "./logos/neon.png"
    };

    // --- 2. ELEMENTOS DO DOM ---
    const logoSelect = document.getElementById("logoSelect");
    const senderNameInput = document.getElementById("senderName"); // NOVO
    const pixAmountInput = document.getElementById("pixAmount");
    const delaySelect = document.getElementById("delaySelect");
    const generateBtn = document.getElementById("generateBtn");
    const requestPermBtn = document.getElementById("requestPermBtn");

    // Elementos da visualização na tela (preview)
    const notificationPreview = document.getElementById("notification");
    const notifyLogo = document.getElementById("notifyLogo");
    const notifyAppName = document.getElementById("notifyAppName");
    const notifyBody = document.getElementById("notifyBody");

    // --- 3. PREENCHER SELETOR ---
    function populateLogoSelector() {
        logoSelect.innerHTML = "";
        Object.keys(logoMap).forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            logoSelect.appendChild(option);
        });
    }

    // --- 4. GERENCIAR PERMISSÃO DE NOTIFICAÇÃO ---
    function checkPermission() {
        if (!("Notification" in window)) {
            alert("Este navegador não suporta notificações de sistema.");
            return;
        }

        if (Notification.permission !== "granted") {
            requestPermBtn.style.display = "block"; // Mostra botão verde se não tiver permissão
        } else {
            requestPermBtn.style.display = "none";
        }
    }

    requestPermBtn.addEventListener("click", () => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                requestPermBtn.style.display = "none";
                alert("Permissão concedida! Agora você receberá as notificações reais.");
            }
        });
    });

    // --- 5. FUNÇÃO PRINCIPAL ---
    function scheduleNotification() {
        // Coleta dados
        const bankName = logoSelect.value;
        const senderName = senderNameInput.value;
        const rawAmount = parseFloat(pixAmountInput.value) || 0;
        const amount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rawAmount);
        const logoPath = logoMap[bankName];
        
        // Atualiza o Preview na tela (HTML)
        notifyAppName.innerText = bankName;
        notifyBody.innerHTML = `Transferência recebida<br>Você recebeu um Pix de <strong>${senderName}</strong> no valor de ${amount}`;
        notifyLogo.src = logoPath || "placeholder.png";
        
        // Feedback visual que foi agendado
        generateBtn.innerText = "Aguardando...";
        generateBtn.disabled = true;

        // Tempo de espera
        const delay = parseInt(delaySelect.value) * 1000;

        setTimeout(() => {
            // 1. Mostra o Preview na página
            notificationPreview.style.opacity = "1";

            // 2. Dispara a Notificação REAL do Sistema
            if (Notification.permission === "granted") {
                // Cria a notificação nativa
                new Notification(`Pix recebido: ${amount}`, {
                    body: `Você recebeu uma transferência de ${senderName} no ${bankName}.`,
                    icon: logoPath, // Tenta usar o ícone do banco na notificação
                    vibrate: [200, 100, 200], // Vibra o celular (se suportado)
                    tag: "pix-notification" // Evita spam de muitas notificações iguais
                });
            } else {
                alert("Notificação bloqueada pelo navegador. Clique no botão verde para habilitar.");
            }

            // Reseta botão
            generateBtn.innerText = "Agendar Notificação";
            generateBtn.disabled = false;

        }, delay);
    }

    // Inicialização
    populateLogoSelector();
    checkPermission();
    generateBtn.addEventListener("click", scheduleNotification);
});
