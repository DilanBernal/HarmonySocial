import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { UserInstrument } from '../../models/User';

// Avatares por defecto basados en el instrumento favorito
const DEFAULT_AVATARS = {
  [UserInstrument.GUITAR]: [
    require('../../assets/img/profile-generig-img-1.png'),
    require('../../assets/img/profile-generig-img-2.png'),
    require('../../assets/img/profile-generig-img-3.png'),
  ],
  [UserInstrument.PIANO]: [
    require('../../assets/img/profile-generig-img-4.png'),
    require('../../assets/img/profile-generig-img-5.png'),
    require('../../assets/img/profile-generig-img-6.png'),
  ],
  [UserInstrument.BASS]: [
    require('../../assets/img/profile-generig-img-7.png'),
    require('../../assets/img/profile-generig-img-8.png'),
    require('../../assets/img/profile-generig-img-1.png'),
  ],
};

interface ProfileImageStepProps {
  selectedImage: string;
  favoriteInstrument: UserInstrument | null;
  onImageSelect: (imageUri: string) => void;
  fullName: string;
  error?: string;
}

export const ProfileImageStep: React.FC<ProfileImageStepProps> = ({
  selectedImage,
  favoriteInstrument,
  onImageSelect,
  fullName,
  error,
}) => {
  const [showCustomImageOptions, setShowCustomImageOptions] = useState(false);

  // Obtener avatares recomendados basados en el instrumento
  const getRecommendedAvatars = () => {
    if (!favoriteInstrument) {
      // Si no hay instrumento, mostrar una mezcla
      return [
        ...DEFAULT_AVATARS[UserInstrument.GUITAR].slice(0, 1),
        ...DEFAULT_AVATARS[UserInstrument.PIANO].slice(0, 1),
        ...DEFAULT_AVATARS[UserInstrument.BASS].slice(0, 1),
      ];
    }
    
    return DEFAULT_AVATARS[favoriteInstrument];
  };

  // Generar URI string para las imágenes locales
  const getImageUri = (imageSource: any): string => {
    if (typeof imageSource === 'number') {
      return `asset_${imageSource}`;
    }
    return imageSource;
  };

  // Manejar selección de imagen personalizada
  const handleCustomImagePress = () => {
    Alert.alert(
      'Imagen personalizada',
      'Esta funcionalidad estará disponible próximamente. Por ahora, selecciona uno de los avatares disponibles.',
      [{ text: 'Entendido' }]
    );
  };

  const recommendedAvatars = getRecommendedAvatars();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        ¡Casi listo, {fullName}! 🎉
      </Text>
      
      <Text style={styles.instructionText}>
        Elige tu imagen de perfil
      </Text>

      {/* Vista previa de la imagen seleccionada */}
      <View style={styles.previewContainer}>
        {selectedImage ? (
          <Image
            source={
              selectedImage.startsWith('asset_')
                ? recommendedAvatars.find((_, index) => 
                    getImageUri(recommendedAvatars[index]) === selectedImage
                  ) || recommendedAvatars[0]
                : { uri: selectedImage }
            }
            style={styles.previewImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Avatares recomendados */}
      <Text style={styles.sectionTitle}>
        Avatares recomendados {favoriteInstrument ? `para ${UserInstrument[favoriteInstrument].toLowerCase()}` : ''}
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarScrollContainer}
      >
        {recommendedAvatars.map((avatar, index) => {
          const avatarUri = getImageUri(avatar);
          const isSelected = selectedImage === avatarUri;
          
          return (
            <Pressable
              key={index}
              style={[
                styles.avatarOption,
                isSelected && styles.avatarOptionSelected,
              ]}
              onPress={() => onImageSelect(avatarUri)}
              accessibilityRole="button"
              accessibilityLabel={`Avatar opción ${index + 1}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Image source={avatar} style={styles.avatarImage} />
              {isSelected && (
                <View style={styles.selectedOverlay}>
                  <Text style={styles.selectedCheckmark}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Opción para imagen personalizada */}
      <Pressable
        style={styles.customImageButton}
        onPress={handleCustomImagePress}
        accessibilityRole="button"
        accessibilityLabel="Subir imagen personalizada"
      >
        <View style={styles.customImageIcon}>
          <Text style={styles.customImageIconText}>+</Text>
        </View>
        <Text style={styles.customImageText}>
          Subir mi propia imagen
        </Text>
      </Pressable>

      {/* Mostrar error si existe */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {/* Tips de imagen de perfil */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips para tu foto de perfil:</Text>
        <Text style={styles.tipsText}>
          • Elige una imagen que te represente{'\n'}
          • Asegúrate de que se vea claramente tu rostro{'\n'}
          • Evita imágenes borrosas o muy oscuras
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  welcomeText: {
    color: '#E6EAF2',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  instructionText: {
    color: '#A8B0C3',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },

  previewContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#7C4DFF',
  },

  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#323A48',
    borderWidth: 2,
    borderColor: '#8892ad',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#A8B0C3',
    fontSize: 48,
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#CDD3E1',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },

  avatarScrollContainer: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },

  avatarOption: {
    position: 'relative',
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  avatarOptionSelected: {
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

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(124, 77, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },

  selectedCheckmark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  customImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },

  customImageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  customImageIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  customImageText: {
    color: '#7C4DFF',
    fontSize: 16,
    fontWeight: '600',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },

  tipsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
  },

  tipsTitle: {
    color: '#CDD3E1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  tipsText: {
    color: '#A8B0C3',
    fontSize: 13,
    lineHeight: 18,
  },
});
