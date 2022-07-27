import { Group, Button, Grid, TextInput, Text, Modal } from '@mantine/core'
import { AplicationContainer } from '../../components/layout/template'
import { useModals } from '@mantine/modals'
import { useState } from 'react'

const Product = () => {
  const modals = useModals()
  const [opened, setOpened] = useState(false)
  const senddata = () => {
    setOpened(true)
  }

  const submit = (e: React.FormEvent) => {
    modals.openConfirmModal({
      transition: 'fade',
      title: 'Please confirm your create Product',
      centered: true,
      radius: 10,
      overlayBlur: 1,
      closeOnClickOutside: false,
      children: <Text size="md">Do you want to Create Product ?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'blue' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => senddata(),
    })
    e.preventDefault()
  }
  return (
    <AplicationContainer title="Create Product">
      <Group
        position="left"
        mt="md"
        m="xs"
        style={{
          marginBottom: '30px',
          borderBottom: '1px solid gray',
          height: '60px',
        }}
      >
        <Text style={{ marginLeft: 2, fontWeight: 'bold', fontSize: '20px' }}>
          Products
        </Text>
      </Group>
      <form onSubmit={submit}>
        <Grid mb="xl" gutter="sm">
          <Grid.Col xs={6} md={6}>
            <TextInput label="Product Code :" radius="md" size="md" required />
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <TextInput label="Product Name :" radius="md" size="md" required />
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <TextInput label="Unit Price :" radius="md" size="md" required />
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <TextInput label="Units :" radius="md" size="md" required />
          </Grid.Col>
          <Grid.Col offset={6} sm={6} md={6}>
            <Modal
              centered
              transitionDuration={600}
              closeOnEscape
              closeOnClickOutside={false}
              withCloseButton={false}
              opened={opened}
              onClose={() => setOpened(false)}
            >
              <Text style={{ marginBottom: '20px' }}>Success To Create </Text>
              <Group position="center">
                <Button color="blue" onClick={() => setOpened(false)}>
                  Close
                </Button>
              </Group>
            </Modal>
          </Grid.Col>
        </Grid>
        <Group position="right">
          <Button type="submit" style={{ marginRight: '10px' }}>
            Save
          </Button>
        </Group>
      </form>
    </AplicationContainer>
  )
}
export default Product
