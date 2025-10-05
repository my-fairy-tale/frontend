'use client';

import { useState } from 'react';

const VOICE_MODELS = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
  { id: 'ash', name: 'Ash' },
  { id: 'ballad', name: 'Ballad' },
  { id: 'coral', name: 'Coral' },
  { id: 'sage', name: 'Sage' },
  { id: 'verse', name: 'Verse' },
];

export default function ChoosePreferenceVoice() {
  const [selectedVoice, setSelectedVoice] = useState(VOICE_MODELS[0].id);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
    // TODO: Save to backend/database
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Voice Preference</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="voice-select" className="text-sm font-medium">
          Voice Model
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={handleVoiceChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {VOICE_MODELS.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
