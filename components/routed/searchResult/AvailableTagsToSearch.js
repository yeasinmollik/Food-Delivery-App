import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { RootContext } from '../../contexts/GlobalContext';
import { TextInput } from 'react-native-paper'
import Global from '../../../services/Globals';

function AvailableTagsToSearch(props) {
    const { setHeaderString } = React.useContext(RootContext)
    const [availableTags, setAvailableTags] = React.useState([])
    const [searchText, setSeartchText] = React.useState("")
    const [tempList, setTempList] = React.useState([])
    React.useEffect(() => {
        setHeaderString("Suggestions")
        fetch(Global.SERVER_URL + '/getAvailableTags')
            .then(response => response.json())
            .then(({ data }) => {
                setAvailableTags(data)
                setTempList(data)
            })
    }, [])
    function search(query) {
        query = query.toLowerCase()
        setSeartchText(query)
        let temp = availableTags

        temp = temp.filter(name => name.startsWith(query))
        setTempList(temp)

    }
    return (
        <View>
            <TextInput
                label="Tag name"
                value={searchText}
                onChangeText={text => search(text)}
            />
            {tempList.map((tagName, index) => {
                return <View key={index} style={{
                    margin: 5
                }}>
                    <Button title={tagName} onPress={() => {
                        props.stackNav.navigate('searchResult', {
                            tag: tagName
                        })
                    }} />
                </View>
            })}
        </View>
    );
}

export default AvailableTagsToSearch;