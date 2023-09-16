import { OrganizationProvider, useClient } from '@vocdoni/react-providers'
import ProcessList from '../Process/List'

const OrganizationView = () => {
  const { account } = useClient()

  return (
    <OrganizationProvider id={account?.address}>
      <ProcessList />
    </OrganizationProvider>
  )
}

export default OrganizationView
