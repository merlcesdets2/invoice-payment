import { Group, Button, Grid, TextInput,Text,Select,Modal} from '@mantine/core'
import { AplicationContainer }  from '../../components/layout/template'
import { useModals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { useState } from 'react'
import { AppConfig } from '../../AppConfig'
import { InferGetStaticPropsType } from 'next'


const { apiCustomer, apiUtil } = AppConfig

interface payloadProp {
  customerCode: string;
  customerName: string;
  creditLimit: string;
  tel: string;
  addressLine: string;
  tambolId: string;
  amphurId: string;
  provinceId: string
}

interface provinceProp {
  provinceId: string;
  provinceName: string
}

export async function getStaticPaths() {
  const paths = [{ params: {action: 'add'} }, { params: {action: 'edit'} }]
  return { paths, fallback: false }
}

export async function getStaticProps() {

  const res = await fetch(`${apiUtil}/util/service/province`, { 
    method: 'get', 
    headers: { 'accessToken': 'invoiceToken'}
  })
  const result = await res.json()
  const provinces = result.data.map((province:provinceProp) => {
    return {
      value: province.provinceId,
      label: province.provinceName
    }
  })
  console.log(provinces)
  return { props: { provinces } }
}

const ActionCustomer = ({provinces}:InferGetStaticPropsType<typeof getStaticProps>) => {
    const modals = useModals();
    const [opened, setOpened] = useState(false);
    const payload:payloadProp = {
      customerCode: '',
      customerName: '',
      creditLimit: '',
      tel: '',
      addressLine: '',
      tambolId: '',
      amphurId: '',
      provinceId: ''
    }
    const form = useForm({
      initialValues: payload,
    })

    const [amphurValue, setAmphurValue] = useState([])
    const [tambolValue, setTambolValue] = useState([])

    const submit = (value:payloadProp) => {
      console.log(value)
      modals.openConfirmModal({
        transition:'fade',
        title: 'Please confirm your create Customer',
        centered: true,
        radius: 10,
        overlayBlur: 1,
        closeOnClickOutside: false,
        children: (
          <Text size="md">
            Do you want to Crate Customer ?
          </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'blue' },
        onCancel: () => console.log('Cancel'),
        onConfirm: async () => {
          const res = await fetch(`${apiCustomer}/customer/service/customer`, { 
            method: 'post',
            headers: { 
              'accessToken': 'invoiceToken',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
          })
          console.log(res)
        },
      });
    }

    return (
        <AplicationContainer title='Create Customer' >
          <Group  position='left' mt='md' m='xs' style={{marginBottom:'30px',borderBottom:'1px solid gray',height:'60px'}}>
            <Text style={{marginLeft: 2,fontWeight:'bold',fontSize:'20px'}}>Customer</Text>
          </Group>
            <form onSubmit={form.onSubmit((values) => submit(values))}>
              <Grid mb="xl" gutter="sm">
                <Grid.Col xs={6} md={6}>
                    <TextInput 
                      label="Customer Code:" 
                      radius="md" 
                      size="md" 
                      required {...form.getInputProps('customerCode')}/>
                </Grid.Col>             
                <Grid.Col xs={6} md={6}>
                    <TextInput 
                      label="Credit limit:" 
                      radius="md" 
                      size="md" 
                      required {...form.getInputProps('creditLimit')}/>
                </Grid.Col>
                <Grid.Col xs={12} md={12}>
                    <TextInput 
                      label="Name:" 
                      radius="md" 
                      size="md" 
                      required 
                      {...form.getInputProps('customerName')}/>
                </Grid.Col>
                <Grid.Col xs={12} md={12}>
                    <TextInput 
                      label="Address:" 
                      radius="md" 
                      size="md" 
                      required 
                      {...form.getInputProps('addressLine')}/>
                </Grid.Col>
                <Grid.Col xs={6} md={6}>
                    <TextInput 
                      label="Telephone:" 
                      radius="md" 
                      size="md" 
                      required 
                      {...form.getInputProps('tel')}/>
                </Grid.Col>   
                <Grid.Col xs={6} md={6}>
                    <Select 
                      label="Province:" 
                      radius="md" 
                      size="md" 
                      required 
                      data={provinces}
                      {...form.getInputProps('provinceId')}
                      onChange={async e => {
                        if(e) { 
                          form.setFieldValue('provinceId', e)
                          const res = await fetch(`${apiUtil}/util/service/amphur?provinceId=${e}`, { 
                            method: 'get', 
                            headers: { 'accessToken': 'invoiceToken'}
                          })
                          const result = await res.json()
                          const amphurs = result.data.map((amphur: {amphurId: string, amphurName: string}) => {
                            return {
                              value: amphur.amphurId,
                              label: amphur.amphurName
                            }
                          })
                          form.setFieldValue('amphurId', '')
                          setAmphurValue(amphurs)
                        }
                      }}
                      searchable
                      />
                </Grid.Col>
                <Grid.Col xs={6} md={6}>
                    <Select 
                      label="District:" 
                      radius="md" 
                      size="md" 
                      required 
                      data={amphurValue} 
                      searchable 
                      {...form.getInputProps('amphurId')}
                      onChange={async e => {
                        if(e) { 
                          console.log(form.values.provinceId, e)
                          form.setFieldValue('amphurId', e)
                          const res = await fetch(`${apiUtil}/util/service/tambol?provinceId=${form.values.provinceId}&amphurId=${e}`, { 
                            method: 'get', 
                            headers: { 'accessToken': 'invoiceToken'}
                          })
                          const result = await res.json()
                          const tambols = result.data.map((tambol: {tambolId: string, tambolName: string}) => {
                            return {
                              value: tambol.tambolId,
                              label: tambol.tambolName
                            }
                          })
                          form.setFieldValue('tambolId', '')
                          setTambolValue(tambols)
                        }
                      }}
                      />
                </Grid.Col>
                <Grid.Col xs={6} md={6}>
                    <Select 
                      label="Sub-District:" 
                      radius="md" 
                      size="md" 
                      required 
                      data={tambolValue}
                      searchable 
                      {...form.getInputProps('tambolId')}/>
                </Grid.Col>
                <Grid.Col offset={6} sm={6} md={6}>
                <Modal centered 
                  transitionDuration={600}
                  closeOnEscape
                  closeOnClickOutside={false}
                  withCloseButton={false}
                  opened={opened}
                  onClose={() => setOpened(false)}
                >
                  <Text style={{marginBottom:'20px'}}>Success To Create </Text>
                  <Group position="center">
                    <Button color="blue" onClick={() => setOpened(false)}>Close</Button>
                  </Group>
                </Modal>
                </Grid.Col>
              </Grid>
              <Group  position='right' >
                <Button type='submit'style={{marginRight:'10px'}}>Save</Button>
              </Group>
            </form>
        </AplicationContainer>
    )
}

export default ActionCustomer