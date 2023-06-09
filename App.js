import React from 'react';
import { View } from 'react-native';
import AuthProvider from './src/context/AuthContext';
import RequestProvider from './src/context/RequestContext';
import ThemeProvider from './src/context/ThemeContext';
import Root from "./src/route/Root";
import ErrorCardProvider from './src/context/ErrorContext';


export default function App() {

    return (
        <View style={{ flex: 1, display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
            <ThemeProvider>
                <ErrorCardProvider>
                    <RequestProvider>
                        <AuthProvider>
                            <Root />
                        </AuthProvider>
                    </RequestProvider>
                </ErrorCardProvider>
            </ThemeProvider>
        </View>
    );
}