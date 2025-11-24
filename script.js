document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. REGISTRAR O SERVICE WORKER (OBRIGATÓRIO PARA ANDROID) ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log("Service Worker registrado!", reg))
            .catch(err => console.log("Erro ao registrar SW:", err));
    }

    // --- 1. CONFIGURAÇÃO ---
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

    // --- 2. CHECAR PERMISSÕES ---
    function checkStatus() {
        if (!("Notification" in window)) {
            alert("Navegador incompatível.");
            return;
        }
        
        if (Notification.permission === "granted") {
            btnPermission.style.display = "none";
        } else {
            btnPermission.style.display = "block";
            if(Notification.permission === "denied") {
                btnPermission.innerText = "⚠️ Notificações Bloqueadas (Clique no cadeado)";
            }
        }
    }

    btnPermission.addEventListener("click", () => {
        Notification.requestPermission().then(perm => {
            checkStatus();
            if (perm === "granted") {
                // Tenta notificação simples de teste via SW
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification("Notificações Ativadas!");
                });
            }
        });
    });

    // --- 3. DISPARAR NOTIFICAÇÃO ---
    btnGenerate.addEventListener("click", () => {
        const bank = selectLogo.value;
        const sender = document.getElementById("senderName").value;
        const valRaw = parseFloat(document.getElementById("pixAmount").value);
        const valFmt = valRaw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const delay = parseInt(document.getElementById("delaySelect").value) * 1000;
        const iconPath = logos[bank];

        // Preview na tela
        document.getElementById("previewApp").innerText = bank;
        document.getElementById("previewLogo").src = iconPath;
        document.getElementById("previewBody").innerHTML = `Transferência de <strong>${sender}</strong><br>Valor: ${valFmt}`;
        document.getElementById("notificationPreview").style.opacity = "1";

        // Trava botão
        btnGenerate.disabled = true;
        btnGenerate.innerText = `Aguarde ${delay/1000}s (Bloqueie a tela!)`;

        setTimeout(() => {
            if (Notification.permission === "granted") {
                
                // --- AQUI ESTÁ A CORREÇÃO MÁGICA ---
                // Em vez de 'new Notification', usamos o Service Worker
                navigator.serviceWorker.ready.then(registration => {
                    try {
                        registration.showNotification(`Pix recebido: ${valFmt}`, {
                            body: `Você recebeu uma transferência de ${sender} no ${bank}.`,
                            icon: iconPath,
                            vibrate: [200, 100, 200, 100, 200],
                            tag: 'pix-' + Date.now(), // Tag única para não agrupar
                            timestamp: Date.now()
                        });
                    } catch (e) {
                        alert("Erro no SW: " + e.message);
                    }
                });

            } else {
                alert("Você precisa permitir as notificações no botão verde.");
            }

            btnGenerate.disabled = false;
            btnGenerate.innerText = "Agendar Notificação";
        }, delay);
    });

    checkStatus();
});
