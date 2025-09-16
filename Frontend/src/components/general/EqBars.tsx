import React, { useMemo, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import { styles } from '../../screens/auth/LoginScreen';

/** ==== Equalizer decorativo (solo UI) ==== */
export const EqBars = ({
  bars = 12,
  color = '#6F9BFF',
  heightMin = 8,
  heightMax = 28,
}: {
  bars?: number;
  color?: string;
  heightMin?: number;
  heightMax?: number;
}) => {
  const anims = useMemo(
    () => Array.from({ length: bars }, () => new Animated.Value(0)),
    [bars],
  );

  useEffect(() => {
    anims.forEach((v, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: 800 + (i % 3) * 150,
            delay: i * 90,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 700 + ((i + 1) % 3) * 120,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
      ).start();
    });
  }, [anims]);

  return (
    <View style={styles.eqRow} pointerEvents="none">
      {anims.map((v, i) => {
        const h = v.interpolate({
          inputRange: [0, 1],
          outputRange: [heightMin, heightMax + (i % 2) * 8],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.eqBar,
              { height: h, opacity: 0.9, backgroundColor: color },
            ]}
          />
        );
      })}
    </View>
  );
};
