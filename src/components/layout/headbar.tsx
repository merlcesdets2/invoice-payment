import { createStyles, Header, Menu, Group, Center, Burger, Box, Code,Text} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDown } from 'tabler-icons-react';
import { UserButton } from '../userButton';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  inner: {
    height: 65,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));


interface menulistProp {
  label: string;
  initiallyOpened?: boolean;
  links: LinksProp[] | string; 
}

interface LinksProp {
  label: string;
  link: string 
}

const menulist: menulistProp[] = [
  { label: 'List Invoice', links: '/invoice'},
  { label: 'List Customer',links: '/customer'},
  {
    label: 'Create',
    initiallyOpened: true,
    links: [
      { label: 'Create Invoice', link: '/invoice/add' },
      { label: 'Create Customer', link: '/customer/add' },
      { label: 'Create Products', link: '/product/add' },
    ],
  },
];

export const Headbar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: session } = useSession()

  const profile = session?.user
  const email = profile ? profile.email : 'tbb@tbb.com'
  const fullname = profile ? profile.fullname : 'firstname lastname'
  const image = profile?.image

  const items = menulist.map((obj) => {
    const menuItems =(Array.isArray(obj.links) ? obj.links : []).map((item: LinksProp) => (
      <Menu.Item key={item.link} >
        <Link href={item.link} key={item.label}>
            <a
              href={item.link}
              className={classes.link}
              onClick={toggle}
            >
              <Center>
                <span className={classes.linkLabel}>{item.label}</span>
              </Center>
            </a>
        </Link>
      </Menu.Item>
    ));
    if (menuItems.length>0) {
      return (
        <Menu key={obj.label} trigger="hover" exitTransitionDuration={0}>
          <Menu.Target>
            <a
              className={classes.link}
            >
              <Center>
                <span className={classes.linkLabel}>{obj.label}</span>
                <ChevronDown size={12} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    else{
      return (
      <Link href={(Array.isArray(obj.links)) ? '' : obj.links } key={obj.label}>
          <span className={classes.link}>
            {obj.label}
          </span>
      </Link>  
    );
    }
  });
    return (
      <Header height={65} mb={120} className={classes.header}>
      <div className={classes.inner}>
      <Group position="apart" >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Text>Invoice Payment</Text>
          </Box>
          <Code sx={{ fontWeight: 700 }} ml='lg'>v.1.0.0</Code>
      </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
          <UserButton  
            image={image ? image : ''}
            name={fullname}
            email={email}
          />
        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
      </div>
  </Header>
    );
}

