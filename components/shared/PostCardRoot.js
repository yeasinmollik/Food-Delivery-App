import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import PostCard from './PostCard';

export default function PostCardRoot(props) {
    
    function renderCard(post){
        return <PostCard {...props} post={post } />
    }
    return (
        <View>
            <FlatList 
                horizontal={true}
                data={props.postList} 
                keyExtractor={post=>post.id}
                renderItem={ renderCard}
            />  
             
        </View>
    );
}

