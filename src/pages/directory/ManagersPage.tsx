import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import DirectoryPage from '../../components/directory/DirectoryPage'

// /managers -> jo bhi manager / agent account banaye, yahan dikhta hai
function ManagersPage() {
  return <DirectoryPage kind="managers" icon={faUserTie} />
}

export default ManagersPage
