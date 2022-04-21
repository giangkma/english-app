import { useTheme } from '@/Hooks';
import { navigate } from '@/Navigators/utils';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export const SignupScreen = () => {
    const { Gutters, Layout, Common, Fonts } = useTheme();

    return (
        <ScrollView
            style={Layout.fill}
            contentContainerStyle={[
                Layout.fill,
                Layout.colCenter,
                Gutters.smallHPadding,
            ]}
        >
            <Text style={Fonts.textRegular}>This is Signup screen</Text>
            <TouchableOpacity
                style={[Common.button.outlineRounded, Gutters.regularVMargin]}
                onPress={() => navigate('Login')}
            >
                <Text style={Fonts.textRegular}>Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
