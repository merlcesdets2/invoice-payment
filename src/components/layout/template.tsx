import { AppShell, Title, Container } from '@mantine/core';
import { NavbarNested } from './sidebar'

type Props = {
    title: string
    hideNav?: boolean
    children: React.ReactNode,
  };

export const AplicationContainer = ({title, hideNav, children}: Props) => {
    return (
        <AppShell
        padding="md"
        navbar={hideNav ? <nav/> : <NavbarNested/>}
        styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
        >
        <Title order={1} style={{ marginBottom: '3%' }}>{title}</Title>
        <Container style={{ marginLeft: 0, background: 'white', padding: '2%'}}>
            {children}
        </Container>
        </AppShell>
    );
}