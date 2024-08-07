import React from 'react';
import { StyleSheet, View, ScrollView, Switch, Text, ActivityIndicator } from 'react-native';
import TextInput from '@/components/TextInput';
import { useTheme } from '@/hooks/ThemeContext';
import ImageInput from '@/components/ImageInput/ImageInput';
import ButtonList from '@/components/Buttons/ButtonActions';
import { useRequest } from '@/hooks/RequestContext';
import { useNavigation } from 'expo-router';


const CreatePost = () => {
    const [input, setInput] = React.useState({ images: [] });
    const [errors, setErrors] = React.useState({ images: [] });
    const [processing, setProcessing] = React.useState(false);
    const { theme } = useTheme();
    const request = useRequest();
    const navigation = useNavigation()

    const handleChange = (key, value) => {
        input[key] = value;
        setInput({ ...input });
    }

    const handleImageChange = (list) => {
        setInput({ ...input, images: list.filter((_, i) => i < 5) });
    }

    const handlePress = () => {
        if (processing) return;
        create(request, input, setProcessing, setErrors, navigation);
    }

    return (
        <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.root}>
                <TextInput onChangeText={(input) => handleChange("title", input)} placeholder="Title..." />
                <TextInput onChangeText={(input) => handleChange("description", input)} placeholder="Description..." multiline />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.text }}>Private</Text>
                    <Switch value={Boolean(input?.private)} onChange={() => handleChange('private', !input?.private)} />
                </View>
                <ImageInput onChange={handleImageChange} list={input.images} />
                <ButtonList style={{ borderRadius: 10, width: '100%', height: 30, borderColor: 'blue', borderWidth: 0.5 }}
                    onPress={() => handlePress()}
                    effectWidth={1}
                    index={processing ? 0 : 1}>
                    <View style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                        <ActivityIndicator color="blue" size="small" />
                    </View>
                    <View style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Text style={{ color: theme.colors.text }}>Save</Text>
                    </View>
                </ButtonList>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        padding: 25,
    },
    cont: {
        position: 'relative',
        borderWidth: 0.5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        marginVertical: 25,
    },
    itemCont: {
        width: '45%',
        height: '100%',
        aspectRatio: 1,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const create = async (request, { title = "", description = "", is_private = false, images = [] }, setProcessing, setErrors, navigation) => {
    setProcessing(true);

    const form = new FormData();
    title && form.append("title", title);
    description && form.append("description", description);
    form.append("private", is_private);

    images.forEach((element, i) => {
        const [type] = element.uri.split('.').reverse();

        const file = {
            uri: element.uri,
            type: "image/" + type,
            name: ("img" + i + '.' + type),
        };

        form.append("images", file);
    });

    const res = await request("api/posts/", "POST", form, "all");

    if (res && res.ok) {
        navigation.goBack();
    }

    setProcessing(false);
}

export default CreatePost;