import React from 'react';
import { Pressable, ImageBackground, View, Text } from 'react-native';
import { instrumentOptionType, styles } from './FavoriteInstrument';
import { UserInstrument } from '../../../core/models/data/User';

const InstrumentOption = ({
  item,
  isSelected,
  handleInstrumentSelect,
}: {
  item: instrumentOptionType;
  isSelected: boolean;
  handleInstrumentSelect: (ins: UserInstrument) => void;
}) => {
  return (
    <Pressable
      style={[
        styles.instrumentCard,
        isSelected && styles.instrumentCardSelected,
      ]}
      onPress={() => handleInstrumentSelect(item.key)}
      accessibilityRole="button"
      accessibilityLabel={`Seleccionar ${item.label}`}
      accessibilityHint={item.description}
      accessibilityState={{
        selected: isSelected,
      }}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.instrumentImage}
        imageStyle={styles.instrumentImageStyle}
      >
        <View style={styles.instrumentOverlay}>
          <View
            style={[
              styles.instrumentLabelContainer,
              isSelected && styles.instrumentLabelSelected,
            ]}
          >
            <Text style={styles.instrumentLabel}>{item.label}</Text>
            <Text style={styles.instrumentDescription}>{item.description}</Text>
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedCheckmark}>✓</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default InstrumentOption;
