import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import DirectoryPage from '../../components/directory/DirectoryPage'

// /businesses -> jo bhi business account banaye, yahan dikhta hai
function BusinessesPage() {
  return <DirectoryPage kind="businesses" icon={faBuilding} />
}

export default BusinessesPage
