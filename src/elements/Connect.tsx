import { Card, CardBody, Flex, Grid, GridItem } from '@chakra-ui/react'
import { Account } from '../components/Account'

const Connect = () => {
  return (
    <Flex direction='column' gap={4}>
      <Grid gap={4}>
        <GridItem display='flex' justifyContent='center' alignItems='center'>
          <Card variant='process-description'>
            <CardBody>
              <Account />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Connect
