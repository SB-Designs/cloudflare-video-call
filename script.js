import { Calls } from "https://static.cloudflareinsights.com/calls-sdk.js";

// Replace with your Cloudflare Calls account info
const accountId = "your_account_id"; // Your Cloudflare Account ID
const token = "your_access_token"; // Your Cloudflare Calls Access Token

const startCallButton = document.getElementById("startCall");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

async function startCall() {
    const calls = new Calls({ accountId, token });

    // Start a call session
    const session = await calls.createSession();

    // Get local media (audio/video)
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    // Attach local media to the session
    session.attachMedia(localStream);

    // Connect to the session
    const room = await session.connect();

    // When a remote stream is received, attach it to the remote video element
    room.on("track", (event) => {
        if (event.streams && event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
        }
    });
}

startCallButton.addEventListener("click", startCall);
