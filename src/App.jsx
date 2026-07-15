import { useState } from 'react'
import ProfilePicker from './components/ProfilePicker.jsx'
import Session from './components/Session.jsx'
import Summary from './components/Summary.jsx'
import Collection from './components/Collection.jsx'
import ParentArea from './components/ParentArea.jsx'

export default function App() {
  const [screen, setScreen] = useState('profiles')
  const [profile, setProfile] = useState(null)
  const [summary, setSummary] = useState(null)

  switch (screen) {
    case 'session':
      return (
        <Session
          key={profile.id}
          profile={profile}
          onDone={(s) => {
            setSummary(s)
            setScreen('summary')
          }}
        />
      )
    case 'summary':
      return (
        <Summary
          profile={profile}
          summary={summary}
          onCollection={() => setScreen('collection')}
          onHome={() => setScreen('profiles')}
        />
      )
    case 'collection':
      return <Collection profile={profile} onBack={() => setScreen('profiles')} />
    case 'parent':
      return <ParentArea onBack={() => setScreen('profiles')} />
    default:
      return (
        <ProfilePicker
          onPick={(p) => {
            setProfile(p)
            setScreen('session')
          }}
          onParent={() => setScreen('parent')}
        />
      )
  }
}
