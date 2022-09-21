import axios from 'axios'
import { openModal, closeAllModals } from '@mantine/modals'
import { Button, Group } from '@mantine/core'


const instance = axios.create()

instance.defaults.headers.common['accessToken'] = 'invoiceToken'

instance.defaults.headers.put['Accept'] = 'application/json'
instance.defaults.headers.put['Content-Type'] = 'application/json'

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.post['Accept'] = 'application/json'

interface ErrorType {
  response: ResponseType
  code?: string
}

interface ResponseType {
  data: DataType
}

interface DataType {
  errorCode : number
  errorMessage: string
}

const openErrorModal = (error: ErrorType) => {
  const errorCode = !error.response.data ? '' : error.response.data?.errorCode
  return openModal ({
    title: `ERROR CODE ${errorCode}`,
    centered: true,
    children: (
      <>
        {error.response.data.errorMessage}
        <Group position = 'center'>
          <Button onClick={() => closeAllModals()} mt="md">
            Close
          </Button>
        </Group>
      </>
    )
  })
}



instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data
    }
    return Promise.reject(response)
  },
  function (error) {
      if(error.response.status === 500) return {error: 'error 500'}
      openErrorModal(error)
      return Promise.reject(error)
  }
)

export default instance
