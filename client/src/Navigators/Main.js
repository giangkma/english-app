import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExampleScreen } from '@/Screens';

const Tab = createBottomTabNavigator();

// @refresh reset
export const MainNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={ExampleScreen}
                options={{
                    tabBarIconStyle: { display: 'none' },
                    tabBarLabelPosition: 'beside-icon',
                }}
            />
        </Tab.Navigator>
    );
};
