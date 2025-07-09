import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useNutrition } from '@/hooks/useNutrition';
import { Apple, Plus, TrendingUp, Droplets, Utensils, Clock } from 'lucide-react-native';

export default function NutritionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { meals, loading, error, loadTodayMeals } = useNutrition();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState(1800); // Default 1800ml
  const [refreshing, setRefreshing] = useState(false);

  // Función para obtener imagen según el tipo de comida
  const getMealImage = (mealType: string) => {
    const imageMap = {
      'BREAKFAST': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'LUNCH': 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
      'DINNER': 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
      'SNACK': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    };
    return imageMap[mealType as keyof typeof imageMap] || imageMap.BREAKFAST;
  };

  // Función para obtener nombre en español del tipo de comida
  const getMealName = (mealType: string) => {
    const nameMap = {
      'BREAKFAST': 'Desayuno',
      'LUNCH': 'Almuerzo', 
      'DINNER': 'Cena',
      'SNACK': 'Merienda',
    };
    return nameMap[mealType as keyof typeof nameMap] || 'Comida';
  };

  // Calculate nutrition from real meals
  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      if (meal.totalCalories) {
        totalCalories += meal.totalCalories;
      }
      if (meal.food && meal.quantity) {
        totalProtein += (meal.food.protein || 0) * meal.quantity;
        totalCarbs += (meal.food.carbs || 0) * meal.quantity;
        totalFat += (meal.food.fat || 0) * meal.quantity;
      }
    });

    return {
      calories: { consumed: Math.round(totalCalories), target: 2200 },
      protein: { consumed: Math.round(totalProtein), target: 120 },
      carbs: { consumed: Math.round(totalCarbs), target: 250 },
      fats: { consumed: Math.round(totalFat), target: 80 },
      water: { consumed: waterIntake, target: 2500 },
    };
  };

  const todayNutrition = calculateNutrition();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodayMeals();
    setRefreshing(false);
  };

  const addWaterGlass = () => {
    const newIntake = waterIntake + 250; // 250ml por vaso
    setWaterIntake(newIntake);
    
    // Mostrar feedback al usuario
    if (newIntake >= todayNutrition.water.target) {
      Alert.alert(
        '¡Felicitaciones! 🎉',
        'Has alcanzado tu objetivo diario de hidratación',
        [{ text: 'Genial', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Vaso agregado 💧',
        `Has bebido ${newIntake}ml de ${todayNutrition.water.target}ml`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const resetWaterIntake = () => {
    Alert.alert(
      'Reiniciar hidratación',
      '¿Estás seguro de que quieres reiniciar tu contador de agua?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reiniciar', 
          style: 'destructive',
          onPress: () => setWaterIntake(0)
        },
      ]
    );
  };

  const addMeal = () => {
    router.push('/add-meal');
  };

  const NutritionProgress = ({ 
    label, 
    consumed, 
    target, 
    unit, 
    color 
  }: { 
    label: string; 
    consumed: number; 
    target: number; 
    unit: string; 
    color: string;
  }) => {
    const percentage = Math.min((consumed / target) * 100, 100);
    
    return (
      <View style={styles.nutritionItem}>
        <View style={styles.nutritionHeader}>
          <ThemedText weight="medium" style={{ color: colors.textPrimary }}>{label}</ThemedText>
          <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
            {consumed}/{target} {unit}
          </ThemedText>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${percentage}%`,
                backgroundColor: color 
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const WaterIntake = () => {
    const glasses = Math.ceil(todayNutrition.water.target / 250); // 250ml por vaso
    const consumedGlasses = Math.floor(waterIntake / 250);

    return (
      <View style={styles.waterSection}>
        <View style={styles.waterHeader}>
          <Droplets size={20} color={colors.info} />
          <ThemedText weight="bold" style={{ color: colors.textPrimary }}>Hidratación</ThemedText>
          <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
            {waterIntake}ml / {todayNutrition.water.target}ml
          </ThemedText>
        </View>
        <View style={styles.waterGlasses}>
          {Array.from({ length: glasses }, (_, index) => (
            <View
              key={index}
              style={[
                styles.waterGlass,
                {
                  backgroundColor: index < consumedGlasses 
                    ? colors.info 
                    : colors.borderLight,
                }
              ]}
            />
          ))}
        </View>
        <View style={styles.waterButtons}>
          <ThemedButton
            title="Agregar vaso"
            variant="outline"
            size="small"
            onPress={addWaterGlass}
            accessibilityLabel="Agregar un vaso de agua consumido"
            style={styles.addWaterButton}
          />
          <TouchableOpacity
            onPress={resetWaterIntake}
            style={styles.resetButton}
            accessibilityLabel="Reiniciar contador de agua"
            accessibilityRole="button"
          >
            <ThemedText variant="muted" size="small" style={{ color: colors.textMuted }}>
              Reiniciar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Recargar comidas cuando la pantalla gana foco se hace manualmente con pull-to-refresh

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText size="xlarge" weight="bold" style={{ color: colors.textPrimary }}>
            Nutrición
          </ThemedText>
          <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
            Mantén un equilibrio saludable
          </ThemedText>
        </View>

        {/* Daily Summary */}
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Apple size={24} color={colors.success} />
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              Resumen del día
            </ThemedText>
          </View>
          
          <View style={styles.caloriesOverview}>
            <View style={styles.caloriesCircle}>
              <ThemedText size="xlarge" weight="bold" style={{ color: colors.textPrimary }}>
                {todayNutrition.calories.consumed}
              </ThemedText>
              <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                de {todayNutrition.calories.target} kcal
              </ThemedText>
            </View>
          </View>

          <View style={styles.macronutrients}>
            <NutritionProgress 
              label="Proteínas"
              consumed={todayNutrition.protein.consumed}
              target={todayNutrition.protein.target}
              unit="g"
              color={colors.primary}
            />
            <NutritionProgress 
              label="Carbohidratos"
              consumed={todayNutrition.carbs.consumed}
              target={todayNutrition.carbs.target}
              unit="g"
              color={colors.secondary}
            />
            <NutritionProgress 
              label="Grasas"
              consumed={todayNutrition.fats.consumed}
              target={todayNutrition.fats.target}
              unit="g"
              color={colors.accent}
            />
          </View>
        </Card>

        {/* Water Intake */}
        <Card style={styles.waterCard}>
          <WaterIntake />
        </Card>

        {/* Meals */}
        <Card style={styles.mealsCard}>
          <View style={styles.mealsHeader}>
            <Utensils size={20} color={colors.accent} />
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              Comidas de hoy
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={onRefresh}
                accessibilityLabel="Recargar comidas"
                accessibilityRole="button"
                disabled={refreshing}
              >
                <TrendingUp size={20} color={refreshing ? colors.textMuted : colors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addMeal}
                accessibilityLabel="Agregar nueva comida"
                accessibilityRole="button"
              >
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mealsList}>
            {meals.length > 0 ? meals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                style={[
                  styles.mealItem,
                  {
                    backgroundColor: selectedMeal === meal.id.toString() 
                      ? colors.backgroundTertiary 
                      : colors.backgroundSecondary,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setSelectedMeal(selectedMeal === meal.id.toString() ? null : meal.id.toString())}
                accessibilityLabel={`Comida: ${getMealName(meal.mealType)}, ${Math.round(meal.totalCalories || 0)} calorías`}
                accessibilityRole="button"
              >
                <View style={styles.mealImageContainer}>
                  <Image 
                    source={{ uri: getMealImage(meal.mealType) }}
                    style={styles.mealImage}
                    resizeMode="cover"
                  />
                </View>
                
                <View style={styles.mealContent}>
                  <View style={styles.mealHeader}>
                    <View>
                      <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                        {getMealName(meal.mealType)}
                      </ThemedText>
                      <View style={styles.mealMeta}>
                        <Clock size={12} color={colors.textMuted} />
                        <ThemedText variant="muted" size="small" style={{ color: colors.textMuted }}>
                          {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText weight="bold" style={{ color: colors.primary }}>
                      {Math.round(meal.totalCalories || 0)} kcal
                    </ThemedText>
                  </View>
                  
                  {selectedMeal === meal.id.toString() && (
                    <View style={styles.mealDetails}>
                      <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                        • {meal.food?.name} ({meal.quantity}x)
                      </ThemedText>
                      {meal.food && (
                        <View style={styles.nutritionDetails}>
                          <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                            Proteína: {Math.round((meal.food.protein || 0) * (meal.quantity || 0))}g
                          </ThemedText>
                          <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                            Carbohidratos: {Math.round((meal.food.carbs || 0) * (meal.quantity || 0))}g
                          </ThemedText>
                          <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                            Grasas: {Math.round((meal.food.fat || 0) * (meal.quantity || 0))}g
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyState}>
                <Utensils size={48} color={colors.textMuted} />
                <ThemedText variant="secondary" style={{ color: colors.textSecondary, marginTop: 16 }}>
                  No has registrado comidas hoy
                </ThemedText>
                <ThemedText variant="secondary" size="small" style={{ color: colors.textMuted, marginTop: 8 }}>
                  Agrega tu primera comida para comenzar a seguir tu nutrición
                </ThemedText>
              </View>
            )}
          </View>
        </Card>

        {/* Nutrition Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <TrendingUp size={20} color={colors.success} />
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              Consejos nutricionales
            </ThemedText>
          </View>
          
          <View style={styles.tipsList}>
            <ThemedText variant="secondary" style={[styles.tip, { color: colors.textSecondary }]}>
              💡 Intenta consumir más proteínas para alcanzar tu objetivo diario
            </ThemedText>
            <ThemedText variant="secondary" style={[styles.tip, { color: colors.textSecondary }]}>
              🥤 Recuerda beber agua regularmente durante el día
            </ThemedText>
            <ThemedText variant="secondary" style={[styles.tip, { color: colors.textSecondary }]}>
              🥗 Incluye más vegetales en tus comidas para obtener vitaminas
            </ThemedText>
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
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  caloriesOverview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesCircle: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  macronutrients: {
    gap: 16,
  },
  nutritionItem: {
    gap: 8,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  waterCard: {
    marginBottom: 20,
  },
  waterSection: {
    alignItems: 'center',
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  waterGlasses: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  waterGlass: {
    width: 20,
    height: 30,
    borderRadius: 4,
  },
  waterButtons: {
    alignSelf: 'stretch',
    gap: 8,
  },
  addWaterButton: {
    alignSelf: 'stretch',
  },
  resetButton: {
    alignSelf: 'center',
    padding: 8,
  },
  mealsCard: {
    marginBottom: 20,
  },
  mealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    flex: 1,
  },
  mealsList: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mealImageContainer: {
    width: 80,
    height: 80,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealContent: {
    flex: 1,
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  mealDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 4,
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    lineHeight: 20,
  },
  nutritionDetails: {
    marginTop: 8,
    gap: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
});