// This file contains test code as requested by the user.
// It is not currently integrated into the main React application.

// ==== Zego App Info ====
const appID = 1150186913; 
const serverSecret = "0be5daa6775526b087d1c43cdeaab8e2"; 
const userID = "user_" + Math.floor(Math.random() * 10000);
const roomID = "testRoom1"; 

// @ts-ignore
let im; // Chat Client Variable
let callTimer: number; // Timer reference

// ==== Plan Data ====
const plans = {
  calling: [
    { duration: '5 मिनट', price: 30, id: 'call_5' },
    { duration: '10 मिनट', price: 50, id: 'call_10'},
    { duration: '15 मिनट', price: 70, id: 'call_15'},
    { duration: '30 मिनट', price: 130, id: 'call_30', popular: true },
    { duration: '1 घंटा', price: 200, id: 'call_60' }
  ]
};

// ==== Select Current Plan ID (Testing Hardcode) ====
const currentPlanId = 'call_5'; // 5 मिनट वाला Plan

function getPlanDurationMs(planId: string): number {
  const plan = plans.calling.find(p => p.id === planId);
  if (!plan) return 0;
  const minutes = parseInt(plan.duration); // '5 मिनट' → 5
  return minutes * 60 * 1000;
}

// === Join Room: Voice + Chat ===
async function joinRoom() {
  // @ts-ignore
  const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    userID,
    "User"
  );

  // 1️⃣ Voice Call Join
  // @ts-ignore
  const zp = ZegoUIKitPrebuilt.create(token);
  zp.joinRoom({
    container: document.body,
    sharedLinks: [],
    scenario: { 
        // @ts-ignore
        mode: ZegoUIKitPrebuilt.OneONoneCall 
    },
  });

  // 2️⃣ Chat Init
  // @ts-ignore
  im = new ZegoUIKitPrebuiltChat(token);
  im.joinRoom(roomID);

  // 3️⃣ Listen for Incoming Messages
  im.on('IMRecvBroadcastMessage', (msgData: { message: string }) => {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.innerHTML += `<p>Other: ${msgData.message}</p>`;
    }
  });

  // 4️⃣ Start Auto Disconnect Timer
  startCallTimer(getPlanDurationMs(currentPlanId));
}

// === Timer Function ===
function startCallTimer(durationMs: number) {
  let remaining = durationMs / 1000; // सेकंड में
  updateTimerDisplay(remaining);

  callTimer = window.setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);

    if (remaining <= 0) {
      clearInterval(callTimer);
      alert("⏱ Plan समय खत्म! कॉल समाप्त हो रही है।");
      leaveRoom();
    }
  }, 1000);
}

function updateTimerDisplay(seconds: number) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    timerEl.innerText = `${min}:${sec}`;
  }
}

// === Leave Room ===
function leaveRoom() {
  location.reload(); // Simple Test Method
  clearInterval(callTimer);
}

// === Send Chat Message ===
function sendMsg() {
  const msgInput = document.getElementById('msgInput') as HTMLInputElement;
  if (!msgInput) return;

  const msg = msgInput.value;
  if(!msg) return;

  im.sendTextMessage(msg);
  
  const messagesDiv = document.getElementById('messages');
  if (messagesDiv) {
    messagesDiv.innerHTML += `<p>You: ${msg}</p>`;
  }
  
  msgInput.value = "";
}

// === Mic Toggle (Optional Alert for Test) ===
function toggleMic() {
  alert("Mic toggle will work in real SDK setup.");
}