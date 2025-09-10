import React, { useEffect, useState } from "react";
import { View, Button, Text, Alert, StyleSheet } from "react-native";
import api from "../../api/api";
import { Voice, Call, CallInvite } from "@twilio/voice-react-native-sdk";
import CallScreen from "./CallScreen"; // 👈 import our CallScreen UI
import { AudioDevice } from "@twilio/voice-react-native-sdk";

export default function TwilioVoiceScreen() {
  const [voice] = useState(new Voice()); // Only create once
  const [token, setToken] = useState<string | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [incomingCallInvite, setIncomingCallInvite] = useState<CallInvite | null>(null);


  // 🔹 Detect Bluetooth / Audio route
  useEffect(() => {
    const handleAudioDevicesUpdated = (devices: {
      availableAudioDevices: AudioDevice[];
      selectedAudioDevice: AudioDevice | null;
    }) => {
      console.log("🎧 Available devices:", JSON.stringify(devices.availableAudioDevices, null, 2));
      console.log("🎧 Selected device:", devices.selectedAudioDevice);
    };

    console.log("🔍 Listening for AudioDevicesUpdated…");
    voice.on(Voice.Event.AudioDevicesUpdated, handleAudioDevicesUpdated);

    // Also check current devices immediately
    voice.getAudioDevices().then((devices) => {
      console.log("📌 Initial devices:", JSON.stringify(devices, null, 2));
    });

    return () => {
      voice.removeListener(Voice.Event.AudioDevicesUpdated, handleAudioDevicesUpdated);
    };
  }, [voice]);



  useEffect(() => {
    async function initTwilio() {
      try {
        // Get Twilio token from backend
        const { data } = await api.get("/twillio/token?identity=user1");
        const token = data.token;
        setToken(token);

        // Register device for incoming calls
        await voice.register(token);
        console.log("📱 Device registered with Twilio");

        // Handle incoming calls
        voice.on("callInvite", (callInvite: CallInvite) => {
          console.log("📞 Incoming call:", callInvite);
          setIncomingCallInvite(callInvite);
          Alert.alert("Incoming Call", "You have an incoming call!", [
            { text: "Accept", onPress: () => acceptCallInvite(callInvite) },
            { text: "Reject", onPress: () => callInvite.reject() },
          ]);
        });

        // Call connected
        voice.on("callConnected", (activeCall: Call) => {
          console.log("✅ Call connected", activeCall);
          setCall(activeCall);
        });

        // Call disconnected
        voice.on("callDisconnected", () => {
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
      const newCall = await voice.connect(token, {
        params: { To: "+918126700742" }, // 👈 change to target number or user identity
      });
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

  // Render
  if (call) {
    return <CallScreen call={call} voice={voice} onHangup={hangup} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twilio Voice Example</Text>
      <Button title="Call user2" onPress={makeCall} disabled={!token} />
      {incomingCallInvite && (
        <Text style={{ marginTop: 10 }}>Incoming Call...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 60, padding: 20 },
  title: { marginBottom: 10, fontSize: 18, textAlign: "center" },
});
