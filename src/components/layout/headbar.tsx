import { createStyles, Header, Menu, Group, Burger, Box, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image'
import { useState } from 'react';
import logo from "@/public/assets/images/3bblogo.png"

import { UserButton } from '../userButton';
import { NavbarNested } from './sidebar'
import { menulist } from './menubar'
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';



const useStyles = createStyles((theme) => ({

  header: {
    backgroundColor: theme.colors[theme.primaryColor],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none'
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    backgroundColor: 'transparent',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: 'white' ,
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][6],
    },
  },
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.white,
    height: '500px'
  },
  mainLinkActive: {
    color: '#f58621',
  },

}));


export const Headbar = () => {
  
  const [opened,setOpened] = useState(false);
  const { classes,cx } = useStyles();
  const { data: session } = useSession()
  const profile = session?.user
  const email = profile ? profile.email : 'tbb@tbb.com'
  const fullname = profile ? profile.fullname : 'firstname lastname'
  const image = profile?.image
  
  const router = useRouter()
  const currentPath = router.asPath
  const handleChange = (opened: boolean) => {
    setOpened(opened);
  }

  const largeScreen = useMediaQuery('(min-width: 1080px)');
  
  const items = menulist.map((menu) => {
    const menuMatch = Array.isArray(menu.links) ? menu.links.map(l => l.link) : menu.links
    const active = Array.isArray(menuMatch) ? menuMatch.includes(currentPath) : menuMatch === currentPath
    const menuLabel = (
      <div className={cx(classes.link, { [classes.mainLinkActive]: active })} >
        <Group sx={{gap: 3}}>
          <menu.icon size={20}/>
          {menu.label}
          {menu.hasChild && <IconChevronDown size={12} />}
        </Group>
      </div>
    )

    if (menu.hasChild) {
      const menuItems = (Array.isArray(menu.links) ? menu.links : []).map((item) => {
        const activeChild = item.link === currentPath
        return <Link href={item.link} key={item.label} >
                <Menu.Item key={item.link} style={{height:50}}>
                  <Text component='a' weight={600} color={activeChild ? 'orange' : 'black'}>
                    {item.label}
                  </Text>
                </Menu.Item>
              </Link>
      })
      return (
        <Menu key={menu.label} trigger="hover" exitTransitionDuration={0}>
          <Menu.Target>
            {menuLabel}
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    return (
      <Link href={(Array.isArray(menu.links)) ? '' : menu.links} key={menu.label}>
        {menuLabel}
      </Link>
    )
  })

  return (
    <Header height={75} mb={120} className={classes.header}>
    <Group position="apart" style={{height: '75px'}}>
      <Group position="apart">
          <Box>
              <Image src={logo} alt="logo" width={115} height={50}/>
          </Box>
          <Text weight={700} color={'white'}>INVOICE</Text>
      </Group>
      <Group spacing={5} className={classes.links}>
        {items}
      </Group>
      {largeScreen ? <UserButton image={image ? image : ''} name={fullname} email={email}/> 
      : <Burger opened={opened} onClick={()=>setOpened(!opened)} color='white' size="sm" style={{height:'auto'}}/>}
    </Group>
    { opened && <NavbarNested  setopen={handleChange} /> }
  </Header>
  );
}

