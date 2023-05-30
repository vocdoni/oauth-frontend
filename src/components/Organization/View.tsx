import { OrganizationProvider, useClient } from '@vocdoni/chakra-components'
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
