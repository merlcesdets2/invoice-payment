import { AppShell,
  Title,
  Container,
} from '@mantine/core';
import {Headbar} from './headbar'

type Props = {
    title?: string
    children: React.ReactNode,
  };

export const AplicationContainer = ({title, children}: Props) => {

    return (
        <AppShell
        padding="md"
        styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
        navbarOffsetBreakpoint="sm"
        fixed
        header={<Headbar/>}
        >
        <Title order={1} style={{marginLeft: 2, marginBottom: '1%' }}>{title}</Title>
        <Container style={{ marginLeft: 2, background: 'white', padding: '2%',maxWidth:'1090px'}}>
            {children}
        </Container>
        </AppShell>
    );
}