// Access the local and remote video elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');

// Variables for handling the WebRTC connection
let localStream;
let peerConnection;
let remoteStream;

// STUN server configuration (for NAT traversal)
const servers = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

// Event listener for starting the call
startButton.addEventListener('click', startCall);

// Function to start the call
async function startCall() {
  try {
    // Get the local media stream (audio and video)
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    // Set up the peer-to-peer connection
    peerConnection = new RTCPeerConnection(servers);

    // Add the local stream to the peer connection
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // Set up the remote stream handling
    peerConnection.ontrack = (event) => {
      remoteStream = event.streams[0];
      remoteVideo.srcObject = remoteStream;
    };

    // Create an offer and send it to the remote peer (signaling)
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Here, you would send the offer to the remote peer using your signaling mechanism (e.g., WebSocket, HTTP)
    // Since we don't have signaling in this example, we simulate the process

    // Simulate receiving the offer on the remote peer (for the sake of simplicity)
    setTimeout(async () => {
      // The remote peer sets up the connection and sends back an answer
      const remotePeerConnection = new RTCPeerConnection(servers);
      remotePeerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
      };

      await remotePeerConnection.setRemoteDescription(offer);
      const answer = await remotePeerConnection.createAnswer();
      await remotePeerConnection.setLocalDescription(answer);

      // Simulate sending the answer back to the initial peer
      await peerConnection.setRemoteDescription(answer);
    }, 1000);
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}
