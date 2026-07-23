// =============================================================
// MODULE 9 — BEAST GALAXY WHATSAPP ALERT ENGINE
// Auto Alerts for Offline / Slow / Critical Systems
// Author: S. Saravana Kumar – RPP Infra Projects Ltd
// =============================================================

// ENTER YOUR REGISTERED WHATSAPP NUMBER HERE:
const adminNumbers = [
    "+918637618747",   // Number 1
    "+91YYYYYYYYYY"    // Number 2 (optional)
];

// FREE WHATSAPP API URL (UltraWhatsApp Cloud)
const API_URL = "https://api.ultramsg.com/instanceXXXXX/messages/chat";
const API_TOKEN = "YOUR_API_TOKEN_HERE";  // Replace with your token

// =====================================================================
// SEND MESSAGE FUNCTION
// =====================================================================
async function sendWhatsAppMessage(to, message) {
    try {
        const payload = {
            token: API_TOKEN,
            to: to,
            body: message
        };

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("📲 WhatsApp sent →", to, "→", message);

    } catch (err) {
        console.log("⚠ WhatsApp Send Error:", err);
    }
}

// =====================================================================
// ALERT RATE LIMITER (prevents spam)
// =====================================================================
let lastAlert = {};

function shouldSendAlert(id) {
    const now = Date.now();
    if (!lastAlert[id] || now - lastAlert[id] > 60000) { // 1 minute cool-down
        lastAlert[id] = now;
        return true;
    }
    return false;
}

// =====================================================================
// MAIN ALERT ENGINE — called from GalaxyServer
// =====================================================================
export function handleWhatsAppAlerts(client) {

    const id = client.Hostname;

    // --------------------------------------------------------------
    // 1. DEVICE OFFLINE
    // --------------------------------------------------------------
    if (client.Status === "OFFLINE" && shouldSendAlert(id + "_offline")) {
        broadcastAdmins(
            `🚨 PC OFFLINE\n\n🖥 Device: ${client.Hostname}\n🌐 Last Seen: ${client.LastSeen}`
        );
    }

    // --------------------------------------------------------------
    // 2. HIGH CPU
    // --------------------------------------------------------------
    if (client.CPUPercent > 95 && shouldSendAlert(id + "_cpu")) {
        broadcastAdmins(
            `🔥 HIGH CPU ALERT\n\n🖥 ${client.Hostname}\n⚡ CPU: ${client.CPUPercent}%`
        );
    }

    // --------------------------------------------------------------
    // 3. HIGH RAM
    // --------------------------------------------------------------
    if (client.RAMPercent > 90 && shouldSendAlert(id + "_ram")) {
        broadcastAdmins(
            `⚠ HIGH RAM USAGE\n\n🖥 ${client.Hostname}\n🧠 RAM: ${client.RAMPercent}%`
        );
    }

    // --------------------------------------------------------------
    // 4. HIGH TEMPERATURE
    // --------------------------------------------------------------
    if (client.TemperatureC > 80 && shouldSendAlert(id + "_temp")) {
        broadcastAdmins(
            `🔥🔥 OVERHEAT WARNING\n\n🖥 ${client.Hostname}\n🌡 Temp: ${client.TemperatureC}°C`
        );
    }

    // --------------------------------------------------------------
    // 5. DISK NEARLY FULL
    // --------------------------------------------------------------
    if (client.DiskPercent > 95 && shouldSendAlert(id + "_disk")) {
        broadcastAdmins(
            `💾 DISK FULL WARNING\n\n🖥 ${client.Hostname}\n📦 Disk Usage: ${client.DiskPercent}%`
        );
    }

    // --------------------------------------------------------------
    // 6. FAILURE PREDICTION (AI)
    // --------------------------------------------------------------
    if (client.FailurePercent > 70 && shouldSendAlert(id + "_fail")) {
        broadcastAdmins(
            `⏳ FAILURE PREDICTION ALERT\n\n🖥 ${client.Hostname}\n📉 Risk: ${client.FailurePercent}%\n🔧 Action: ${client.FailureAction}`
        );
    }

    // --------------------------------------------------------------
    // 7. CCTV CAMERA OFFLINE
    // --------------------------------------------------------------
    if (client.Type === "CCTV" && client.Status === "OFFLINE" &&
        shouldSendAlert(id + "_cctv")) {

        broadcastAdmins(
            `🎥 CCTV CAMERA OFFLINE\n\n📍 Camera: ${client.Name}\n🌐 IP: ${client.IP}`
        );
    }

    // --------------------------------------------------------------
    // 8. PRINTER OFFLINE
    // --------------------------------------------------------------
    if (client.Type === "PRINTER" &&
        client.PrinterStatus !== "OK" &&
        shouldSendAlert(id + "_printer")) {

        broadcastAdmins(
            `🖨 PRINTER ERROR\n\n📍 Printer: ${client.Name}\n⚠ Status: ${client.PrinterStatus}`
        );
    }

    // --------------------------------------------------------------
    // 9. NETWORK UNSTABLE
    // --------------------------------------------------------------
    if (client.PacketLoss > 50 && shouldSendAlert(id + "_packetloss")) {
        broadcastAdmins(
            `🌐 NETWORK UNSTABLE\n\n🖥 ${client.Hostname}\n📉 Packet Loss: ${client.PacketLoss}%`
        );
    }
}

// =====================================================================
// SEND TO ALL ADMINS
// =====================================================================
function broadcastAdmins(message) {
    adminNumbers.forEach(num => {
        sendWhatsAppMessage(num, message);
    });
}

// END MODULE 9
// =============================================================
