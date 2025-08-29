class CircleOfFifths {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.outerRadius = 220;
    this.innerRadius = 160;
    this.middleRadius = 90;
    this.selectedKey = null;

    // Círculo de quintas ordenado correctamente - Do arriba
    this.majorKeys = [
      'C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
    ];

    this.minorKeys = [
      'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'
    ];

    // Estructura de escalas con acordes completos y idPosition
    this.scaleData = [
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

    this.init();
  }

  init() {
    this.draw();
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar segmentos
    for (let i = 0; i < 12; i++) {
      this.drawSegment(i, this.majorKeys[i], this.minorKeys[i]);
    }

    // Dibujar números de grado si hay una tonalidad seleccionada
    if (this.selectedKey) {
      this.drawScaleDegrees();
    }

    // Dibujar círculo central
    this.drawCenterCircle();
  }

  drawSegment(index, majorKey, minorKey) {
    // Rotación corregida: Do arriba (índice 0 = 270°)
    const startAngle = (index * 30 - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

    const isSelected = this.selectedKey === majorKey || this.selectedKey === minorKey;
    const isInScale = this.isKeyInSelectedScale(majorKey) || this.isKeyInSelectedScale(minorKey);

    // Colores
    let outerColor = isSelected ? '#4CAF50' : isInScale ? '#81C784' : '#E0E0E0';
    let innerColor = isSelected ? '#2E7D32' : isInScale ? '#66BB6A' : '#BDBDBD';

    if (this.selectedKey && !isSelected && !isInScale) {
      outerColor = '#F5F5F5';
      innerColor = '#EEEEEE';
    }

    // Dibujar segmento exterior (tonalidades mayores)
    this.ctx.fillStyle = outerColor;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngle, endAngle);
    this.ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngle, startAngle, true);
    this.ctx.closePath();
    this.ctx.fill();

    // Dibujar segmento interior (tonalidades menores)
    this.ctx.fillStyle = innerColor;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.innerRadius, startAngle, endAngle);
    this.ctx.arc(this.centerX, this.centerY, this.middleRadius, endAngle, startAngle, true);
    this.ctx.closePath();
    this.ctx.fill();

    // Dibujar bordes
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngle, endAngle);
    this.ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngle, startAngle, true);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.innerRadius, startAngle, endAngle);
    this.ctx.arc(this.centerX, this.centerY, this.middleRadius, endAngle, startAngle, true);
    this.ctx.closePath();
    this.ctx.stroke();

    // Dibujar líneas divisorias radiales
    this.ctx.beginPath();
    const x1 = this.centerX + Math.cos(startAngle) * this.middleRadius;
    const y1 = this.centerY + Math.sin(startAngle) * this.middleRadius;
    const x2 = this.centerX + Math.cos(startAngle) * this.outerRadius;
    const y2 = this.centerY + Math.sin(startAngle) * this.outerRadius;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Dibujar texto centrado en cada segmento
    this.drawText(majorKey, index, this.outerRadius, this.innerRadius, isSelected || isInScale);
    this.drawText(minorKey, index, this.innerRadius, this.middleRadius, isSelected || isInScale);
  }

  drawText(text, index, outerR, innerR, highlighted) {
    // Ángulo del centro del segmento
    const segmentCenterAngle = (index * 30 + 15 - 90) * (Math.PI / 180);
    const radius = (outerR + innerR) / 2;
    const x = this.centerX + Math.cos(segmentCenterAngle) * radius;
    const y = this.centerY + Math.sin(segmentCenterAngle) * radius;

    this.ctx.fillStyle = highlighted ? '#FFFFFF' : '#333333';
    this.ctx.font = highlighted ? 'bold 16px Arial' : '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  drawScaleDegrees() {
    const selectedScale = this.scaleData.find(scale => scale.key === this.selectedKey);
    if (!selectedScale) return;

    // Dibujar círculos amarillos usando idPosition
    selectedScale.values.forEach(scaleChord => {
      const idPosition = scaleChord.idPosition;
      const positionIndex = parseInt(idPosition.substring(0, idPosition.length - 1));
      const isExternal = idPosition.endsWith('e');

      const segmentCenterAngle = (positionIndex * 30 + 15 - 90) * (Math.PI / 180);
      let radius;

      if (isExternal) {
        radius = (this.outerRadius + this.innerRadius) / 2;
      } else {
        radius = (this.innerRadius + this.middleRadius) / 2;
      }

      const x = this.centerX + Math.cos(segmentCenterAngle) * radius;
      const y = this.centerY + Math.sin(segmentCenterAngle) * radius;

      // Dibujar círculo amarillo
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(x, y - 20, 12, 0, 2 * Math.PI);
      this.ctx.fill();

      // Dibujar borde
      this.ctx.strokeStyle = '#FFA500';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Dibujar número romano
      this.ctx.fillStyle = '#000000';
      this.ctx.font = 'bold 9px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(scaleChord.position, x, y - 20);
    });
  }

  drawCenterCircle() {
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.middleRadius
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.middleRadius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.strokeStyle = '#CCCCCC';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  isKeyInSelectedScale(key) {
    const selectedScale = this.scaleData.find(scale => scale.key === this.selectedKey);
    if (!selectedScale) return false;

    const keyRoot = key.replace('m', '').replace('/Gb', '').replace('/F#', '');

    return selectedScale.values.some(scaleChord => {
      const chordRoot = scaleChord.note.replace('m', '').replace('°', '');
      return this.noteEquals(chordRoot, keyRoot);
    });
  }

  noteEquals(note1, note2) {
    const cleanNote1 = note1.replace('#', '').replace('b', '');
    const cleanNote2 = note2.replace('#', '').replace('b', '');
    return cleanNote1 === cleanNote2 ||
      note1 === note2 + '#' ||
      note1 === note2 + 'b' ||
      note2 === note1 + '#' ||
      note2 === note1 + 'b' ||
      (note1 === 'F#' && note2 === 'Gb') ||
      (note1 === 'Gb' && note2 === 'F#');
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const dx = x - this.centerX;
    const dy = y - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= this.middleRadius && distance <= this.outerRadius) {
      // Calcular ángulo y ajustar para que 0° sea arriba
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle = (angle + 90 + 360) % 360;
      const segment = Math.floor(angle / 30);

      if (distance <= this.innerRadius) {
        // Círculo interno (menores)
        this.selectedKey = this.minorKeys[segment];
      } else {
        // Círculo externo (mayores)
        this.selectedKey = this.majorKeys[segment];
      }

      this.draw();
      this.updateInfoPanel();
    } else if (distance < this.middleRadius) {
      // Click en el centro - resetear selección
      this.selectedKey = null;
      this.draw();
      this.updateInfoPanel();
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const dx = x - this.centerX;
    const dy = y - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= this.middleRadius && distance <= this.outerRadius) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  updateInfoPanel() {
    const selectedKeyEl = document.getElementById('selectedKey');
    const scaleNotesEl = document.getElementById('scaleNotes');

    if (this.selectedKey) {
      selectedKeyEl.textContent = `Tonalidad seleccionada: ${this.selectedKey}`;
      const selectedScale = this.scaleData.find(scale => scale.key === this.selectedKey);
      if (selectedScale) {
        scaleNotesEl.innerHTML = `
                    <strong>Acordes de la escala:</strong><br>
                    ${selectedScale.values.map(chord => `${chord.position}: ${chord.note}`).join(' - ')}
                `;
      }
    } else {
      selectedKeyEl.textContent = 'Selecciona una tonalidad';
      scaleNotesEl.textContent = 'Haz clic en cualquier segmento del círculo para ver su escala';
    }
  }
}

console.log("hola")
// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  new CircleOfFifths('circleCanvas');
});