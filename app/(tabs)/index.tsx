import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { getRandomQuote } from '@/constants/Quotes';
import { Heart, Zap, Target, Clock, Volume2, TrendingUp } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [dailyQuote, setDailyQuote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setDailyQuote(getRandomQuote());
  }, []);

  const speakQuote = () => {
    if (Platform.OS === 'web') {
      // Web fallback - visual feedback only
      return;
    }

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Speech.speak(dailyQuote, {
        language: 'es',
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  const todayStats = {
    workoutsCompleted: 2,
    caloriesBurned: 380,
    minutesActive: 45,
    dailyGoal: 500,
  };

  const progressPercentage = (todayStats.caloriesBurned / todayStats.dailyGoal) * 100;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText size="xlarge" weight="bold">
            ¡Hola, {user?.name || 'Usuario'}!
          </ThemedText>
          <ThemedText variant="secondary">
            Es hora de continuar tu transformación
          </ThemedText>
        </View>

        {/* Daily Quote Card */}
        <Card variant="elevated" style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Heart size={24} color={colors.accent} />
            <ThemedText weight="bold" style={styles.quoteTitle}>
              Motivación del día
            </ThemedText>
            <TouchableOpacity
              onPress={speakQuote}
              accessibilityLabel="Reproducir frase motivacional"
              accessibilityRole="button"
              style={styles.speakButton}
            >
              <Volume2 
                size={20} 
                color={isPlaying ? colors.accent : colors.textMuted} 
              />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.quote}>
            "{dailyQuote}"
          </ThemedText>
        </Card>

        {/* Today's Progress */}
        <Card style={styles.progressCard}>
          <ThemedText size="large" weight="bold" style={styles.sectionTitle}>
            Progreso de hoy
          </ThemedText>
          
          <View style={styles.progressBar}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
            <ThemedText variant="secondary" style={styles.progressText}>
              {todayStats.caloriesBurned} / {todayStats.dailyGoal} kcal
            </ThemedText>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Zap size={20} color={colors.accent} />
              <ThemedText weight="bold" size="large">
                {todayStats.workoutsCompleted}
              </ThemedText>
              <ThemedText variant="secondary" size="small">
                Entrenamientos
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <Target size={20} color={colors.secondary} />
              <ThemedText weight="bold" size="large">
                {todayStats.caloriesBurned}
              </ThemedText>
              <ThemedText variant="secondary" size="small">
                Calorías
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <Clock size={20} color={colors.primary} />
              <ThemedText weight="bold" size="large">
                {todayStats.minutesActive}
              </ThemedText>
              <ThemedText variant="secondary" size="small">
                Minutos
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ThemedText size="large" weight="bold" style={styles.sectionTitle}>
            Acciones rápidas
          </ThemedText>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.primary }]}
              accessibilityLabel="Comenzar entrenamiento rápido"
              accessibilityRole="button"
            >
              <Zap size={24} color={colors.textPrimary} />
              <ThemedText weight="medium" style={styles.actionText}>
                Entrenamiento rápido
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.secondary }]}
              accessibilityLabel="Ver progreso semanal"
              accessibilityRole="button"
            >
              <TrendingUp size={24} color={colors.textPrimary} />
              <ThemedText weight="medium" style={styles.actionText}>
                Ver progreso
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  quoteCard: {
    marginBottom: 24,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteTitle: {
    flex: 1,
    marginLeft: 8,
  },
  speakButton: {
    padding: 4,
  },
  quote: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  progressCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  progressBar: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    textAlign: 'center',
  },
});