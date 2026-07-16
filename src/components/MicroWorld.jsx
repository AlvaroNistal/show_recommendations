import Balanza from './worlds/Balanza.jsx'
import Robot from './worlds/Robot.jsx'
import Estanque from './worlds/Estanque.jsx'

export default function MicroWorld({ exercise, audioOn, onComplete }) {
  const props = { config: exercise.worldConfig, audioOn, onComplete }

  switch (exercise.worldType) {
    case 'balanza':  return <Balanza  {...props} />
    case 'robot':    return <Robot    {...props} />
    case 'estanque': return <Estanque {...props} />
    default:         return null
  }
}
