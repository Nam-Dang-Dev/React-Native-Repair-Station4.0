import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  SectionList,
} from 'react-native';
import {connect} from 'react-redux';
import {showNotification, showModalNavigation} from '../../navigation/function';
import {AsyncStorage} from 'react-native';
import {Icon, Header, ListItem, Card, Badge} from 'react-native-elements';
import {ORDER_TRACKING} from '../../constants/typesNotify';
import {format} from 'date-fns';
import {el} from 'date-fns/locale';
import * as notificationAction from '../../redux/notification/actions/actions';
import LinearGradient from 'react-native-linear-gradient';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {APP_COLOR} from '../../utils/colors';
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
    };
  }

  handleLoadMore = () => {
    const pageIndex = parseInt(this.props.pageIndex) + 1;
    this.props.getNotifications(pageIndex);
  };
  refresh = () => {
    this.setState({isFetching: true});
    this.props.getNotifications();
    this.setState({isFetching: false});
  };
  handleNotificationPressed = itemNotify => {
    if (itemNotify.type === ORDER_TRACKING) {
      this.props.seenNotify(itemNotify.id);
    } else {
      console.log(itemNotify);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.notify !== this.props.notify) {
      showModalNavigation('orderDetail', nextProps.notify, 'Chi tiết', true);
    }
  }
  render() {
    const {notifications} = this.props;
    const {isFetching} = this.state;
    return (
      <LinearGradient
        colors={['#c2d7ff', '#cde7f9', '#ffffff']}
        style={{
          backgroundColor: APP_COLOR,
          height: SCREEN_HEIGHT,
        }}>
        <Card
          containerStyle={{
            flex: 1,
            margin: 0,
            padding: 0,
          }}>
          <Text style={styles.title}>Thông báo</Text>
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              style={{height: '90%'}}
              renderItem={({item}) => (
                <ListItem
                  style={styles.listItem}
                  title={item.title}
                  subtitle={`${item.body}\n\n${format(
                    new Date(item.createdOn),
                    'dd-MM-yyyy H:mm',
                  )}`}
                  rightIcon={!item.isSeen ? <Badge status="success" /> : {}}
                  onPress={() => this.handleNotificationPressed(item)}
                />
              )}
              ItemSeparatorComponent={() => (
                <View style={{height: 1, backgroundColor: '#e8e8e8'}} />
              )}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.05}
              onEndReached={this.handleLoadMore}
              onRefresh={this.refresh}
              refreshing={isFetching}
            />
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16}}>Bạn không có thông báo nào</Text>
            </View>
          )}
        </Card>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: 15,
    marginVertical: 15,
    fontSize: 25,
    fontWeight: 'bold',
  },
  listItem: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
});
const mapStateToProps = store => {
  return {
    notifications: store.NotificationReducers.notifications,
    loading: store.NotificationReducers.loading,
    pageIndex: store.NotificationReducers.pageIndex,
    notify: store.NotificationReducers.notify,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getNotifications: pageIndex => {
      dispatch(notificationAction.getAllNotification(pageIndex));
    },
    seenNotify: notifyId => {
      dispatch(notificationAction.seenNotify(notifyId));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
