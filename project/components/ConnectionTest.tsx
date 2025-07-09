import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { isAPIAvailable } from '@/config/api';
import { userService } from '@/services/userService';
import { workoutService } from '@/services/workoutService';

export default function ConnectionTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: string[] = [];

    try {
      // Test 1: API Health Check
      results.push('🧪 Testing API connection...');
      const apiAvailable = await isAPIAvailable();
      results.push(apiAvailable ? '✅ API is available' : '❌ API not available');

      if (apiAvailable) {
        // Test 2: Get workouts
        results.push('🧪 Testing workouts endpoint...');
        const workoutsResponse = await workoutService.getAllWorkouts();
        results.push(workoutsResponse.success ? 
          `✅ Workouts loaded: ${workoutsResponse.data?.length || 0} items` : 
          `❌ Workouts failed: ${workoutsResponse.error}`
        );

        // Test 3: Test login with example user
        results.push('🧪 Testing login with example user...');
        const loginResponse = await userService.login({
          email: 'juan@example.com',
          password: 'password123'
        });
        results.push(loginResponse.success ? 
          `✅ Login successful: ${loginResponse.data?.name}` : 
          `❌ Login failed: ${loginResponse.error}`
        );
      }

    } catch (error) {
      results.push(`❌ Test error: ${error}`);
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔗 API Connection Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={runTests}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? '🔄 Testing...' : '🧪 Run Connection Test'}
        </Text>
      </TouchableOpacity>

      <View style={styles.results}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    minHeight: 200,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
