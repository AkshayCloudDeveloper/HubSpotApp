import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import Voice from "@twilio/voice-react-native-sdk";
import api from "../../api/api";

export default function App() {
  const [device, setDevice] = useState<any>(null);
  const [call, setCall] = useState<any>(null);

  useEffect(() => {
    async function initTwilio() {
      try {
        // ✅ Axios automatically parses JSON
        const { data } = await api.get("/twillio/token?identity=user1");
        const token = data.token;
        console.log("🔑 Twilio token:", token);
        // Register Twilio device
        //const newDevice = await Voice.register(token);
        //setDevice(newDevice);

        // Handle incoming call
        // newDevice.on("incoming", (incomingCall: any) => {
        //   console.log("📞 Incoming call from:", incomingCall.parameters.From);
        //   setCall(incomingCall);
        // });
      } catch (err) {
        console.error("❌ Twilio init error:", err);
      }
    }

    initTwilio();
  }, []);

  const makeCall = async () => {
    if (!device) return;
    const newCall = await device.connect({ params: { To: "user2" } });
    setCall(newCall);
  };

  const acceptCall = async () => {
    if (call) await call.accept();
  };

  const hangup = async () => {
    if (call) await call.disconnect();
    setCall(null);
  };

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Text style={{ marginBottom: 10, fontSize: 18 }}>Twilio Voice Example</Text>
      <Button title="Call user2" onPress={makeCall} />
      {call && <Button title="Accept Call" onPress={acceptCall} />}
      {call && <Button title="Hang Up" onPress={hangup} />}
    </View>
  );
}
