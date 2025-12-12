import Header from './Header'
import { getUser } from '@/app/actions/auth'

export default async function HeaderServer({ onCartClick }: { onCartClick: () => void }) {
  const user = await getUser()
  const validUser = user && user.email && user.id ? { id: user.id, email: user.email } : null

  return <Header user={validUser} onCartClick={onCartClick} />
}