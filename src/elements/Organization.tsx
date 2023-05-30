import { useAccountHealthTools } from '../components/Account/use-account-health-tools'
import { AccountCreate } from '../components/Account/Create'
import { Alert, AlertIcon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import OrganizationView from '../components/Organization/View'

const Organization = () => {
  const { t } = useTranslation()

  const { exists, existsVariation } = useAccountHealthTools()

  const Content = existsVariation(OrganizationView, AccountCreate)

  return (
    <>
      {!exists && (
        <>
          <Alert variant='subtle' status='error'>
            <AlertIcon />
            {t('form.process_create.unhealthy_account')}
          </Alert>
          <AccountCreate />
        </>
      )}

      <Content />
    </>
  )
}

export default Organization
