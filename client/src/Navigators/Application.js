import { useTheme } from '@/Hooks';
import { LoginScreen, StartupScreen, SignupScreen } from '@/Screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { MainNavigator } from './Main';
import { navigationRef } from './utils';

const Stack = createStackNavigator();

// @refresh reset
const ApplicationNavigator = () => {
    const { Layout, darkMode, NavigationTheme } = useTheme();
    const { colors } = NavigationTheme;

    const isLoggedIn = true;

    return (
        <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
            <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
                <StatusBar
                    barStyle={darkMode ? 'light-content' : 'dark-content'}
                />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Startup" component={StartupScreen} />
                    {isLoggedIn ? (
                        <React.Fragment>
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name="Signup"
                                component={SignupScreen}
                            />
                            <Stack.Screen
                                name="Main"
                                component={MainNavigator}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default ApplicationNavigator;
