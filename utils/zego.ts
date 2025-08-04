// ZegoUIKitPrebuilt is loaded from a script tag in index.html, so it's on the window object.
declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

// This function should call your backend to securely generate a ZegoCloud token.
export const fetchZegoToken = async (roomId: string, userId: string, userName: string): Promise<string> => {
    // In a production application, you must fetch this token from your own secure backend server.
    // The backend server will use your ZegoCloud App ID and Server Secret to generate the token.
    // Do NOT expose your Server Secret on the client side.
    
    // Example backend endpoint (you need to create this, e.g., using a Cloud Function or another serverless solution)
    // const response = await fetch('YOUR_BACKEND_TOKEN_GENERATOR_URL', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ roomId, userId, userName }),
    // });
    // if (!response.ok) {
    //     const errorBody = await response.text();
    //     throw new Error(`Failed to fetch Zego token: ${errorBody}`);
    // }
    // const { token } = await response.json();
    // return token;
    
    // --- THIS IS A TEMPORARY WORKAROUND FOR DEVELOPMENT ---
    // You MUST replace this with a secure backend call for your app to be secure.
    // This is using a test token generator which is not secure for production.
    if (!window.ZegoUIKitPrebuilt) {
      throw new Error("ZegoUIKitPrebuilt is not loaded");
    }
    const appID = 1150186913; // Your App ID
    const serverSecret = "0be5daa6775526b087d1c43cdeaab8e2"; // DANGER: Your Server Secret for testing ONLY.
    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, serverSecret, roomId, userId, userName
    );
    console.warn("DANGER: Using insecure test token generation. Replace with a secure backend call for production.");
    return kitToken;
    // --- END OF INSECURE DEVELOPMENT CODE ---
};
