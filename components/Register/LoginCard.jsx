import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TextInput from "@/components/TextInput";
import { useAuth } from "@/hooks/AuthContext";
import { Validator } from "@/utils/Validator";
import LoadingButton from "../Buttons/LoadingButton";

const validator = new Validator({
    username: { min: 3, max: 50, match: /^[A-Za-z]+([._-]?[A-Za-z0-9]+)*$/s },
    password: { min: 8, max: 50, }
});

const LoginCard = () => {
    const [input, setInput] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const auth = useAuth();

    const handlePress = () => {
        const errs = validator.validate(input);

        if (errs) {
            setErrors(errs);
            return;
        }

        auth.login(input);
    }

    const handleChange = (key, value = "") => {
        input[key] = value;
        setInput({ ...input });
        errors[key] = validator.validateOne(key, input);
        setErrors({ ...errors });
    }

    return (
        <View style={styles.root}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
            >
                <TextInput placeholder="Username..."
                    error={errors?.username}
                    onChangeText={(text) => handleChange('username', text)} />

                <TextInput placeholder="Password"
                    error={errors?.password}
                    secureTextEntry
                    textContentType="password"
                    onChangeText={(text) => handleChange('password', text)} />


            </ScrollView>
            <LoadingButton variant="fill" processing={auth.status == "waiting" ? true : false} onPress={handlePress}>
                <Text>Login</Text>
            </LoadingButton>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        padding: 15,
        flex: 1
    },
    button: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
});

export default LoginCard;