import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '@/http/HttpRequest';
import Image from '@/components/ImageList/Image';

const PostListItem = ({ post, onShowPost, theme }) => {


    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.root}
            onPress={() => onShowPost && onShowPost(post)}>
            <View style={{ width: '100%', height: '100%', backgroundColor: theme.colors.border }}>
                <Image
                    transition={0}
                    href={BASE_URL + post.images[0].url}
                    contentFit="contain"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
        height: '100%',
        aspectRatio: 1,
        margin: 1,
    },
});

export default PostListItem;