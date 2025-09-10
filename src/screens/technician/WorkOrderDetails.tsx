import React, { useEffect, useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import api from "../../api/api";
import { Voice, Call, CallInvite } from '@twilio/voice-react-native-sdk';

export default function TwilioVoiceScreen() {
  const [voice] = useState(new Voice()); // Only create once
  const [token, setToken] = useState<string | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [incomingCallInvite, setIncomingCallInvite] = useState<CallInvite | null>(null);

  useEffect(() => {
    async function initTwilio() {
      try {
        // Get Twilio token from your backend
        const { data } = await api.get("/twillio/token?identity=user1");
        const token = data.token;
        console.log("🔑 Twilio token:", token);
        setToken(token);

        // Register device
        let reg = await voice.register(token);
        console.log("📱 Device registered:", reg);
        // Listen for incoming calls
        voice.on('callInvite', (callInvite: CallInvite) => {
          console.log("📞 Incoming call:", callInvite);
          setIncomingCallInvite(callInvite);
          Alert.alert("Incoming Call", "You have an incoming call!", [
            { text: "Accept", onPress: () => acceptCallInvite(callInvite) },
            { text: "Reject", onPress: () => callInvite.reject() },
          ]);
        });

        voice.on('callConnected', (activeCall: Call) => {
          console.log("✅ Call connected", activeCall);
          setCall(activeCall);
        });

        voice.on('callDisconnected', () => {
          console.log("📴 Call disconnected");
          setCall(null);
        });

      } catch (err) {
        console.error("❌ Twilio init error:", err);
      }
    }

    initTwilio();

    // Cleanup listeners on unmount
    return () => {
      voice.removeAllListeners();
    };
  }, []);

  const makeCall = async () => {
    if (!token) return;
    try {
      const newCall = await voice.connect(token, { params: { To: "+918126700742" } });
      setCall(newCall);
    } catch (err) {
      console.error("❌ Call failed:", err);
    }
  };

  const acceptCallInvite = async (callInvite: CallInvite) => {
    try {
      const acceptedCall = await callInvite.accept();
      setCall(acceptedCall);
      setIncomingCallInvite(null);
    } catch (err) {
      console.error("❌ Failed to accept call:", err);
    }
  };

  const hangup = async () => {
    if (call) {
      await call.disconnect();
      setCall(null);
    }
  };

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Text style={{ marginBottom: 10, fontSize: 18 }}>Twilio Voice Example</Text>
      <Button title="Call user2" onPress={makeCall} disabled={!token} />
      {call && <Button title="Hang Up" onPress={hangup} />}
      {incomingCallInvite && <Text style={{ marginTop: 10 }}>Incoming Call...</Text>}
    </View>
  );
}
