import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerDashboard from '../screens/customer/CustomerDashboard';
import ServiceRequestScreen from '../screens/customer/ServiceRequestScreen';
import CustomerAppointments from '../screens/customer/CustomerAppointments';
import CustomerBottomTabs from '../screens/customer/tabs/CustomerBottomTabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CreateWorkOrderScreen from "../screens/customer/services/CreateWorkOrderScreen";
import { BellIcon } from '../components/BellIcon';
import WorkOrderDetailScreen from '../screens/customer/services/WorkOrderDetailScreen';

export type CustomerStackParamList = {
    CustomerDashboard: undefined;
    ServiceRequest: undefined;
    CustomerAppointments: undefined;
    CustomerTabs: undefined;
    CreateWorkOrder: undefined;
    WorkOrderDetail: { id: string };
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

const defaultHeaderOptions = {
    headerShown: true,
    headerTitleAlign: "center" as const,
    headerTitleStyle: {
        color: "#fff",
    },
    headerTintColor: "#fff",
    headerStyle: {
        backgroundColor: "#4c669f",
    },
};

export default function CustomerStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="CustomerTabs" component={CustomerBottomTabs} />
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
            <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
            <Stack.Screen name="CustomerAppointments" component={CustomerAppointments} />
            <Stack.Screen name="WorkOrderDetail" component={WorkOrderDetailScreen} options={{
                ...defaultHeaderOptions,
                title: "Work Order Details", // override only title
            }} />
            <Stack.Screen name="CreateWorkOrder" component={CreateWorkOrderScreen} options={{
                ...defaultHeaderOptions,
                title: "Create Work Order",
            }}
            />
        </Stack.Navigator>
    );
}
