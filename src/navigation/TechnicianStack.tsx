import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TechnicianDashboard from '../screens/technician/TechnicianDashboard';
import WorkOrderDetails from '../screens/technician/WorkOrderDetails';
import TechnicianAppointments from '../screens/technician/TechnicianAppointments';
import TechnicianBottomTabs from '../screens/technician/tabs/TechnicianBottomTabs';

export type TechnicianStackParamList = {
    TechnicianDashboard: undefined;
    WorkOrderDetails: undefined;
    TechnicianAppointments: undefined;
    TechnicianTabs: undefined;
};

const Stack = createNativeStackNavigator<TechnicianStackParamList>();

export default function TechnicianStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TechnicianTabs" component={TechnicianBottomTabs} />
            <Stack.Screen name="TechnicianDashboard" component={TechnicianDashboard} />
            <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetails} />
            <Stack.Screen name="TechnicianAppointments" component={TechnicianAppointments} />
        </Stack.Navigator>
    );
}
