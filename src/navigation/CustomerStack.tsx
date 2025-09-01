import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerDashboard from '../screens/customer/CustomerDashboard';
import ServiceRequestScreen from '../screens/customer/ServiceRequestScreen';
import CustomerAppointments from '../screens/customer/CustomerAppointments';
import CustomerBottomTabs from '../screens/customer/tabs/CustomerBottomTabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CreateWorkOrderScreen from "../screens/customer/services/CreateWorkOrderScreen";
import { BellIcon } from '../components/BellIcon';


export type CustomerStackParamList = {
    CustomerDashboard: undefined;
    ServiceRequest: undefined;
    CustomerAppointments: undefined;
    CustomerTabs: undefined;
    CreateWorkOrder: undefined;
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="CustomerTabs" component={CustomerBottomTabs} />
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
            <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
            <Stack.Screen name="CustomerAppointments" component={CustomerAppointments} />
            <Stack.Screen name="CreateWorkOrder" component={CreateWorkOrderScreen} options={{
                headerShown: true,
                headerTitleAlign: "center",
                title: "Create Work Order",
                headerTitleStyle: {
                    color: "#fff",   // 👈 white text
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#4c669f", // solid color (use LinearGradient for fancy bg)
                },
            }}
            />
        </Stack.Navigator>
    );
}
