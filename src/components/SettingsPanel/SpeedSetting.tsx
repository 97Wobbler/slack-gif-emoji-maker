interface SpeedSettingProps {
  speed: number
  setSpeed: (v: number) => void
}

export function SpeedSetting({ speed, setSpeed }: SpeedSettingProps) {
  return (
    <div>
      <label htmlFor="speed" className="block text-sm font-medium mb-2">
        이동 속도: {speed}px/sec
      </label>
      <input
        type="range"
        id="speed"
        min="20"
        max="200"
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
} 