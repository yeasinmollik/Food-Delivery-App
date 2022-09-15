import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import LocalUser from './LocalUser';

export default function LocalUsersRoot(props) {
    function renderCard(user) {
        return <LocalUser {...props} user={user.item} />
    }
    return (
        <View>
            <FlatList
                horizontal={true}
                data={props.users}
                keyExtractor={user => user.id}
                renderItem={renderCard}
            />

        </View>
    );
}

