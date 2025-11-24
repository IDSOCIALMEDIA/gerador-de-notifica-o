document.addEventListener("DOMContentLoaded", () => {
    
    // CONFIGURAÇÃO: Certifique-se que os arquivos existem na pasta 'logos'
    const logos = {
        "Nubank": "./logos/nubank.png",
        "Inter": "./logos/inter.png",
        "Itaú": "./logos/itau.png",
        "Bradesco": "./logos/bradesco.png",
        "Santander": "./logos/santander.png",
        "Caixa": "./logos/caixa.jpg",
        "Banco do Brasil": "./logos/bb.png",
        "Banco Neon": "./logos/neon.png",
        "C6 Bank": "./logos/c6.png"
    };

    // Elementos
    const btnGenerate = document.getElementById("btnGenerate");
    const btnPermission = document.getElementById("btnPermission");
    const selectLogo = document.getElementById("logoSelect");
    
    // Preenche o Select
    for (let bank in logos) {
        let opt = document.createElement("option");
        opt.value = bank;
        opt.innerText = bank;
        selectLogo.appendChild(opt);
    }

    // --- FUNÇÃO 1: Checa Permissões ao Carregar ---
    function checkStatus() {
        if (!("Notification" in window)) {
            alert("Seu navegador não suporta notificações web.");
            return;
        }
        
        if (Notification.permission === "granted") {
            btnPermission.style.display = "none";
        } else if (Notification.permission === "denied") {
            btnPermission.style.display = "block";
            btnPermission.innerText = "❌ Bloqueado! Clique no cadeado do site p/ liberar";
            btnPermission.disabled = true; // Usuário tem que ir na config do navegador
        } else {
            btnPermission.style.display = "block";
        }
    }

    // --- FUNÇÃO 2: Pede Permissão ---
    btnPermission.addEventListener("click", () => {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") {
                checkStatus();
                // Tenta enviar uma notificação de teste silenciosa
                new Notification("Teste", { body: "Notificações ativadas!" });
            } else {
                alert("Você precisa clicar em 'Permitir' para funcionar.");
            }
        });
    });

    // --- FUNÇÃO 3: Dispara a Notificação ---
    btnGenerate.addEventListener("click", () => {
        // 1. Coleta dados
        const bank = selectLogo.value;
        const sender = document.getElementById("senderName").value;
        const valRaw = parseFloat(document.getElementById("pixAmount").value);
        const valFmt = valRaw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const delay = parseInt(document.getElementById("delaySelect").value) * 1000;
        const iconPath = logos[bank];

        // 2. Atualiza Preview na tela
        document.getElementById("previewApp").innerText = bank;
        document.getElementById("previewLogo").src = iconPath;
        document.getElementById("previewBody").innerHTML = `Transferência de <strong>${sender}</strong><br>Valor: ${valFmt}`;
        document.getElementById("notificationPreview").style.opacity = "1";

        // 3. Feedback no botão
        btnGenerate.disabled = true;
        btnGenerate.innerText = `Aguarde ${delay/1000}s (Saia da tela agora!)`;

        // 4. Temporizador
        setTimeout(() => {
            
            // Verifica permissão na hora H
            if (Notification.permission === "granted") {
                try {
                    // CRIA A NOTIFICAÇÃO REAL
                    const n = new Notification(`Pix recebido: ${valFmt}`, {
                        body: `Você recebeu uma transferência de ${sender} no ${bank}.`,
                        icon: iconPath,
                        vibrate: [200, 100, 200, 100, 200], // Vibração longa
                        requireInteraction: true, // Tenta manter na tela até clicar
                        timestamp: Date.now() // Força ser uma "nova" notificação sempre
                    });

                    // Evento se o usuário clicar na notificação
                    n.onclick = () => { window.focus(); n.close(); };

                } catch (e) {
                    alert("Erro técnico: O Android bloqueou o disparo. " + e.message);
                }
            } else {
                alert("Erro: Permissão de notificação não foi concedida.");
            }

            // Reseta botão
            btnGenerate.disabled = false;
            btnGenerate.innerText = "Agendar Notificação";

        }, delay);
    });

    checkStatus();
});
