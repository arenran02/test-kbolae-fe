import ProfileForm from '../components/ProfileForm'
import Card from '../components/ui/card'

export default function Profile() {
  return (
    <div className="container">
      <h1 style={{ marginBottom: 12 }}>내 프로필</h1>
      <Card><ProfileForm /></Card>
    </div>
  )
}
