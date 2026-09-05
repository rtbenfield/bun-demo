import { clientEntry, css, on, type Handle, type SerializableProps } from 'remix/ui'

interface SliderProps extends SerializableProps {
  label: string
  name: string
  min: number
  max: number
  step: number
  value: number
  suffix?: string
}

// Hydrated so the label reflects the slider position while dragging. The
// server value is the source of truth across form submissions; the local
// value only tracks the drag in between.
export const Slider = clientEntry(
  import.meta.url,
  function Slider(handle: Handle<SliderProps>) {
    let value = handle.props.value
    let serverValue = handle.props.value

    return () => {
      if (handle.props.value !== serverValue) {
        serverValue = handle.props.value
        value = handle.props.value
      }

      return (
        <label mix={sliderLabelStyle}>
          {handle.props.label} {value}
          {handle.props.suffix ?? ''}
          <input
            type="range"
            name={handle.props.name}
            min={handle.props.min}
            max={handle.props.max}
            step={handle.props.step}
            value={value}
            mix={[rangeStyle, on('input', (event) => {
              value = Number((event.target as HTMLInputElement).value)
              handle.update()
            })]}
          />
        </label>
      )
    }
  },
)

const sliderLabelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontWeight: 700,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  '& input': { accentColor: 'var(--brand-blue)' },
})

const rangeStyle = css({
  width: '100%',
  cursor: 'pointer',
  '&:focus-visible': { outline: 'none', filter: 'drop-shadow(0 0 3px var(--brand-blue))' },
})
