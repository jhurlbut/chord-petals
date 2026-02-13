# Magenta.js Integration Notes for ChordPetals

## Research Date: 2026-02-13

## Key Findings

### API Usage (from official demos)

**MusicRNN (ImprovRNN)** — `chord_pitches_improv` checkpoint:
- Seed: Create an **unquantized** NoteSequence, then quantize with `mm.sequences.quantizeNoteSequence(ns, 4)` (4 steps per quarter)
- Call: `rnn.continueSequence(quantizedSeed, numSteps, temperature, chordProgression)`
- `chordProgression` is an array of chord symbol strings, one per bar (or repeated)
- Demo uses: `['Cm']` for a single chord

**MusicVAE** — `mel_chords` checkpoint:
- Can sample without a seed: `mvae.sample(4, null, {chordProgression: ['C']})`
- Can interpolate with chords: `mvae.interpolate(inputs, 5, null, {chordProgression: ['A','A','D','A']})`
- 17.6MB checkpoint, good alternative

### Correct NoteSequence Format

The demo creates unquantized sequences then quantizes:
```js
const seed = {
  ticksPerQuarter: 220,
  totalTime: 1.5,
  timeSignatures: [{time: 0, numerator: 4, denominator: 4}],
  tempos: [{time: 0, qpm: 120}],
  notes: [
    {instrument: 0, program: 0, startTime: 0, endTime: 0.5, pitch: 60, velocity: 100, isDrum: false},
    // ...
  ]
};
const quantized = mm.sequences.quantizeNoteSequence(seed, 4);
```

### Chord Symbol Format

Magenta uses standard chord symbols. The `PitchChordEncoder` parses:
- `C`, `Cm`, `C7`, `Cmaj7`, `Cm7`, `Cdim`, `Caug`, `Cm7b5`
- Root notes with flats: `Db`, `Eb`, `Ab`, `Bb` (matches our `noteName(idx, true)`)

### Bugs Found in Current Integration

1. **`maj7:'M'`** — Maps to just 'M' suffix (e.g., "CM") which is ambiguous. Should be `'maj7'` → "Cmaj7"
2. **`min7:'m'`** — Maps to just 'm' suffix (e.g., "Cm") which is minor triad, NOT minor 7th. Should be `'m7'` → "Cm7"
3. **Seed sequence format** — Uses pre-quantized format with `stepsPerQuarter:1` (1 step = 1 quarter). The model expects `stepsPerQuarter:4` (standard). Should create unquantized seed and use `mm.sequences.quantizeNoteSequence()`.
4. **`totalQuantizedSteps` calculation** — `Math.min(4, notes.length)` uses interval count (3-4) not step count. With stepsPerQuarter=4 and 4 quarter notes, should be 16.
5. **Chord progression array** — `Array(Math.ceil(stepsToGen/4)).fill(chordSym)` creates one chord per 4 steps. For ImprovRNN, the chord prog needs one chord per bar. With stepsPerQuarter=4 and 4/4 time, one bar = 16 steps. So for 32 steps (2 bars), need 2 chords.

### Recommended Checkpoint

**`chord_pitches_improv`** (MusicRNN) — 5.6MB, fast inference, designed exactly for this use case. Keep current choice.

### Fixes Applied

1. Fixed chord symbol suffix map (maj7, min7)
2. Rewrote seed sequence to use unquantized format + `mm.sequences.quantizeNoteSequence()`
3. Fixed chord progression array sizing (one per bar = per 16 steps)
