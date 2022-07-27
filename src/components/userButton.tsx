import React  from 'react';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
  Menu,
} from '@mantine/core';
// import Link from 'next/link';
import { ChevronDown,Logout } from 'tabler-icons-react';
import { signOut } from "next-auth/react"
const useStyles = createStyles((theme) => ({
  user: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
    display: 'block',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    },
  },
}));

interface UserButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export function UserButton({ image, name, email, icon }: UserButtonProps) {
  const { classes } = useStyles();
  const ChevronIcon = ChevronDown;
  return (
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
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
        {icon || <ChevronIcon size={14} />}
      </Group>
      </UnstyledButton>
    </Menu.Target>
      <Menu.Dropdown> 
      <Menu.Item onClick={() => signOut()}  icon={<Logout size={14} />}>Sign out</Menu.Item>
      </Menu.Dropdown>
     </Menu>
  );
}