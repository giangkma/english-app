import { useTheme } from '@/Hooks';
import { navigate } from '@/Navigators/utils';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export const LoginScreen = () => {
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
            <Text style={Fonts.textRegular}>This is Login screen</Text>
            <TouchableOpacity
                style={[Common.button.outlineRounded, Gutters.regularVMargin]}
                onPress={() => navigate('Signup')}
            >
                <Text style={Fonts.textRegular}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[Common.button.outlineRounded, Gutters.regularBMargin]}
                onPress={() => navigate('Main')}
            >
                <Text style={Fonts.textRegular}>Go to Home screen</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
