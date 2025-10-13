import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  Line,
} from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(screenWidth, screenHeight) * 0.8;
const CENTER = CIRCLE_SIZE / 2;
const OUTER_RADIUS = CIRCLE_SIZE * 0.35;
const INNER_RADIUS = CIRCLE_SIZE * 0.27;
const MIDDLE_RADIUS = CIRCLE_SIZE * 0.15;

const CircleOfFifths = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  // Círculo de quintas ordenado correctamente - Do arriba
  const majorKeys = [
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#/Gb',
    'Db',
    'Ab',
    'Eb',
    'Bb',
    'F',
  ];

  const minorKeys = [
    'Am',
    'Em',
    'Bm',
    'F#m',
    'C#m',
    'G#m',
    'Ebm',
    'Bbm',
    'Fm',
    'Cm',
    'Gm',
    'Dm',
  ];

  // Estructura de escalas con acordes completos
  const scaleData = [
    // Escalas mayores
    {
      key: 'C',
      values: [
        { position: 'I', note: 'C' },
        { position: 'ii', note: 'Dm' },
        { position: 'iii', note: 'Em' },
        { position: 'IV', note: 'F' },
        { position: 'V', note: 'G' },
        { position: 'vi', note: 'Am' },
        { position: 'vii°', note: 'B°' },
      ],
    },
    {
      key: 'G',
      values: [
        { position: 'I', note: 'G' },
        { position: 'ii', note: 'Am' },
        { position: 'iii', note: 'Bm' },
        { position: 'IV', note: 'C' },
        { position: 'V', note: 'D' },
        { position: 'vi', note: 'Em' },
        { position: 'vii°', note: 'F#°' },
      ],
    },
    {
      key: 'D',
      values: [
        { position: 'I', note: 'D' },
        { position: 'ii', note: 'Em' },
        { position: 'iii', note: 'F#m' },
        { position: 'IV', note: 'G' },
        { position: 'V', note: 'A' },
        { position: 'vi', note: 'Bm' },
        { position: 'vii°', note: 'C#°' },
      ],
    },
    {
      key: 'A',
      values: [
        { position: 'I', note: 'A' },
        { position: 'ii', note: 'Bm' },
        { position: 'iii', note: 'C#m' },
        { position: 'IV', note: 'D' },
        { position: 'V', note: 'E' },
        { position: 'vi', note: 'F#m' },
        { position: 'vii°', note: 'G#°' },
      ],
    },
    {
      key: 'E',
      values: [
        { position: 'I', note: 'E' },
        { position: 'ii', note: 'F#m' },
        { position: 'iii', note: 'G#m' },
        { position: 'IV', note: 'A' },
        { position: 'V', note: 'B' },
        { position: 'vi', note: 'C#m' },
        { position: 'vii°', note: 'D#°' },
      ],
    },
    {
      key: 'B',
      values: [
        { position: 'I', note: 'B' },
        { position: 'ii', note: 'C#m' },
        { position: 'iii', note: 'D#m' },
        { position: 'IV', note: 'E' },
        { position: 'V', note: 'F#' },
        { position: 'vi', note: 'G#m' },
        { position: 'vii°', note: 'A#°' },
      ],
    },
    {
      key: 'F#/Gb',
      values: [
        { position: 'I', note: 'F#' },
        { position: 'ii', note: 'G#m' },
        { position: 'iii', note: 'A#m' },
        { position: 'IV', note: 'B' },
        { position: 'V', note: 'C#' },
        { position: 'vi', note: 'D#m' },
        { position: 'vii°', note: 'E#°' },
      ],
    },
    {
      key: 'Db',
      values: [
        { position: 'I', note: 'Db' },
        { position: 'ii', note: 'Ebm' },
        { position: 'iii', note: 'Fm' },
        { position: 'IV', note: 'Gb' },
        { position: 'V', note: 'Ab' },
        { position: 'vi', note: 'Bbm' },
        { position: 'vii°', note: 'C°' },
      ],
    },
    {
      key: 'Ab',
      values: [
        { position: 'I', note: 'Ab' },
        { position: 'ii', note: 'Bbm' },
        { position: 'iii', note: 'Cm' },
        { position: 'IV', note: 'Db' },
        { position: 'V', note: 'Eb' },
        { position: 'vi', note: 'Fm' },
        { position: 'vii°', note: 'G°' },
      ],
    },
    {
      key: 'Eb',
      values: [
        { position: 'I', note: 'Eb' },
        { position: 'ii', note: 'Fm' },
        { position: 'iii', note: 'Gm' },
        { position: 'IV', note: 'Ab' },
        { position: 'V', note: 'Bb' },
        { position: 'vi', note: 'Cm' },
        { position: 'vii°', note: 'D°' },
      ],
    },
    {
      key: 'Bb',
      values: [
        { position: 'I', note: 'Bb' },
        { position: 'ii', note: 'Cm' },
        { position: 'iii', note: 'Dm' },
        { position: 'IV', note: 'Eb' },
        { position: 'V', note: 'F' },
        { position: 'vi', note: 'Gm' },
        { position: 'vii°', note: 'A°' },
      ],
    },
    {
      key: 'F',
      values: [
        { position: 'I', note: 'F' },
        { position: 'ii', note: 'Gm' },
        { position: 'iii', note: 'Am' },
        { position: 'IV', note: 'Bb' },
        { position: 'V', note: 'C' },
        { position: 'vi', note: 'Dm' },
        { position: 'vii°', note: 'E°' },
      ],
    },
    // Escalas menores
    {
      key: 'Am',
      values: [
        { position: 'i', note: 'Am' },
        { position: 'ii°', note: 'B°' },
        { position: 'III', note: 'C' },
        { position: 'iv', note: 'Dm' },
        { position: 'v', note: 'Em' },
        { position: 'VI', note: 'F' },
        { position: 'VII', note: 'G' },
      ],
    },
    {
      key: 'Em',
      values: [
        { position: 'i', note: 'Em' },
        { position: 'ii°', note: 'F#°' },
        { position: 'III', note: 'G' },
        { position: 'iv', note: 'Am' },
        { position: 'v', note: 'Bm' },
        { position: 'VI', note: 'C' },
        { position: 'VII', note: 'D' },
      ],
    },
    {
      key: 'Bm',
      values: [
        { position: 'i', note: 'Bm' },
        { position: 'ii°', note: 'C#°' },
        { position: 'III', note: 'D' },
        { position: 'iv', note: 'Em' },
        { position: 'v', note: 'F#m' },
        { position: 'VI', note: 'G' },
        { position: 'VII', note: 'A' },
      ],
    },
    {
      key: 'F#m',
      values: [
        { position: 'i', note: 'F#m' },
        { position: 'ii°', note: 'G#°' },
        { position: 'III', note: 'A' },
        { position: 'iv', note: 'Bm' },
        { position: 'v', note: 'C#m' },
        { position: 'VI', note: 'D' },
        { position: 'VII', note: 'E' },
      ],
    },
    {
      key: 'C#m',
      values: [
        { position: 'i', note: 'C#m' },
        { position: 'ii°', note: 'D#°' },
        { position: 'III', note: 'E' },
        { position: 'iv', note: 'F#m' },
        { position: 'v', note: 'G#m' },
        { position: 'VI', note: 'A' },
        { position: 'VII', note: 'B' },
      ],
    },
    {
      key: 'G#m',
      values: [
        { position: 'i', note: 'G#m' },
        { position: 'ii°', note: 'A#°' },
        { position: 'III', note: 'B' },
        { position: 'iv', note: 'C#m' },
        { position: 'v', note: 'D#m' },
        { position: 'VI', note: 'E' },
        { position: 'VII', note: 'F#' },
      ],
    },
    {
      key: 'Ebm',
      values: [
        { position: 'i', note: 'Ebm' },
        { position: 'ii°', note: 'F°' },
        { position: 'III', note: 'Gb' },
        { position: 'iv', note: 'Abm' },
        { position: 'v', note: 'Bbm' },
        { position: 'VI', note: 'B' },
        { position: 'VII', note: 'Db' },
      ],
    },
    {
      key: 'Bbm',
      values: [
        { position: 'i', note: 'Bbm' },
        { position: 'ii°', note: 'C°' },
        { position: 'III', note: 'Db' },
        { position: 'iv', note: 'Ebm' },
        { position: 'v', note: 'Fm' },
        { position: 'VI', note: 'Gb' },
        { position: 'VII', note: 'Ab' },
      ],
    },
    {
      key: 'Fm',
      values: [
        { position: 'i', note: 'Fm' },
        { position: 'ii°', note: 'G°' },
        { position: 'III', note: 'Ab' },
        { position: 'iv', note: 'Bbm' },
        { position: 'v', note: 'Cm' },
        { position: 'VI', note: 'Db' },
        { position: 'VII', note: 'Eb' },
      ],
    },
    {
      key: 'Cm',
      values: [
        { position: 'i', note: 'Cm' },
        { position: 'ii°', note: 'D°' },
        { position: 'III', note: 'Eb' },
        { position: 'iv', note: 'Fm' },
        { position: 'v', note: 'Gm' },
        { position: 'VI', note: 'Ab' },
        { position: 'VII', note: 'Bb' },
      ],
    },
    {
      key: 'Gm',
      values: [
        { position: 'i', note: 'Gm' },
        { position: 'ii°', note: 'A°' },
        { position: 'III', note: 'Bb' },
        { position: 'iv', note: 'Cm' },
        { position: 'v', note: 'Dm' },
        { position: 'VI', note: 'Eb' },
        { position: 'VII', note: 'F' },
      ],
    },
    {
      key: 'Dm',
      values: [
        { position: 'i', note: 'Dm' },
        { position: 'ii°', note: 'E°' },
        { position: 'III', note: 'F' },
        { position: 'iv', note: 'Gm' },
        { position: 'v', note: 'Am' },
        { position: 'VI', note: 'Bb' },
        { position: 'VII', note: 'C' },
      ],
    },
  ];

  const noteEquals = (note1, note2) => {
    const cleanNote1 = note1.replace('#', '').replace('b', '');
    const cleanNote2 = note2
      .replace('#', '')
      .replace('b', '')
      .replace('/Gb', '')
      .replace('/F#', '');
    return (
      cleanNote1 === cleanNote2 ||
      note1 === note2 + '#' ||
      note1 === note2 + 'b' ||
      note2 === note1 + '#' ||
      note2 === note1 + 'b' ||
      (note1 === 'F#' && note2 === 'Gb') ||
      (note1 === 'Gb' && note2 === 'F#')
    );
  };

  const isKeyInSelectedScale = key => {
    const selectedScale = scaleData.find(scale => scale.key === selectedKey);
    if (!selectedScale) return false;

    const keyRoot = key.replace('m', '').replace('/Gb', '').replace('/F#', '');

    return selectedScale.values.some(scaleChord => {
      const chordRoot = scaleChord.note.replace('m', '').replace('°', '');
      return noteEquals(chordRoot, keyRoot);
    });
  };

  const createSegmentPath = (index, outerRadius, innerRadius) => {
    // Rotación corregida: Do arriba (índice 0 = 270°)
    const startAngle = (index * 30 - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

    const x1 = CENTER + Math.cos(startAngle) * outerRadius;
    const y1 = CENTER + Math.sin(startAngle) * outerRadius;
    const x2 = CENTER + Math.cos(endAngle) * outerRadius;
    const y2 = CENTER + Math.sin(endAngle) * outerRadius;

    const x3 = CENTER + Math.cos(endAngle) * innerRadius;
    const y3 = CENTER + Math.sin(endAngle) * innerRadius;
    const x4 = CENTER + Math.cos(startAngle) * innerRadius;
    const y4 = CENTER + Math.sin(startAngle) * innerRadius;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  };

  const getTextPosition = (index, outerRadius, innerRadius) => {
    // Centrar el texto en el medio de cada segmento
    const segmentCenterAngle = (index * 30 + 15 - 90) * (Math.PI / 180);
    const radius = (outerRadius + innerRadius) / 2;
    const x = CENTER + Math.cos(segmentCenterAngle) * radius;
    const y = CENTER + Math.sin(segmentCenterAngle) * radius;
    return { x, y };
  };

  const getRadialLinePoints = index => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const x1 = CENTER + Math.cos(angle) * MIDDLE_RADIUS;
    const y1 = CENTER + Math.sin(angle) * MIDDLE_RADIUS;
    const x2 = CENTER + Math.cos(angle) * OUTER_RADIUS;
    const y2 = CENTER + Math.sin(angle) * OUTER_RADIUS;
    return { x1, y1, x2, y2 };
  };

  const handleSegmentPress = key => {
    setSelectedKey(key);
  };

  const renderScaleDegrees = () => {
    const selectedScale = scaleData.find(scale => scale.key === selectedKey);
    if (!selectedScale) return null;

    const degrees = [];

    selectedScale.values.forEach(scaleChord => {
      // Encontrar en qué posición del círculo está este acorde
      const chordRoot = scaleChord.note.replace('m', '').replace('°', '');

      // Buscar en mayores
      let circleIndex = majorKeys.findIndex(key => {
        const keyRoot = key.replace('/Gb', '').replace('/F#', '');
        return noteEquals(chordRoot, keyRoot);
      });

      let isMajorChord = circleIndex !== -1;

      // Si no se encuentra en mayores, buscar en menores
      if (circleIndex === -1) {
        circleIndex = minorKeys.findIndex(key => {
          const keyRoot = key.replace('m', '');
          return noteEquals(chordRoot, keyRoot);
        });
        isMajorChord = false;
      }

      if (circleIndex !== -1) {
        const segmentCenterAngle =
          (circleIndex * 30 + 15 - 90) * (Math.PI / 180);
        let radius;

        if (isMajorChord) {
          radius = (OUTER_RADIUS + INNER_RADIUS) / 2;
        } else {
          radius = (INNER_RADIUS + MIDDLE_RADIUS) / 2;
        }

        const x = CENTER + Math.cos(segmentCenterAngle) * radius;
        const y = CENTER + Math.sin(segmentCenterAngle) * radius;

        degrees.push(
          <React.Fragment key={`degree-${circleIndex}-${scaleChord.position}`}>
            <Circle
              cx={x}
              cy={y - 16}
              r="10"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
            />
            <SvgText
              x={x}
              y={y - 16}
              fontSize="8"
              fontWeight="bold"
              fill="#000000"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {scaleChord.position}
            </SvgText>
          </React.Fragment>,
        );
      }
    });

    return degrees;
  };

  const renderSegments = () => {
    const segments = [];
    const lines = [];

    for (let index = 0; index < majorKeys.length; index++) {
      const majorKey = majorKeys[index];
      const minorKey = minorKeys[index];
      const isMajorSelected = selectedKey === majorKey;
      const isMinorSelected = selectedKey === minorKey;
      const isMajorInScale = isKeyInSelectedScale(majorKey);
      const isMinorInScale = isKeyInSelectedScale(minorKey);

      const majorColor = isMajorSelected
        ? '#4CAF50'
        : isMajorInScale
        ? '#81C784'
        : selectedKey && !isMajorInScale
        ? '#F5F5F5'
        : '#E0E0E0';

      const minorColor = isMinorSelected
        ? '#2E7D32'
        : isMinorInScale
        ? '#66BB6A'
        : selectedKey && !isMinorInScale
        ? '#EEEEEE'
        : '#BDBDBD';

      const majorPath = createSegmentPath(index, OUTER_RADIUS, INNER_RADIUS);
      const minorPath = createSegmentPath(index, INNER_RADIUS, MIDDLE_RADIUS);

      const majorTextPos = getTextPosition(index, OUTER_RADIUS, INNER_RADIUS);
      const minorTextPos = getTextPosition(index, INNER_RADIUS, MIDDLE_RADIUS);

      // Líneas radiales
      const linePoints = getRadialLinePoints(index);
      lines.push(
        <Line
          key={`line-${index}`}
          x1={linePoints.x1}
          y1={linePoints.y1}
          x2={linePoints.x2}
          y2={linePoints.y2}
          stroke="#FFFFFF"
          strokeWidth="2"
        />,
      );

      segments.push(
        <React.Fragment key={index}>
          <Path
            d={majorPath}
            fill={majorColor}
            stroke="#FFFFFF"
            strokeWidth="2"
            onPress={() => handleSegmentPress(majorKey)}
          />
          <Path
            d={minorPath}
            fill={minorColor}
            stroke="#FFFFFF"
            strokeWidth="2"
            onPress={() => handleSegmentPress(minorKey)}
          />
          <SvgText
            x={majorTextPos.x}
            y={majorTextPos.y}
            fontSize="13"
            fontWeight={isMajorSelected || isMajorInScale ? 'bold' : 'normal'}
            fill={isMajorSelected || isMajorInScale ? '#FFFFFF' : '#333333'}
            textAnchor="middle"
            alignmentBaseline="middle"
            onPress={() => handleSegmentPress(majorKey)}
          >
            {majorKey}
          </SvgText>
          <SvgText
            x={minorTextPos.x}
            y={minorTextPos.y}
            fontSize="11"
            fontWeight={isMinorSelected || isMinorInScale ? 'bold' : 'normal'}
            fill={isMinorSelected || isMinorInScale ? '#FFFFFF' : '#333333'}
            textAnchor="middle"
            alignmentBaseline="middle"
            onPress={() => handleSegmentPress(minorKey)}
          >
            {minorKey}
          </SvgText>
        </React.Fragment>,
      );
    }

    return [...segments, ...lines];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Círculo de Quintas</Text>

      <View style={styles.circleContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <Defs>
            <RadialGradient id="centerGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#ffffff" />
              <Stop offset="100%" stopColor="#f0f0f0" />
            </RadialGradient>
          </Defs>

          {/* Segments and lines */}
          {renderSegments()}

          {/* Scale degrees */}
          {renderScaleDegrees()}

          {/* Círculos de borde */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Center circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={MIDDLE_RADIUS}
            fill="url(#centerGradient)"
            stroke="#CCCCCC"
            strokeWidth="2"
            onPress={() => setSelectedKey(null)}
          />
        </Svg>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.selectedKey}>
          {selectedKey
            ? `Tonalidad: ${selectedKey}`
            : 'Selecciona una tonalidad'}
        </Text>
        {selectedKey && (
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleLabel}>Acordes de la escala:</Text>
            <Text style={styles.scaleNotes}>
              {(() => {
                const selectedScale = scaleData.find(
                  scale => scale.key === selectedKey,
                );
                return selectedScale
                  ? selectedScale.values
                      .map(chord => `${chord.position}: ${chord.note}`)
                      .join(' - ')
                  : '';
              })()}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setSelectedKey(null)}
      >
        <Text style={styles.resetButtonText}>Resetear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#667eea',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  circleContainer: {
    backgroundColor: 'transparent',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  selectedKey: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 15,
  },
  scaleInfo: {
    alignItems: 'center',
  },
  scaleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  scaleNotes: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CircleOfFifths;
