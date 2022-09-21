import React  from 'react';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
  Menu,
} from '@mantine/core';
import { IconChevronDown, IconLogout } from '@tabler/icons';
import { signOut } from "next-auth/react"


const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    padding: theme.spacing.md,
    height:'100%',
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
  const ChevronIcon = IconChevronDown;
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
        <Avatar src={image} sx={() => ({
          '@media (max-width: 1090px)': {
            display: 'none',
          }
          })}/>
        <div style={{ flex: 1 }}>
          <Text size="sm" color='white' weight={500}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
        {icon || <ChevronIcon color='white' size={14} />}
      </Group>
      </UnstyledButton>
    </Menu.Target>
      <Menu.Dropdown> 
      <Menu.Item onClick={() => signOut()}  icon={<IconLogout size={14} />}>Sign out</Menu.Item>
      </Menu.Dropdown>
     </Menu>
  );
}