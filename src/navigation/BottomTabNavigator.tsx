import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import YoloPayScreen from '../screens/YoloPayScreen';
import GinieScreen from '../screens/GinieScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({name, focused}: {name: string; focused: boolean}) => {
  const getIcon = () => {
    switch (name) {
      case 'home':
        return '🏠';
      case 'yolo pay':
        return '💳';
      case 'ginie':
        return '🤖';
      default:
        return '📱';
    }
  };

  return (
    <View style={styles.tabIconContainer}>
      <View style={[styles.iconWrapper, focused && styles.focusedIconWrapper]}>
        <Text style={[styles.icon, focused && styles.focusedIcon]}>
          {getIcon()}
        </Text>
      </View>
      <Text style={[styles.tabLabel, focused && styles.focusedTabLabel]}>
        {name}
      </Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{


          tabBarIcon: ({focused}) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="YoloPay"
        component={YoloPayScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="yolo pay" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Ginie"
        component={GinieScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="ginie" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 90,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  focusedIconWrapper: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    fontSize: 20,
  },
  focusedIcon: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  focusedTabLabel: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default BottomTabNavigator;