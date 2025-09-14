import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  FlatList,
} from 'react-native';
import { UserInstrument } from '../../../core/models/User';
import { RegisterFormData } from '../../../core/dtos/RegisterFormData';
import {
  Control,
  UseFormGetValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import InstrumentOption from './InstrumentOption';

export type instrumentOptionType = {
  key: UserInstrument;
  label: string;
  image: string;
  description: string;
};

const instrumentOptions: instrumentOptionType[] = [
  {
    key: UserInstrument.GUITAR,
    label: 'Guitarra',
    image:
      'https://cdn.pixabay.com/photo/2017/11/07/00/18/guitar-2925274_1280.jpg',
    description: 'Crea melodías únicas',
  },
  {
    key: UserInstrument.PIANO,
    label: 'Piano',
    image:
      'https://tse3.mm.bing.net/th/id/OIP.spjrfZWDUxD-VeOY7kqYwwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Armonías perfectas',
  },
  {
    key: UserInstrument.BASS,
    label: 'Bajo',
    image: 'https://d3puay5pkxu9s4.cloudfront.net/curso/1760/800_imagen.jpg',
    description: 'El ritmo del alma',
  },
];

type FavoriteInstrumentStepProps = {
  control: Control<any>;
  getValues: UseFormGetValues<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  errors: any;
};

export const FavoriteInstrumentStep: React.FC<FavoriteInstrumentStepProps> = ({
  control,
  getValues,
  setValue,
  errors,
}: FavoriteInstrumentStepProps) => {
  const handleInstrumentSelect = (instrument: UserInstrument) => {
    setValue('favoriteInstrument', instrument);
    // console.log(getValues('favoriteInstrument'));
    // onFieldChange('favoriteInstrument', instrument);
  };

  const favoriteInstrument = useWatch({
    control,
    name: 'favoriteInstrument',
  });
  console.log(favoriteInstrument);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál es tu instrumento favorito? 🎵</Text>
      <Text style={styles.subtitle}>
        Esto nos ayudará a personalizar tu experiencia musical
      </Text>

      <FlatList
        data={instrumentOptions}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.key.toString()}
        renderItem={({ item }) => {
          const isSelected = favoriteInstrument === item.key;

          return (
            <InstrumentOption
              item={item}
              isSelected={isSelected}
              handleInstrumentSelect={handleInstrumentSelect}
            />
          );
        }}
      />
      {errors.favoriteInstrument && (
        <Text style={styles.errorText}>{errors.favoriteInstrument}</Text>
      )}
      {/* Información adicional */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🎯 ¿Por qué preguntamos esto?</Text>
        <Text style={styles.infoText}>
          • Recomendaciones personalizadas de contenido{'\n'}• Conectarte con
          músicos afines{'\n'}• Sugerir grupos y eventos relevantes
        </Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#E6EAF2',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: '#A8B0C3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  listContainer: {
    gap: 16,
    paddingVertical: 8,
  },

  instrumentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },

  instrumentCardSelected: {
    borderColor: '#7C4DFF',
    shadowColor: '#7C4DFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  instrumentImage: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },

  instrumentImageStyle: {
    borderRadius: 14,
  },

  instrumentOverlay: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
  },

  instrumentLabelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  instrumentLabelSelected: {
    backgroundColor: 'rgba(124, 77, 255, 0.8)',
  },

  instrumentLabel: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },

  instrumentDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontStyle: 'italic',
  },

  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  selectedCheckmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },

  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
  },

  infoTitle: {
    color: '#CDD3E1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  infoText: {
    color: '#A8B0C3',
    fontSize: 13,
    lineHeight: 18,
  },
});
