import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const handlePress = () => {
    if (isAuthenticated) {
      // TODO: Navigate to profile screen
      navigation.navigate('ListSelector');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      {isAuthenticated ? (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Ionicons name="person-outline" size={18} color="#1E40AF" />
          <Text style={styles.loginText}>Entrar</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  loginText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '500',
  },
});
