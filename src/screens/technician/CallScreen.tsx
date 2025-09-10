import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Call, Voice, AudioDevice } from "@twilio/voice-react-native-sdk";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { VolumeManager } from "react-native-volume-manager";
const { AudioSwitchModule } = NativeModules;
const audioSwitchEmitter = new NativeEventEmitter(AudioSwitchModule);

const { Proximity } = NativeModules;
const eventEmitter = new NativeEventEmitter(Proximity);

interface Props {
  call: Call;
  voice: Voice;
  onHangup: () => void;
}


export default function CallScreen({ call, voice, onHangup }: Props) {
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [ringerMode, setRingerMode] = useState<string | null>(null);

  // 🔹 audio devices state
  const [availableDevices, setAvailableDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<AudioDevice | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const proximitySubRef = useRef<any>(null);
  const ringerSubRef = useRef<any>(null);


  useEffect(() => {
  const sub = audioSwitchEmitter.addListener("AudioDevicesUpdated", (data) => {
    setAvailableDevices(data.availableAudioDevices);
    setSelectedDevice(data.selectedAudioDevice);
  });

  AudioSwitchModule.start(); // start listening

  return () => {
    sub.remove();
    AudioSwitchModule.stop();
  };
}, []);
  // ✅ Request runtime permissions
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ];
          const granted = await PermissionsAndroid.requestMultiple(permissions);
          console.log("🔑 Permissions result:", granted);
        } catch (err) {
          console.error("Permission request error:", err);
        }
      }
    };
    requestPermissions();
  }, []);

  // Timer + call events
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    call.on(Call.Event.Disconnected, () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedTime(0);
      onHangup();
      navigation.navigate("TwilioVoiceScreen");
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [call]);

  // 🔹 Ringer listener
  useEffect(() => {
    ringerSubRef.current = VolumeManager.addRingerListener((status: any) => {
      console.log("🔊 Ringer Status:", status.status);
      setRingerMode(status.status);
    });

    return () => {
      if (ringerSubRef.current)
        VolumeManager.removeRingerListener(ringerSubRef.current);
    };
  }, []);

  // 🔹 Listen for audio devices
  useEffect(() => {
    const handleAudioDevicesUpdated = (devices: {
      availableAudioDevices: AudioDevice[];
      selectedAudioDevice: AudioDevice | null;
    }) => {
      console.log("🎧 Available devices:", devices.availableAudioDevices);
      console.log("🎧 Selected device:", devices.selectedAudioDevice);
      setAvailableDevices(devices.availableAudioDevices);
      setSelectedDevice(devices.selectedAudioDevice);
    };

    voice.on(Voice.Event.AudioDevicesUpdated, handleAudioDevicesUpdated);

    // fetch initial
    voice.getAudioDevices().then((devices) => {
      setAvailableDevices(devices.audioDevices);
      setSelectedDevice(devices.selectedDevice);
    });

    return () => {
      voice.removeListener(Voice.Event.AudioDevicesUpdated, handleAudioDevicesUpdated);
    };
  }, [voice]);

  // 🔹 Proximity sensor control
  useEffect(() => {
    const type = selectedDevice?.type?.toLowerCase();
    if (type === "earpiece") {
      console.log("📳 Enabling proximity sensor (earpiece active)");
      proximitySubRef.current = eventEmitter.addListener("Proximity", (isNear: boolean) => {
        console.log("📳 Proximity:", isNear);
      });
      Proximity.start();
    } else {
      console.log("📳 Disabling proximity sensor (speaker or bluetooth active)");
      if (proximitySubRef.current) proximitySubRef.current.remove();
      Proximity.stop();
    }

    return () => {
      if (proximitySubRef.current) proximitySubRef.current.remove();
      Proximity.stop();
    };
  }, [selectedDevice]);

  // 🔹 Select audio device manually
// 🔹 Select audio device manually
const selectDevice = async (device: { uuid: string }) => {
  AudioSwitchModule.selectDevice(device.uuid);
  setSelectedDevice(device);
};


  // Toggle mute
  const toggleMute = async () => {
    const newState = !isMuted;
    await call.mute(newState);
    setIsMuted(newState);
  };

  // Hangup
  const hangup = async () => {
    await call.disconnect();
    if (timerRef.current) clearInterval(timerRef.current);
    onHangup();
    navigation.goBack();
  };

  // Format seconds → mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{call.params?.To || "Calling..."}</Text>
      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>

      <View style={styles.controlsRow}>
        {/* mute */}
        <TouchableOpacity style={styles.controlBtn} onPress={toggleMute}>
          <Icon
            name={isMuted ? "microphone-off" : "microphone"}
            size={32}
            color={isMuted ? "red" : "white"}
          />
          <Text style={styles.btnLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>
      </View>

      {/* audio devices */}
      <View style={styles.devicesRow}>
        {availableDevices.map((d) => (
          <TouchableOpacity
            key={d.uuid}
            style={[
              styles.deviceBtn,
              selectedDevice?.uuid === d.uuid && styles.deviceBtnActive,
            ]}
            onPress={() => selectDevice(d)}
          >
            <Text style={styles.deviceText}>{d.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* hangup */}
      <TouchableOpacity style={styles.hangupBtn} onPress={hangup}>
        <Icon name="phone-hangup" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
  },
  timer: {
    fontSize: 18,
    color: "#bbb",
    marginBottom: 30,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.8,
    marginBottom: 20,
  },
  controlBtn: {
    alignItems: "center",
  },
  btnLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "white",
  },
  devicesRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 40,
  },
  deviceBtn: {
    backgroundColor: "#333",
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  deviceBtnActive: {
    backgroundColor: "#4CAF50",
  },
  deviceText: {
    color: "white",
    fontSize: 14,
  },
  hangupBtn: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
