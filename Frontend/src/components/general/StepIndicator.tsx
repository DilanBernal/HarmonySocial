import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepPress: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  getStepInfo: (step: number) => { title: string; description: string };
  stepValidations?: Record<number, { isValid: boolean }>;
}

interface StepItemProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isAccessible: boolean;
  onPress: () => void;
  title: string;
  animatedScale: Animated.Value;
  animatedOpacity: Animated.Value;
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  isActive,
  isCompleted,
  isAccessible,
  onPress,
  title,
  animatedScale,
  animatedOpacity,
}) => {
  return (
    <Pressable
      onPress={isAccessible ? onPress : undefined}
      style={[
        styles.stepContainer,
        !isAccessible && styles.stepDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Paso ${step}: ${title}`}
      accessibilityState={{
        selected: isActive,
        disabled: !isAccessible,
      }}
    >
      <Animated.View
        style={[
          styles.stepCircle,
          isActive && styles.stepCircleActive,
          isCompleted && styles.stepCircleCompleted,
          {
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          },
        ]}
      >
        {isCompleted ? (
          <Text style={styles.stepCheckmark}>✓</Text>
        ) : (
          <Text
            style={[
              styles.stepNumber,
              isActive && styles.stepNumberActive,
              isCompleted && styles.stepNumberCompleted,
            ]}
          >
            {step}
          </Text>
        )}
      </Animated.View>
      
      <Text
        style={[
          styles.stepTitle,
          isActive && styles.stepTitleActive,
          !isAccessible && styles.stepTitleDisabled,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      
      {/* Progress line to next step */}
      {step < 3 && (
        <View
          style={[
            styles.progressLine,
            isCompleted && styles.progressLineCompleted,
          ]}
        />
      )}
    </Pressable>
  );
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepPress,
  canNavigateToStep,
  getStepInfo,
  stepValidations = {},
}) => {
  // Crear animaciones para cada paso
  const animatedValues = useRef(
    Array.from({ length: totalSteps }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.7),
    }))
  ).current;

  // Animar cuando cambia el paso activo
  useEffect(() => {
    animatedValues.forEach((anim, index) => {
      const step = index + 1;
      const isActive = step === currentStep;
      const isCompleted = step < currentStep && stepValidations[step]?.isValid;
      
      Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: isActive ? 1.1 : isCompleted ? 1.05 : 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: isActive ? 1 : isCompleted ? 0.9 : 0.6,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentStep, stepValidations, animatedValues]);

  // Renderizar cada paso
  const renderSteps = () => {
    return Array.from({ length: totalSteps }, (_, index) => {
      const step = index + 1;
      const stepInfo = getStepInfo(step);
      const isActive = step === currentStep;
      const isCompleted = step < currentStep && stepValidations[step]?.isValid;
      const isAccessible = canNavigateToStep(step);
      
      return (
        <StepItem
          key={step}
          step={step}
          isActive={isActive}
          isCompleted={isCompleted}
          isAccessible={isAccessible}
          onPress={() => onStepPress(step)}
          title={stepInfo.title}
          animatedScale={animatedValues[index].scale}
          animatedOpacity={animatedValues[index].opacity}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Paso {currentStep} de {totalSteps}
      </Text>
      
      <View style={styles.stepsContainer}>
        {renderSteps()}
      </View>
      
      {/* Descripción del paso actual */}
      <Text style={styles.stepDescription}>
        {getStepInfo(currentStep).description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  
  progressText: {
    color: '#A8B0C3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  
  stepDisabled: {
    opacity: 0.5,
  },
  
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#323A48',
    borderWidth: 2,
    borderColor: '#8892ad',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  stepCircleActive: {
    backgroundColor: '#7C4DFF',
    borderColor: '#7C4DFF',
    shadowColor: '#7C4DFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  
  stepNumber: {
    color: '#8892ad',
    fontSize: 16,
    fontWeight: '700',
  },
  
  stepNumberActive: {
    color: '#FFFFFF',
  },
  
  stepNumberCompleted: {
    color: '#FFFFFF',
  },
  
  stepCheckmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  stepTitle: {
    color: '#8892ad',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 80,
  },
  
  stepTitleActive: {
    color: '#E6EAF2',
  },
  
  stepTitleDisabled: {
    color: '#5A6270',
  },
  
  progressLine: {
    position: 'absolute',
    top: 20,
    left: '75%',
    right: '-25%',
    height: 2,
    backgroundColor: '#323A48',
    zIndex: -1,
  },
  
  progressLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  
  stepDescription: {
    color: '#A8B0C3',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
