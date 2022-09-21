import { createStyles, Text, Container } from '@mantine/core';


const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: theme.colors[theme.primaryColor],
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },


}));



export const Footer =() => {
  const { classes } = useStyles();

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
      <Container >
        <Text color="dimmed" size="sm">
          Copyright © 2022 ,Triple T Broadband Co.,Ltd.
        </Text>
      </Container>
      </div>
    </footer>
  );
}