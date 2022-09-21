import axiosConfig from '@/util/axiosConfig'

export const getContentModal = <T>(apiUrl: string, value: T, type: string) => {
  const detail = {
    backSave: {
      title: 'Do you want to save the changes you made?',
      body: "You change will be lost if you don't save it",
      btn1: {
        label: 'Save',
        cb: () => {
          axiosConfig.put(apiUrl, JSON.stringify(value))
        },
      },
      btn2: { label: "Don't save" },
      btn3: { label: 'Cancel' },
    },
    editSave: {
      title: 'SAVE',
      body: 'Do you want to save this ?',
      btn1: {
        label: 'Save',
        cb: () => axiosConfig.put(apiUrl, JSON.stringify(value)),
      },
      btn3: { label: 'Cancel' },
    },
    create: {
      title: 'CREATE',
      body: 'Do you want to create this ?',
      btn1: {
        label: 'Confirm',
        cb: () => axiosConfig.post(apiUrl, JSON.stringify(value)),
      },
      btn3: { label: 'Cancel' },
    },
  }
  return detail[type as keyof typeof detail]
}
