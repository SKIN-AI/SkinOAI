import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_URL = 'http://192.168.0.140:5000/predict';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Expecting params.image (base64 string) and params.text (string)
  const imageBase64 = params.image as string | undefined;
  const textInfo = params.text as string | undefined;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!imageBase64) {
        setError('No image data provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageBase64, text: textInfo || '' }),
        });
        const data = await response.json();
        if (response.ok) {
          setResult({ ...data, image: `data:image/jpeg;base64,${imageBase64}` });
        } else {
          setError(data.error || 'Failed to get prediction.');
        }
      } catch (e: any) {
        setError(e.message || 'Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [imageBase64, textInfo]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Analyzing...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No result data found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analysis Result</Text>
      {result.image && (
        <Image source={{ uri: result.image }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.resultBox}>
        <Text style={styles.label}>Predicted Condition:</Text>
        <Text style={styles.value}>{result.predicted_class}</Text>
        <Text style={styles.label}>Confidence:</Text>
        <Text style={styles.value}>{result.confidence}%</Text>
        <Text style={styles.label}>Recommendation:</Text>
        <Text style={styles.recommendation}>{result.recommendation}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Scan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e40af',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 20,
    color: '#1d4ed8',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 16,
    color: '#059669',
    marginTop: 8,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    color: '#1e40af',
  },
});
