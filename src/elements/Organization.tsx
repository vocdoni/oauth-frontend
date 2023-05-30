import { OrganizationProvider, useClient } from '@vocdoni/chakra-components'
import ProcessList from '../components/Process/List'

const Organization = () => {
  const { account } = useClient()

  return (
    <>
      {account?.address && (
        <OrganizationProvider id={account?.address}>
          <ProcessList />
        </OrganizationProvider>
      )}
    </>
  )
}

export default Organization
