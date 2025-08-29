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
    'C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
  ];
  
  const minorKeys = [
    'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'
  ];
  
  // Estructura de escalas con acordes completos y idPosition
  const scaleData = [
    {
      key: 'C',
      values: [
        { position: 'I', note: 'C', idPosition: '0e' },
        { position: 'ii', note: 'Dm', idPosition: '11i' },
        { position: 'iii', note: 'Em', idPosition: '1i' },
        { position: 'IV', note: 'F', idPosition: '11e' },
        { position: 'V', note: 'G', idPosition: '1e' },
        { position: 'vi', note: 'Am', idPosition: '0i' },
        { position: 'vii°', note: 'Bm', idPosition: '2i' }
      ]
    },
    {
      key: 'G',
      values: [
        { position: 'I', note: 'G', idPosition: '1e' },
        { position: 'ii', note: 'Am', idPosition: '0i' },
        { position: 'iii', note: 'Bm', idPosition: '2i' },
        { position: 'IV', note: 'C', idPosition: '0e' },
        { position: 'V', note: 'D', idPosition: '2e' },
        { position: 'vi', note: 'Em', idPosition: '1i' },
        { position: 'vii', note: 'F#', idPosition: '3i' }
      ]
    },
    {
      key: 'D',
      values: [
        { position: 'I', note: 'D', idPosition: '2e' },
        { position: 'ii', note: 'Em', idPosition: '1i' },
        { position: 'iii', note: 'F#m', idPosition: '3i' },
        { position: 'IV', note: 'G', idPosition: '1e' },
        { position: 'V', note: 'A', idPosition: '3e' },
        { position: 'vi', note: 'Bm', idPosition: '2i' },
        { position: 'vii°', note: 'C#°', idPosition: '4i' }
      ]
    },
    {
      key: 'A',
      values: [
        { position: 'I', note: 'A', idPosition: '3e' },
        { position: 'ii', note: 'Bm', idPosition: '2i' },
        { position: 'iii', note: 'C#m', idPosition: '4i' },
        { position: 'IV', note: 'D', idPosition: '2e' },
        { position: 'V', note: 'E', idPosition: '4e' },
        { position: 'vi', note: 'F#m', idPosition: '3i' },
        { position: 'vii°', note: 'G#°', idPosition: '5i' }
      ]
    },
    {
      key: 'E',
      values: [
        { position: 'I', note: 'E', idPosition: '4e' },
        { position: 'ii', note: 'F#m', idPosition: '3i' },
        { position: 'iii', note: 'G#m', idPosition: '5i' },
        { position: 'IV', note: 'A', idPosition: '3e' },
        { position: 'V', note: 'B', idPosition: '5e' },
        { position: 'vi', note: 'C#m', idPosition: '4i' },
        { position: 'vii°', note: 'D#°', idPosition: '6i' }
      ]
    },
    {
      key: 'B',
      values: [
        { position: 'I', note: 'B', idPosition: '5e' },
        { position: 'ii', note: 'C#m', idPosition: '4i' },
        { position: 'iii', note: 'D#m', idPosition: '6i' },
        { position: 'IV', note: 'E', idPosition: '4e' },
        { position: 'V', note: 'F#', idPosition: '6e' },
        { position: 'vi', note: 'G#m', idPosition: '5i' },
        { position: 'vii°', note: 'A#°', idPosition: '7i' }
      ]
    },
    {
      key: 'F#/Gb',
      values: [
        { position: 'I', note: 'F#', idPosition: '6e' },
        { position: 'ii', note: 'G#m', idPosition: '5i' },
        { position: 'iii', note: 'A#m', idPosition: '7i' },
        { position: 'IV', note: 'B', idPosition: '5e' },
        { position: 'V', note: 'C#', idPosition: '7e' },
        { position: 'vi', note: 'D#m', idPosition: '6i' },
        { position: 'vii°', note: 'Fm°', idPosition: '8i' }
      ]
    },
    {
      key: 'Db',
      values: [
        { position: 'I', note: 'Db', idPosition: '7e' },
        { position: 'ii', note: 'Ebm', idPosition: '6i' },
        { position: 'iii', note: 'Fm', idPosition: '8i' },
        { position: 'IV', note: 'Gb', idPosition: '6e' },
        { position: 'V', note: 'Ab', idPosition: '8e' },
        { position: 'vi', note: 'Bbm', idPosition: '7i' },
        { position: 'vii°', note: 'Cm°', idPosition: '9i' }
      ]
    },
    {
      key: 'Ab',
      values: [
        { position: 'I', note: 'Ab', idPosition: '8e' },
        { position: 'ii', note: 'Bbm', idPosition: '7i' },
        { position: 'iii', note: 'Cm', idPosition: '9i' },
        { position: 'IV', note: 'Db', idPosition: '7e' },
        { position: 'V', note: 'Eb', idPosition: '9e' },
        { position: 'vi', note: 'Fm', idPosition: '8i' },
        { position: 'vii°', note: 'Gm°', idPosition: '10i' }
      ]
    },
    {
      key: 'Eb',
      values: [
        { position: 'I', note: 'Eb', idPosition: '9e' },
        { position: 'ii', note: 'Fm', idPosition: '8i' },
        { position: 'iii', note: 'Gm', idPosition: '10i' },
        { position: 'IV', note: 'Ab', idPosition: '8e' },
        { position: 'V', note: 'Bb', idPosition: '10e' },
        { position: 'vi', note: 'Cm', idPosition: '9i' },
        { position: 'vii°', note: 'Dm°', idPosition: '11i' }
      ]
    },
    {
      key: 'Bb',
      values: [
        { position: 'I', note: 'Bb', idPosition: '10e' },
        { position: 'ii', note: 'Cm', idPosition: '9i' },
        { position: 'iii', note: 'Dm', idPosition: '11i' },
        { position: 'IV', note: 'Eb', idPosition: '9e' },
        { position: 'V', note: 'F', idPosition: '11e' },
        { position: 'vi', note: 'Gm', idPosition: '10i' },
        { position: 'vii°', note: 'Am°', idPosition: '0i' }
      ]
    },
    {
      key: 'F',
      values: [
        { position: 'I', note: 'F', idPosition: '11e' },
        { position: 'ii', note: 'Gm', idPosition: '10i' },
        { position: 'iii', note: 'Am', idPosition: '0i' },
        { position: 'IV', note: 'Bb', idPosition: '10e' },
        { position: 'V', note: 'C', idPosition: '0e' },
        { position: 'vi', note: 'Dm', idPosition: '11i' },
        { position: 'vii°', note: 'E°', idPosition: '1i' }
      ]
    },
    // Escalas menores
    {
      key: 'Am',
      values: [
        { position: 'i', note: 'Am', idPosition: '0i' },
        { position: 'ii°', note: 'B°', idPosition: '2i' },
        { position: 'III', note: 'C', idPosition: '0e' },
        { position: 'iv', note: 'Dm', idPosition: '11i' },
        { position: 'v', note: 'Em', idPosition: '1i' },
        { position: 'VI', note: 'F', idPosition: '11e' },
        { position: 'VII', note: 'G', idPosition: '1e' }
      ]
    },
    {
      key: 'Em',
      values: [
        { position: 'i', note: 'Em', idPosition: '1i' },
        { position: 'ii°', note: 'Bm°', idPosition: '3i' },
        { position: 'III', note: 'G', idPosition: '1e' },
        { position: 'iv', note: 'Am', idPosition: '0i' },
        { position: 'v', note: 'Bm', idPosition: '2i' },
        { position: 'VI', note: 'C', idPosition: '0e' },
        { position: 'VII', note: 'D', idPosition: '2e' }
      ]
    },
    {
      key: 'Bm',
      values: [
        { position: 'i', note: 'Bm', idPosition: '2i' },
        { position: 'ii°', note: 'C#°', idPosition: '4i' },
        { position: 'III', note: 'D', idPosition: '2e' },
        { position: 'iv', note: 'Em', idPosition: '1i' },
        { position: 'v', note: 'F#m', idPosition: '3i' },
        { position: 'VI', note: 'G', idPosition: '1e' },
        { position: 'VII', note: 'A', idPosition: '3e' }
      ]
    },
    {
      key: 'F#m',
      values: [
        { position: 'i', note: 'F#m', idPosition: '3i' },
        { position: 'ii°', note: 'G#°', idPosition: '5i' },
        { position: 'III', note: 'A', idPosition: '3e' },
        { position: 'iv', note: 'Bm', idPosition: '2i' },
        { position: 'v', note: 'C#m', idPosition: '4i' },
        { position: 'VI', note: 'D', idPosition: '2e' },
        { position: 'VII', note: 'E', idPosition: '4e' }
      ]
    },
    {
      key: 'C#m',
      values: [
        { position: 'i', note: 'C#m', idPosition: '4i' },
        { position: 'ii°', note: 'D#°', idPosition: '6i' },
        { position: 'III', note: 'E', idPosition: '4e' },
        { position: 'iv', note: 'F#m', idPosition: '3i' },
        { position: 'v', note: 'G#m', idPosition: '5i' },
        { position: 'VI', note: 'A', idPosition: '3e' },
        { position: 'VII', note: 'B', idPosition: '5e' }
      ]
    },
    {
      key: 'G#m',
      values: [
        { position: 'i', note: 'G#m', idPosition: '5i' },
        { position: 'ii°', note: 'Fm°', idPosition: '7i' },
        { position: 'III', note: 'B', idPosition: '5e' },
        { position: 'iv', note: 'C#m', idPosition: '4i' },
        { position: 'v', note: 'D#m', idPosition: '6i' },
        { position: 'VI', note: 'E', idPosition: '4e' },
        { position: 'VII', note: 'F#', idPosition: '6e' }
      ]
    },
    {
      key: 'Ebm',
      values: [
        { position: 'i', note: 'Ebm', idPosition: '6i' },
        { position: 'ii°', note: 'F°', idPosition: '8i' },
        { position: 'III', note: 'Gb', idPosition: '6e' },
        { position: 'iv', note: 'Abm', idPosition: '5i' },
        { position: 'v', note: 'Bbm', idPosition: '7i' },
        { position: 'VI', note: 'Cb', idPosition: '5e' },
        { position: 'VII', note: 'Db', idPosition: '7e' }
      ]
    },
    {
      key: 'Bbm',
      values: [
        { position: 'i', note: 'Bbm', idPosition: '7i' },
        { position: 'ii°', note: 'C°', idPosition: '9i' },
        { position: 'III', note: 'Db', idPosition: '7e' },
        { position: 'iv', note: 'Ebm', idPosition: '6i' },
        { position: 'v', note: 'Fm', idPosition: '8i' },
        { position: 'VI', note: 'Gb', idPosition: '6e' },
        { position: 'VII', note: 'Ab', idPosition: '8e' }
      ]
    },
    {
      key: 'Fm',
      values: [
        { position: 'i', note: 'Fm', idPosition: '8i' },
        { position: 'ii°', note: 'G°', idPosition: '10i' },
        { position: 'III', note: 'Ab', idPosition: '8e' },
        { position: 'iv', note: 'Bbm', idPosition: '7i' },
        { position: 'v', note: 'Cm', idPosition: '9i' },
        { position: 'VI', note: 'Db', idPosition: '7e' },
        { position: 'VII', note: 'Eb', idPosition: '9e' }
      ]
    },
    {
      key: 'Cm',
      values: [
        { position: 'i', note: 'Cm', idPosition: '9i' },
        { position: 'ii°', note: 'D°', idPosition: '11i' },
        { position: 'III', note: 'Eb', idPosition: '9e' },
        { position: 'iv', note: 'Fm', idPosition: '8i' },
        { position: 'v', note: 'Gm', idPosition: '10i' },
        { position: 'VI', note: 'Ab', idPosition: '8e' },
        { position: 'VII', note: 'Bb', idPosition: '10e' }
      ]
    },
    {
      key: 'Gm',
      values: [
        { position: 'i', note: 'Gm', idPosition: '10i' },
        { position: 'ii°', note: 'A°', idPosition: '0i' },
        { position: 'III', note: 'Bb', idPosition: '10e' },
        { position: 'iv', note: 'Cm', idPosition: '9i' },
        { position: 'v', note: 'Dm', idPosition: '11i' },
        { position: 'VI', note: 'Eb', idPosition: '9e' },
        { position: 'VII', note: 'F', idPosition: '11e' }
      ]
    },
    {
      key: 'Dm',
      values: [
        { position: 'i', note: 'Dm', idPosition: '11i' },
        { position: 'ii°', note: 'E°', idPosition: '1i' },
        { position: 'III', note: 'F', idPosition: '11e' },
        { position: 'iv', note: 'Gm', idPosition: '10i' },
        { position: 'v', note: 'Am', idPosition: '0i' },
        { position: 'VI', note: 'Bb', idPosition: '10e' },
        { position: 'VII', note: 'C', idPosition: '0e' }
      ]
    }
  ];
  
  const noteEquals = (note1, note2) => {
    const cleanNote1 = note1.replace('#', '').replace('b', '');
    const cleanNote2 = note2.replace('#', '').replace('b', '').replace('/Gb', '').replace('/F#', '');
    return cleanNote1 === cleanNote2 || 
           note1 === note2 + '#' || 
           note1 === note2 + 'b' ||
           note2 === note1 + '#' || 
           note2 === note1 + 'b' ||
           (note1 === 'F#' && note2 === 'Gb') ||
           (note1 === 'Gb' && note2 === 'F#');
  };
  
  const isKeyInSelectedScale = (key) => {
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
  
  const getRadialLinePoints = (index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const x1 = CENTER + Math.cos(angle) * MIDDLE_RADIUS;
    const y1 = CENTER + Math.sin(angle) * MIDDLE_RADIUS;
    const x2 = CENTER + Math.cos(angle) * OUTER_RADIUS;
    const y2 = CENTER + Math.sin(angle) * OUTER_RADIUS;
    return { x1, y1, x2, y2 };
  };
  
  const handleSegmentPress = (key) => {
    setSelectedKey(key);
  };
  
  const renderScaleDegrees = () => {
    const selectedScale = scaleData.find(scale => scale.key === selectedKey);
    if (!selectedScale) return null;
    
    const degrees = [];
    
    // Usar idPosition para posicionar los grados de escala
    selectedScale.values.forEach(scaleChord => {
      const idPosition = scaleChord.idPosition;
      if (!idPosition) return;
      
      const positionIndex = parseInt(idPosition.substring(0, idPosition.length - 1));
      const isExternal = idPosition.endsWith('e');
      
      const segmentCenterAngle = (positionIndex * 30 + 15 - 90) * (Math.PI / 180);
      let radius;
      
      if (isExternal) {
        radius = (OUTER_RADIUS + INNER_RADIUS) / 2;
      } else {
        radius = (INNER_RADIUS + MIDDLE_RADIUS) / 2;
      }
      
      const x = CENTER + Math.cos(segmentCenterAngle) * radius;
      const y = CENTER + Math.sin(segmentCenterAngle) * radius;
      
      degrees.push(
        <React.Fragment key={`degree-${positionIndex}-${scaleChord.position}`}>
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
        </React.Fragment>
      );
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
      
      const majorColor = isMajorSelected ? '#4CAF50' : 
                        isMajorInScale ? '#81C784' : 
                        selectedKey && !isMajorInScale ? '#F5F5F5' : '#E0E0E0';
                        
      const minorColor = isMinorSelected ? '#2E7D32' : 
                        isMinorInScale ? '#66BB6A' : 
                        selectedKey && !isMinorInScale ? '#EEEEEE' : '#BDBDBD';
      
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
        />
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
            fontWeight={isMajorSelected || isMajorInScale ? "bold" : "normal"}
            fill={isMajorSelected || isMajorInScale ? "#FFFFFF" : "#333333"}
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
            fontWeight={isMinorSelected || isMinorInScale ? "bold" : "normal"}
            fill={isMinorSelected || isMinorInScale ? "#FFFFFF" : "#333333"}
            textAnchor="middle"
            alignmentBaseline="middle"
            onPress={() => handleSegmentPress(minorKey)}
          >
            {minorKey}
          </SvgText>
        </React.Fragment>
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
          {selectedKey ? `Tonalidad: ${selectedKey}` : 'Selecciona una tonalidad'}
        </Text>
        {selectedKey && (
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleLabel}>Acordes de la escala:</Text>
            <Text style={styles.scaleNotes}>
              {(() => {
                const selectedScale = scaleData.find(scale => scale.key === selectedKey);
                return selectedScale ? selectedScale.values.map(chord => `${chord.position}: ${chord.note} (${chord.idPosition})`).join(' - ') : '';
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