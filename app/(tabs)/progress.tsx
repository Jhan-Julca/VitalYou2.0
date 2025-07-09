import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { TrendingUp, Calendar, Award, Target, Zap, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProgressData {
  date: string;
  workouts: number;
  calories: number;
  duration: number;
}

const weeklyData: ProgressData[] = [
  { date: 'Lun', workouts: 1, calories: 250, duration: 30 },
  { date: 'Mar', workouts: 2, calories: 400, duration: 45 },
  { date: 'Mié', workouts: 1, calories: 320, duration: 35 },
  { date: 'Jue', workouts: 0, calories: 0, duration: 0 },
  { date: 'Vie', workouts: 2, calories: 480, duration: 55 },
  { date: 'Sáb', workouts: 1, calories: 350, duration: 40 },
  { date: 'Dom', workouts: 1, calories: 280, duration: 32 },
];

const monthlyData: ProgressData[] = [
  { date: 'Sem 1', workouts: 5, calories: 1200, duration: 180 },
  { date: 'Sem 2', workouts: 7, calories: 1800, duration: 250 },
  { date: 'Sem 3', workouts: 6, calories: 1500, duration: 220 },
  { date: 'Sem 4', workouts: 8, calories: 2100, duration: 300 },
];

const yearlyData: ProgressData[] = [
  { date: 'Ene', workouts: 20, calories: 5000, duration: 900 },
  { date: 'Feb', workouts: 25, calories: 6200, duration: 1100 },
  { date: 'Mar', workouts: 22, calories: 5800, duration: 1000 },
  { date: 'Abr', workouts: 28, calories: 7000, duration: 1250 },
  { date: 'May', workouts: 30, calories: 7500, duration: 1350 },
  { date: 'Jun', workouts: 26, calories: 6800, duration: 1200 },
];

const achievements = [
  {
    id: '1',
    title: 'Primera semana completa',
    description: 'Completaste 7 días consecutivos',
    icon: '🔥',
    earned: true,
  },
  {
    id: '2',
    title: 'Quemador de calorías',
    description: 'Quemaste más de 2000 calorías',
    icon: '⚡',
    earned: true,
  },
  {
    id: '3',
    title: 'Constancia',
    description: 'Entrena 30 días seguidos',
    icon: '💪',
    earned: false,
  },
  {
    id: '4',
    title: 'Madrugador',
    description: 'Entrena antes de las 7 AM',
    icon: '🌅',
    earned: false,
  },
];

export default function ProgressScreen() {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('Semana');

  const periods = ['Semana', 'Mes', 'Año'];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'Mes':
        return monthlyData;
      case 'Año':
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const currentData = getCurrentData();

  const totalStats = {
    workouts: currentData.reduce((sum, day) => sum + day.workouts, 0),
    calories: currentData.reduce((sum, day) => sum + day.calories, 0),
    duration: currentData.reduce((sum, day) => sum + day.duration, 0),
    avgWorkouts: (currentData.reduce((sum, day) => sum + day.workouts, 0) / currentData.length).toFixed(1),
  };

  const maxCalories = Math.max(...currentData.map(day => day.calories));

  const ProgressBar = ({ data }: { data: ProgressData[] }) => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((day, index) => {
            const height = maxCalories > 0 ? (day.calories / maxCalories) * 120 : 0;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: height,
                        backgroundColor: day.calories > 0 ? colors.primary : colors.borderLight,
                      },
                    ]}
                  />
                </View>
                <ThemedText size="small" variant="muted" style={styles.barLabel}>
                  {day.date}
                </ThemedText>
              </View>
            );
          })}
        </View>
        <ThemedText variant="muted" size="small" style={styles.chartTitle}>
          Calorías quemadas por {selectedPeriod.toLowerCase()}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText size="xlarge" weight="bold" style={{ color: colors.textPrimary }}>
            Tu Progreso
          </ThemedText>
          <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
            Mira qué tan lejos has llegado
          </ThemedText>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period 
                    ? colors.primary 
                    : colors.backgroundSecondary,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
              accessibilityLabel={`Seleccionar período ${period}`}
              accessibilityRole="button"
            >
              <ThemedText
                style={{
                  color: selectedPeriod === period 
                    ? colors.textPrimary 
                    : colors.textSecondary,
                }}
                weight="medium"
              >
                {period}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stats */}
        <Card variant="elevated" style={styles.summaryCard}>
          <ThemedText size="large" weight="bold" style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Resumen {selectedPeriod.toLowerCase()}
          </ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                <Zap size={20} color={colors.primary} />
              </View>
              <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
                {totalStats.workouts}
              </ThemedText>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                Entrenamientos
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
                <Target size={20} color={colors.accent} />
              </View>
              <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
                {totalStats.calories}
              </ThemedText>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                Calorías
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Clock size={20} color={colors.secondary} />
              </View>
              <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
                {Math.floor(totalStats.duration / 60)}h {totalStats.duration % 60}m
              </ThemedText>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                Tiempo total
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Progress Chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <TrendingUp size={20} color={colors.primary} />
            <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
              Progreso diario
            </ThemedText>
          </View>
          <ProgressBar data={currentData} />
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <View style={styles.achievementsHeader}>
            <Award size={20} color={colors.accent} />
            <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
              Logros
            </ThemedText>
          </View>
          
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  {
                    backgroundColor: achievement.earned 
                      ? colors.success + '10' 
                      : colors.backgroundTertiary,
                    borderColor: achievement.earned 
                      ? colors.success 
                      : colors.border,
                  }
                ]}
              >
                <ThemedText size="large">{achievement.icon}</ThemedText>
                <View style={styles.achievementInfo}>
                  <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                    {achievement.title}
                  </ThemedText>
                  <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                    {achievement.description}
                  </ThemedText>
                </View>
                {achievement.earned && (
                  <View style={[styles.earnedBadge, { backgroundColor: colors.success }]}>
                    <ThemedText size="small" style={{ color: colors.textPrimary }}>
                      ✓
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Goals */}
        <Card style={styles.goalsCard}>
          <ThemedText weight="bold" size="large" style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Objetivos de la {selectedPeriod.toLowerCase()}
          </ThemedText>
          
          <View style={styles.goalItem}>
            <ThemedText weight="medium" style={{ color: colors.textPrimary }}>
              Entrenamientos completados
            </ThemedText>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgressFill,
                    { 
                      width: `${Math.min((totalStats.workouts / (selectedPeriod === 'Semana' ? 7 : selectedPeriod === 'Mes' ? 20 : 200)) * 100, 100)}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                {totalStats.workouts}/{selectedPeriod === 'Semana' ? 7 : selectedPeriod === 'Mes' ? 20 : 200}
              </ThemedText>
            </View>
          </View>

          <View style={styles.goalItem}>
            <ThemedText weight="medium" style={{ color: colors.textPrimary }}>
              Calorías quemadas
            </ThemedText>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgressFill,
                    { 
                      width: `${Math.min((totalStats.calories / (selectedPeriod === 'Semana' ? 2500 : selectedPeriod === 'Mes' ? 10000 : 50000)) * 100, 100)}%`,
                      backgroundColor: colors.accent 
                    }
                  ]} 
                />
              </View>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                {totalStats.calories}/{selectedPeriod === 'Semana' ? 2500 : selectedPeriod === 'Mes' ? 10000 : 50000}
              </ThemedText>
            </View>
          </View>
        </Card>
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
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCard: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
    paddingHorizontal: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    marginTop: 8,
    textAlign: 'center',
  },
  chartTitle: {
    marginTop: 12,
  },
  achievementsCard: {
    marginBottom: 20,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsCard: {
    marginBottom: 20,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
});