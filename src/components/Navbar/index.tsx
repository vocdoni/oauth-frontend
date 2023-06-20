import {
  Box,
  Flex,
  Image,
  Button,
  List,
  useDisclosure,
  useOutsideClick,
  ListItem,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FaGlobeAmericas } from 'react-icons/fa'
import { useRef } from 'react'
import { Account } from '../../components/Account'
import { useTranslation } from 'react-i18next'
import { LanguagesSlice } from '../../i18n/languages.mjs'
import { useAccount } from 'wagmi'
import { NavLink } from 'react-router-dom'
import vocdoni_logo from '../../assets/vocdoni_logo.svg'

const Navbar = ({ ...props }) => {
  const { onClose } = useDisclosure()
  const { i18n, t } = useTranslation()
  const { isConnected } = useAccount()

  const languages = LanguagesSlice as { [key: string]: string }

  const refNav = useRef<HTMLDivElement>(null)

  useOutsideClick({
    ref: refNav,
    handler: () => onClose(),
  })

  return (
    <Box as='nav' ref={refNav} {...props}>
      <Flex justify={'space-between'}>
        <a href='/' aria-current='page' aria-label='home'>
          <Image src={vocdoni_logo} alt='logo' h={10} />
        </a>

        <List display={{ base: 'none', lg: 'flex' }} alignItems='center' gap={4}>
          {isConnected && (
            <ListItem listStyleType='none' onClick={onClose} whiteSpace='nowrap'>
              <NavLink to='/processes/create'>
                <Button colorScheme='buttons.primary'>{t('menu.create_process')}</Button>
              </NavLink>
            </ListItem>
          )}
          <ListItem listStyleType='none' display='flex' cursor='pointer'>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <FaGlobeAmericas />
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type='radio' defaultValue={i18n.language}>
                  {Object.keys(languages).map((k) => (
                    <MenuItemOption
                      value={k}
                      key={k}
                      onClick={() => {
                        if (window && 'localStorage' in window) {
                          window.localStorage.setItem('vocdoni.lang', k)
                        }
                        i18n.changeLanguage(k)
                      }}
                    >
                      {languages[k]}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </ListItem>
          <ListItem listStyleType='none'>
            <Account />
          </ListItem>
        </List>
      </Flex>
    </Box>
  )
}

export default Navbar
