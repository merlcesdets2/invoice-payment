import React from 'react';
import { Navbar, ScrollArea, createStyles, Menu, UnstyledButton, Group, Avatar,Text} from '@mantine/core';
import { LinksGroup } from '../linkGroup';
import { useSession } from "next-auth/react"
import { IconChevronUp, IconLogout } from '@tabler/icons';
import { signOut } from "next-auth/react"
import { menulist } from './menubar'


const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },
  
  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  user: {
    display: 'block',
    padding: theme.spacing.md,
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    },
  },
}));

interface NavbarProp {
  setopen: (opened: boolean) => void;
}
export const NavbarNested = ({setopen }: NavbarProp) => {
  const { classes } = useStyles();
  const links = menulist.map((item) => <LinksGroup  {...item} key={item.label} setpage={setopen}/>);
  const { data: session } = useSession()
  const ChevronIcon = IconChevronUp;
  const profile = session?.user
  const email = profile ? profile.email : 'tbb@tbb.com'
  const fullname = profile ? profile.fullname : 'firstname lastname'
  const image = profile?.image
    return (
    <Navbar width={{ md: '1050px' }} p="md" className={classes.navbar} hidden={!setopen}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div >{links}</div>
      </Navbar.Section>
      <Navbar.Section  >
      <Menu            
    width={235}
    position="bottom-end"
    transition="pop-top-right"
    >
    <Menu.Target>
    <UnstyledButton 
       className={classes.user} >
      <Group >
        <Avatar src={image} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {fullname}
          </Text>
          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
        <ChevronIcon size={14} />
      </Group>
      </UnstyledButton>
    </Menu.Target>
      <Menu.Dropdown> 
      <Menu.Item onClick={() => signOut()}  icon={<IconLogout size={14} />}>Sign out</Menu.Item>
      </Menu.Dropdown>
     </Menu>
      </Navbar.Section>
    </Navbar>
  );
}
