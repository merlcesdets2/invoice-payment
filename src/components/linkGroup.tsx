import React, { useState } from 'react';
import { Group, Box, Collapse, Text, UnstyledButton, createStyles } from '@mantine/core';
import { TablerIcon, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0] ,
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.black,
  },

  links: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 50,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
  chevron: {
    color: 'black',
    transition: 'transform 200ms ease',
    float:'right',
  },
  mainLinkActive: {
    color: '#f58621',
  },
}));

interface LinksGroupProps {
  icon: TablerIcon;
  label: string;
  hasChild?: boolean;
  links?: { label: string; link: string }[] | string;
  setpage: (opened: boolean) => void;
}



export function LinksGroup({ icon:Icon, label, links, setpage }: LinksGroupProps) {
  const { classes, cx, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const router = useRouter()
  const currentPath = router.asPath
  const menuMatch = Array.isArray(links) ? links.map(l => l.link) : links
  const active = Array.isArray(menuMatch) ? menuMatch.includes(currentPath) : menuMatch === currentPath

  const items = (hasLinks ? links : []).map((link) => (
    <Link href={link.link} key={link.label}>
      <Text<'a'>
        component="a"
        onClick={()=>setpage(false)} 
        className={classes.links}
        href={link.link}
      >
        {link.label}
      </Text>
    </Link>
  ))

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center'}}style={{width:'100%'}}className={cx(classes.link, { [classes.mainLinkActive]: active})}>
              <Icon size={25} />
              {hasLinks ? <Box style={{width:'100%',textAlign:'left'}} ml="md">{label}
              <ChevronIcon
              className={classes.chevron}
              size={14}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
              </Box>
                : links ? <Link href={links} >
                <Text onClick={()=>setpage(false)} style={{width:'100%',textAlign:'left'}} ml="md" component="a" className={cx(classes.link, { [classes.mainLinkActive]: active})} >{label}</Text>
              </Link>  : ''
              }
          </Box>
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
