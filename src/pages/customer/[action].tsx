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

export async function getStaticPaths() {
  const paths = [{ params: {action: 'add'} }, { params: {action: 'edit'} }]
  return { paths, fallback: false }
}

export async function getStaticProps() {

  const result = [                                                        
    { value: '10', label: 'จ.กรุงเทพมหานคร' },             
    { value: '11', label: 'จ.สมุทรปราการ' },               
    { value: '12', label: 'จ.นนทบุรี' },                   
    { value: '13', label: 'จ.ปทุมธานี' },                  
    { value: '14', label: 'จ.พระนครศรีอยุธยา' },           
    { value: '15', label: 'จ.อ่างทอง' },                   
    { value: '16', label: 'จ.ลพบุรี' },                    
    { value: '17', label: 'จ.สิงห์บุรี' },                 
    { value: '18', label: 'จ.ชัยนาท' },                    
    { value: '19', label: 'จ.สระบุรี' },                   
    { value: '20', label: 'จ.ชลบุรี' },                    
    { value: '21', label: 'จ.ระยอง' },                     
    { value: '22', label: 'จ.จันทบุรี' },                  
    { value: '23', label: 'จ.ตราด' },                      
    { value: '24', label: 'จ.ฉะเชิงเทรา' },                
    { value: '25', label: 'จ.ปราจีนบุรี' },                
    { value: '26', label: 'จ.นครนายก' },                   
    { value: '27', label: 'จ.สระแก้ว' },                   
    { value: '30', label: 'จ.นครราชสีมา' },                
    { value: '31', label: 'จ.บุรีรัมย์' },                 
    { value: '32', label: 'จ.สุรินทร์' },                  
    { value: '33', label: 'จ.ศรีสะเกษ' },                  
    { value: '34', label: 'จ.อุบลราชธานี' },               
    { value: '35', label: 'จ.ยโสธร' },                     
    { value: '36', label: 'จ.ชัยภูมิ' },                   
    { value: '37', label: 'จ.อำนาจเจริญ' },                
    { value: '38', label: 'จ.บึงกาฬ' },                    
    { value: '39', label: 'จ.หนองบัวลำภู' },               
    { value: '40', label: 'จ.ขอนแก่น' },                   
    { value: '41', label: 'จ.อุดรธานี' },                  
    { value: '42', label: 'จ.เลย' },                       
    { value: '43', label: 'จ.หนองคาย' },                   
    { value: '44', label: 'จ.มหาสารคาม' },                 
    { value: '45', label: 'จ.ร้อยเอ็ด' },                  
    { value: '46', label: 'จ.กาฬสินธุ์' },                 
    { value: '47', label: 'จ.สกลนคร' },                    
    { value: '48', label: 'จ.นครพนม' },                    
    { value: '49', label: 'จ.มุกดาหาร' },                  
    { value: '50', label: 'จ.เชียงใหม่' },                 
    { value: '51', label: 'จ.ลำพูน' },                     
    { value: '52', label: 'จ.ลำปาง' },                     
    { value: '53', label: 'จ.อุตรดิตถ์' },                 
    { value: '54', label: 'จ.แพร่' },                      
    { value: '55', label: 'จ.น่าน' },                      
    { value: '56', label: 'จ.พะเยา' },                     
    { value: '57', label: 'จ.เชียงราย' },                  
    { value: '58', label: 'จ.แม่ฮ่องสอน' },                
    { value: '60', label: 'จ.นครสวรรค์' },                 
    { value: '61', label: 'จ.อุทัยธานี' },                 
    { value: '62', label: 'จ.กำแพงเพชร' },                 
    { value: '63', label: 'จ.ตาก' },                       
    { value: '64', label: 'จ.สุโขทัย' },                   
    { value: '65', label: 'จ.พิษณุโลก' },                  
    { value: '66', label: 'จ.พิจิตร' },                    
    { value: '67', label: 'จ.เพชรบูรณ์' },                 
    { value: '70', label: 'จ.ราชบุรี' },                   
    { value: '71', label: 'จ.กาญจนบุรี' },                 
    { value: '72', label: 'จ.สุพรรณบุรี' },                
    { value: '73', label: 'จ.นครปฐม' },                    
    { value: '74', label: 'จ.สมุทรสาคร' },                 
    { value: '75', label: 'จ.สมุทรสงคราม' },               
    { value: '76', label: 'จ.เพชรบุรี' },                  
    { value: '77', label: 'จ.ประจวบคีรีขันธ์' },           
    { value: '80', label: 'จ.นครศรีธรรมราช' },             
    { value: '81', label: 'จ.กระบี่' },                    
    { value: '82', label: 'จ.พังงา' },                     
    { value: '83', label: 'จ.ภูเก็ต' },                    
    { value: '84', label: 'จ.สุราษฎร์ธานี' },              
    { value: '85', label: 'จ.ระนอง' },                     
    { value: '86', label: 'จ.ชุมพร' },                     
    { value: '90', label: 'จ.สงขลา' },                     
    { value: '91', label: 'จ.สตูล' },                      
    { value: '92', label: 'จ.ตรัง' },                      
    { value: '93', label: 'จ.พัทลุง' },                    
    { value: '94', label: 'จ.ปัตตานี' },                   
    { value: '95', label: 'จ.ยะลา' },                      
    { value: '96', label: 'จ.นราธิวาส' }                   
  ]
  // const provinces = result.map((province:provinceProp) => {
  //   return {
  //     value: province.provinceId,
  //     label: province.provinceName
  //   }
  // })
  return { props: { result } }
}

const ActionCustomer = ({result}:InferGetStaticPropsType<typeof getStaticProps>) => {
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
                      data={result}
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