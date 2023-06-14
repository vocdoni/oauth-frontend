import { Card, CardBody, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { Account } from '../components/Account'
import { useTranslation } from 'react-i18next'

const Connect = () => {
  const { t } = useTranslation()

  return (
    <Flex direction='column' gap={4}>
      <Grid gap={4}>
        <GridItem display='flex' justifyContent='center' alignItems='center'>
          <Card variant='process-description'>
            <CardBody>
              <Text variant='h2' mb={10}>
                {t('Please, connect your wallet')}
              </Text>
              <Account />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Connect
