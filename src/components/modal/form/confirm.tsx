import { Modal, ModalProps, Text, Button, Group, createStyles  } from '@mantine/core';
import { useRouter } from 'next/router'

interface CfModalProps extends ModalProps {
    context: {
        title: string
        body: string
        btn1: BtnProp & {cb: () => void}
        btn2?: BtnProp
        btn3: BtnProp
    }
    pageRefer: string
}

interface BtnProp {
    label: string,
}

const useStyles = createStyles(() => ({
    bottom: {
        marginTop: '20px',
        padding: '15px',
        paddingBottom: 0,
        borderColor: 'black',
        borderTop: '2px solid #ccc',
        'button:first-of-type': {
            backgroundColor: '#2B8A3E'
        }
    },
  }))

export function ConfirmModal({context, pageRefer, ...prop}: CfModalProps) {
    const router = useRouter()
    const { classes } = useStyles();

    const handleBtn = async ({btnCb = () => {''}}) => {
        btnCb()
        router.push(pageRefer)
    }
    const hasBtn2 = context.btn2

    return (
        <>
        <Modal
            transition="fade"
            title={context.title}
            centered
            radius={10}
            overlayBlur={1}
            {...prop}
        >
            <Text size="md">
                {context.body}
            </Text>
            <div className={classes.bottom}>
                <Group position="right">
                    <Button onClick={() => handleBtn({btnCb: context.btn1.cb})}>{context.btn1.label}</Button>
                    {hasBtn2 && <Button color={'yellow'} onClick={() => handleBtn({})}>Don&apos;t Save</Button>}
                    <Button variant="default" onClick={() => prop.onClose()}>Cancel</Button>
                </Group>
            </div>
        </Modal>
        </>
    );
}