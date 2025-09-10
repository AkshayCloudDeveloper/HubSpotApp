import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TechnicianDashboard from '../screens/technician/TechnicianDashboard';
import WorkOrderDetails from '../screens/technician/WorkOrderDetails';
import TechnicianAppointments from '../screens/technician/TechnicianAppointments';
import TechnicianBottomTabs from '../screens/technician/tabs/TechnicianBottomTabs';
import CallScreen from '../screens/technician/CallScreen';
import TwilioVoiceScreen from '../screens/technician/TwilioVoiceScreen';

export type TechnicianStackParamList = {
    TechnicianDashboard: undefined;
    WorkOrderDetails: undefined;
    TechnicianAppointments: undefined;
    TechnicianTabs: undefined;
    CallScreen: { call: any; voice: any; onHangup: () => void }; // Adjust types as needed
    TwilioVoiceScreen: undefined;
};

const Stack = createNativeStackNavigator<TechnicianStackParamList>();

export default function TechnicianStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TechnicianTabs" component={TechnicianBottomTabs} />
            <Stack.Screen name="TechnicianDashboard" component={TechnicianDashboard} />
            <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetails} />
            <Stack.Screen name="TechnicianAppointments" component={TechnicianAppointments} />
            <Stack.Screen name="CallScreen">
                {() => <CallScreen call={call} voice={voice} onHangup={hangup} />}
            </Stack.Screen>
            <Stack.Screen name="TwilioVoiceScreen" component={TwilioVoiceScreen} />

        </Stack.Navigator>
    );
}
