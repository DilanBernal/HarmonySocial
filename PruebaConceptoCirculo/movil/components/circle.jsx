import React, { useState, useEffect } from 'react';
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
  
  // Estructura de escalas con acordes completos (versión simplificada para el ejemplo)
  const scaleData = [
    {
      key: 'C',
      values: [
        { position: 'I', note: 'C' },
        { position: 'ii', note: 'Dm' },
        { position: 'iii', note: 'Em' },
        { position: 'IV', note: 'F' },
        { position: 'V', note: 'G' },
        { position: 'vi', note: 'Am' },
        { position: 'vii°', note: 'B°' }
      ]
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
        { position: 'vii°', note: 'F#°' }
      ]
    },
    // Agrega todas las demás escalas como en la versión web...
    {
      key: 'Am',
      values: [
        { position: 'i', note: 'Am' },
        { position: 'ii°', note: 'B°' },
        { position: 'III', note: 'C' },
        { position: 'iv', note: 'Dm' },
        { position: 'v', note: 'Em' },
        { position: 'VI', note: 'F' },
        { position: 'VII', note: 'G' }
      ]
    }
    // ... continúa con todas las escalas
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
        const segmentCenterAngle = (circleIndex * 30 + 15 - 90) * (Math.PI / 180);
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
          </React.Fragment>
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
                return selectedScale ? selectedScale.values.map(chord => `${chord.position}: ${chord.note}`).join(' - ') : '';
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