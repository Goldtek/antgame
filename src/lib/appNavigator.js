import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../components/Home';

// create screen for signup

const Stack = createStackNavigator();

export const Navigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={props => ({
        headerTitle: '',
        headerBackTitleVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={props.navigation.goBack}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: 40,
              width: 80,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40 / 2,
              flexDirection: 'row',
            }}>
            <Icon
              name="caret-left"
              size={24}
              color="#059ee2"
              style={{marginLeft: 20}}
            />
            <Text style={{fontWeight: 'bold', marginLeft: 10}}>Back</Text>
          </TouchableOpacity>
        ),
      })}
    />

    {/* <Stack.Screen
      name="userBoard"
      component={onBoardUser}
      options={{
        headerShown: false,
      }}
    /> */}
  </Stack.Navigator>
);
