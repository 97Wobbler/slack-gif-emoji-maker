interface SpeedSettingProps {
  speed: number
  setSpeed: (v: number) => void
}

export function SpeedSetting({ speed, setSpeed }: SpeedSettingProps) {
  return (
    <div>
      <label htmlFor="speed" className="block text-sm font-medium mb-2">
        이동 속도
      </label>
      <input
        type="range"
        id="speed"
        min="100"
        max="300"
        step="25"
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
} 