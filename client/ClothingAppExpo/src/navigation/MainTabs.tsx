import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import ClosetScreen from '../screens/closet';
import StylistScreen from '../screens/stylist';
import FitsScreen from '../screens/fits';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f4511e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Closet"
        component={ClosetScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hanger" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stylist"
        component={StylistScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chef-hat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Fits"
        component={FitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;