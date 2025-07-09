import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useTheme } from '@/hooks/useTheme';
import { useNutrition } from '@/hooks/useNutrition';
import { Food } from '@/services/nutritionService';
import { ArrowLeft, Plus, Minus } from 'lucide-react-native';

interface SelectedFood {
  food: Food;
  quantity: number;
}

const mealTypes = [
  { name: 'Desayuno', value: 'BREAKFAST', time: '08:00' },
  { name: 'Media mañana', value: 'SNACK', time: '10:30' },
  { name: 'Almuerzo', value: 'LUNCH', time: '13:00' },
  { name: 'Merienda', value: 'SNACK', time: '16:00' },
  { name: 'Cena', value: 'DINNER', time: '19:30' },
];

export default function AddMealScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { foods, addMeal, loading } = useNutrition();
  
  const [selectedMealType, setSelectedMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'>('BREAKFAST');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  // Filter foods based on search query
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add food to selected foods
  const addFoodToMeal = (food: Food) => {
    const existingIndex = selectedFoods.findIndex(sf => sf.food.id === food.id);
    
    if (existingIndex >= 0) {
      // If food already exists, increase quantity
      const updatedFoods = [...selectedFoods];
      updatedFoods[existingIndex].quantity += 1;
      setSelectedFoods(updatedFoods);
    } else {
      // Add new food with quantity 1
      setSelectedFoods(prev => [...prev, { food, quantity: 1 }]);
    }
  };

  // Remove food from selected foods
  const removeFoodFromMeal = (foodId: number) => {
    setSelectedFoods(prev => prev.filter(sf => sf.food.id !== foodId));
  };

  // Update food quantity
  const updateFoodQuantity = (foodId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFoodFromMeal(foodId);
      return;
    }
    
    setSelectedFoods(prev => 
      prev.map(sf => 
        sf.food.id === foodId ? { ...sf, quantity } : sf
      )
    );
  };

  // Calculate total nutrition
  const getTotalNutrition = () => {
    return selectedFoods.reduce((total, selectedFood) => ({
      calories: total.calories + (selectedFood.food.calories * selectedFood.quantity),
      protein: total.protein + (selectedFood.food.protein * selectedFood.quantity),
      carbs: total.carbs + (selectedFood.food.carbs * selectedFood.quantity),
      fat: total.fat + (selectedFood.food.fat * selectedFood.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Save meal
  const saveMeal = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert('Error', 'Agrega al menos un alimento a la comida');
      return;
    }

    try {
      // Save each selected food as a separate meal
      for (const selectedFood of selectedFoods) {
        const success = await addMeal(
          selectedFood.food.id,
          selectedFood.quantity,
          selectedMealType
        );
        
        if (!success) {
          Alert.alert('Error', 'No se pudo guardar la comida');
          return;
        }
      }

      const totalNutrition = getTotalNutrition();
      const mealTypeName = mealTypes.find(mt => mt.value === selectedMealType)?.name || selectedMealType;
      
      Alert.alert(
        '¡Comida guardada!',
        `Has agregado ${mealTypeName} con ${Math.round(totalNutrition.calories)} calorías.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'No se pudo guardar la comida');
    }
  };

  const totalNutrition = getTotalNutrition();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Volver atrás"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              Agregar Comida
            </ThemedText>
            <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
              Registra lo que has comido
            </ThemedText>
          </View>
        </View>

        {/* Meal Type Selection */}
        <Card style={styles.mealTypeCard}>
          <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Tipo de comida
          </ThemedText>
          
          <View style={styles.mealTypes}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.name}
                style={[
                  styles.mealTypeOption,
                  {
                    backgroundColor: selectedMealType === type.value 
                      ? colors.primary 
                      : colors.backgroundSecondary,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setSelectedMealType(type.value as 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK')}
                accessibilityLabel={`Seleccionar ${type.name}`}
                accessibilityRole="button"
              >
                <ThemedText
                  style={{
                    color: selectedMealType === type.value 
                      ? colors.textPrimary 
                      : colors.textSecondary,
                  }}
                  weight="medium"
                >
                  {type.name}
                </ThemedText>
                <ThemedText
                  size="small"
                  style={{
                    color: selectedMealType === type.value 
                      ? colors.textPrimary 
                      : colors.textMuted,
                  }}
                >
                  {type.time}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Food Search */}
        <Card style={styles.searchCard}>
          <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Buscar alimentos
          </ThemedText>
          
          <ThemedInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar alimentos..."
            accessibilityLabel="Buscar alimentos"
          />

          <View style={styles.foodList}>
            {filteredFoods.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={[styles.foodItem, { borderColor: colors.border }]}
                onPress={() => addFoodToMeal(food)}
                accessibilityLabel={`Agregar ${food.name}`}
                accessibilityRole="button"
              >
                <Image 
                  source={{ uri: 'https://via.placeholder.com/50x50/007BFF/FFFFFF?text=🍎' }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
                <View style={styles.foodInfo}>
                  <ThemedText weight="medium" style={{ color: colors.textPrimary }}>
                    {food.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                    {food.calories} kcal por {food.servingSize}
                  </ThemedText>
                  <ThemedText variant="muted" size="small" style={{ color: colors.textMuted }}>
                    P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                  </ThemedText>
                </View>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Selected Foods */}
        {selectedFoods.length > 0 && (
          <Card style={styles.selectedFoodsCard}>
            <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Alimentos seleccionados ({selectedFoods.length})
            </ThemedText>
            
            <View style={styles.selectedFoodsList}>
              {selectedFoods.map((selectedFood) => (
                <View key={selectedFood.food.id} style={[styles.selectedFoodItem, { borderColor: colors.border }]}>
                  <View style={styles.selectedFoodInfo}>
                    <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                      {selectedFood.food.name}
                    </ThemedText>
                    <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                      {Math.round(selectedFood.food.calories * selectedFood.quantity)} kcal
                    </ThemedText>
                  </View>
                  
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateFoodQuantity(selectedFood.food.id, selectedFood.quantity - 0.5)}
                      style={[styles.quantityButton, { backgroundColor: colors.error }]}
                      accessibilityLabel="Disminuir cantidad"
                      accessibilityRole="button"
                    >
                      <Minus size={12} color={colors.textPrimary} />
                    </TouchableOpacity>
                    
                    <ThemedText weight="bold" style={[styles.quantityText, { color: colors.textPrimary }]}>
                      {selectedFood.quantity} {selectedFood.food.servingSize}
                    </ThemedText>
                    
                    <TouchableOpacity
                      onPress={() => updateFoodQuantity(selectedFood.food.id, selectedFood.quantity + 0.5)}
                      style={[styles.quantityButton, { backgroundColor: colors.success }]}
                      accessibilityLabel="Aumentar cantidad"
                      accessibilityRole="button"
                    >
                      <Plus size={12} color={colors.textPrimary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => removeFoodFromMeal(selectedFood.food.id)}
                      style={[styles.removeButton, { backgroundColor: colors.error }]}
                      accessibilityLabel={`Eliminar ${selectedFood.food.name}`}
                      accessibilityRole="button"
                    >
                      <Minus size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Nutrition Summary */}
            <View style={[styles.nutritionSummary, { backgroundColor: colors.backgroundTertiary }]}>
              <ThemedText weight="bold" style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                Resumen nutricional
              </ThemedText>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <ThemedText weight="bold" size="large" style={{ color: colors.primary }}>
                    {Math.round(totalNutrition.calories)}
                  </ThemedText>
                  <ThemedText size="small" style={{ color: colors.textSecondary }}>
                    Calorías
                  </ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                  <ThemedText weight="bold" size="large" style={{ color: colors.secondary }}>
                    {Math.round(totalNutrition.protein)}g
                  </ThemedText>
                  <ThemedText size="small" style={{ color: colors.textSecondary }}>
                    Proteínas
                  </ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                  <ThemedText weight="bold" size="large" style={{ color: colors.accent }}>
                    {Math.round(totalNutrition.carbs)}g
                  </ThemedText>
                  <ThemedText size="small" style={{ color: colors.textSecondary }}>
                    Carbohidratos
                  </ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                  <ThemedText weight="bold" size="large" style={{ color: colors.warning }}>
                    {Math.round(totalNutrition.fat)}g
                  </ThemedText>
                  <ThemedText size="small" style={{ color: colors.textSecondary }}>
                    Grasas
                  </ThemedText>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Save Button */}
        <ThemedButton
          title="Guardar comida"
          variant="primary"
          onPress={saveMeal}
          accessibilityLabel="Guardar comida registrada"
          style={styles.saveButton}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
  },
  mealTypeCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  mealTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  searchCard: {
    marginBottom: 20,
  },
  foodList: {
    gap: 12,
    marginTop: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
  },
  selectedFoodsCard: {
    marginBottom: 20,
  },
  selectedFoodsList: {
    gap: 12,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedFoodInfo: {
    flex: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    minWidth: 60,
    textAlign: 'center',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  nutritionSummary: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
});