import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signUp = () => {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
        <Text>Sign Up</Text>
        <Link href="/(auth)/signIn">Sign In</Link>
    </View>
  )
}

export default signUp