import React from 'react';
import { StyleSheet, RefreshControl, FlatList } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import ToolsBar from '@/components/PostsToolsBar';
import { useRequest } from '@/hooks/RequestContext';
import PostListItem from '@/components/PostsGallery/PostListItem';



const PostList = ({ onScroll, ListHeaderComponent, onShowPost, user, onReferesh: onRefresh }) => {
    const [processing, setProcessing] = React.useState(false);
    const { theme } = useTheme();
    const [list, setList] = React.useState([])
    const [next, setNext] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [sort, setSort] = React.useState('new');
    const [type, setType] = React.useState('posts');
    const request = useRequest();

    React.useEffect(() => {
        getPosts(request, setList, setNext, user?.username, type, sort);
    }, [user, type, sort]);

    const handleRefresh = () => {
        getPosts(request, setList, setNext, user?.username, type, sort);
        onRefresh && onRefresh();
    }

    const handleScroll = (e) => {
        if (e.nativeEvent.contentOffset.y + 10 >= (e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height)) {
            if (!processing)
                getNext(request, next, setList, setNext, setProcessing);
        }
        onScroll && onScroll(e);
    }

    const handelToolChanged = (e) => {
        setType(e[0]);
        setSort(e[1]);
    }

    return (
        <FlatList style={styles.root}
            refreshControl={<RefreshControl progressBackgroundColor={theme.colors.background} colors={[theme.colors.text]} onRefresh={handleRefresh} refreshing={refreshing} />}
            numColumns={4}
            stickyHeaderIndices={[1]}
            scrollEventThrottle={16}
            ListHeaderComponent={ListHeaderComponent}
            onScroll={handleScroll}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
            data={['ff', 'ff', 'ff', 'ff', ...list]}
            keyExtractor={(e, i) => 'key ' + e.id}
            renderItem={({ item, index }) => {
                if (index === 0) {
                    return <ToolsBar onChange={handelToolChanged} />;
                } else if (index > 3) {
                    return <PostListItem theme={theme} post={item} onShowPost={onShowPost} />
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },
    selectBox: {
        position: 'absolute',
        width: 25,
        height: 25,
        left: 5,
        top: 5,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const getPosts = async (request, setList, setNext, username, type, sortBy) => {
    var quary = "?sort=" + sortBy;

    var url = "";

    if (type === "posts") url = `api/posts/list/${username}`;
    else if (type === "history") url = `api/posts/list/${username}`;
    else if (type === "liked") url = `api/posts/list/${username}/liked`;

    const res = await request(url + quary);

    if (res.ok) {
        const js = await res.json();
        setNext(js.next);
        setList(js.results);
    }
}

const getNext = async (request, next, setList, setNext, setProcessing) => {
    if (!next) return;

    setProcessing(true);

    const res = await request(next);

    if (res.ok) {
        const js = await res.json();
        setNext(js.next);
        setList(e => ([...e, ...js.results]));
    }

    setProcessing(false);
}

export default PostList;