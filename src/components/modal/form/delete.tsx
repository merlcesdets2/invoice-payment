import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

export const confirmDelete = (text: string, cb: () => void) => {
    openConfirmModal({
      title: 'แจ้งเตือน',
      centered: true,
      children: (<Text size="sm"> {text}</Text>),
      labels: { confirm: 'ยืนยัน', cancel: "ยกเลิก" },
      confirmProps: { color: 'red' },
      onConfirm: cb,
    })
}