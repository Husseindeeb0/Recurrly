import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signIn = () => {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
        <Text>SignIn</Text>
        <Link href="/(auth)/signUp">Sign Up</Link>
        <Link href="/(tabs)">Home</Link>
    </View>
  )
}

export default signIn