import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRequest } from "@/hooks/RequestContext";
import { useTheme } from "@/hooks/ThemeContext";
import Button from "@/components/Buttons/Button";
import TextInput from "@/components/TextInput";


const CommentInput = ({ post }) => {
    const [content, setContent] = React.useState("");
    const { theme } = useTheme();
    const request = useRequest();

    const handleSend = () => {
        sendComment(request, post.id, content);
        setContent("");
    }

    return (
        <View style={styles.root}>
            <TextInput style={{ flex: 1 }} onChangeText={(input) => setContent(input)} placeholder="Comment..." value={content} />
            <Button onPress={handleSend} >
                <Text style={{ color: theme.colors.text }} >Send</Text>
            </Button>
        </View>
    );
}


const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});


const sendComment = async (request, post_id, content) => {
    const form = new FormData();
    form.append("content", content);
    form.append("post_id", post_id);

    const res = await request(`api/posts/${post_id}/comments/`, "POST", form);
}

export default CommentInput;
