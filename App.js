import { StyleSheet, Button } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './src/screens/home'
import History from './src/screens/history'

const stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Home" component={Home} options={({ navigation }) => ({
            headerRight: () => (
              <Button 
                title="History" 
                onPress={() => navigation.navigate('History')} 
                color="#333" 
              />
            ),
            headerStyle: { backgroundColor: '#333' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          })}/>
        <stack.Screen name="History" component={History} options={{
            title: 'History',
            headerStyle: { backgroundColor: '#333' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
        }} />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})