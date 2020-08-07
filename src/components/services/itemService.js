import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {showModalNavigation} from '../../navigation/function';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ItemService extends Component {
  render() {
    const {item} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.shadow}>
          <TouchableOpacity
            onPress={() => {
              showModalNavigation(
                'FormService',
                {item, handle: 'update'},
                'Sữa dịch vụ',
                true,
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.text}>{item.name}</Text>
                <Text>{item.price} VND</Text>
              </View>
              <View>
                <Icon style={styles.icon} name="ios-car" size={33} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  shadow: {
    backgroundColor: '#eef4fc',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOpacity: 0,
    elevation: 0,
    padding: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '900',
    marginVertical: 5,
  },
});
