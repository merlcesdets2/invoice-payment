const configInvoice = {
  nameTable: 'invoice',
  primaryKey: 'invoiceId',
  primaryName: 'invoiceNo',
  header: [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'invoiceDate', label: 'Invoice Date' },
    { key: 'customerCode', label: 'Customer Code' },
    { key: 'totalPrice', label: 'Total Price', type: 'number' },
    { key: 'vat', label: 'Vat', type: 'number' },
    { key: 'amountDue', label: 'Amount Due', type: 'number' },
  ],
}

const configCustomer = {
  nameTable: 'customer',
  primaryKey: 'customerId',
  primaryName: 'customerName',
  header: [
    { key: 'customerCode', label: 'Code' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'creditLimit', label: 'Credit Limit', type: 'number' },
    { key: 'tel', label: 'Telephone' },
    { key: 'addressLine', label: 'Address' },
    { key: 'tambolName', label: 'Sub District' },
    { key: 'amphurName', label: 'District' },
    { key: 'provinceName', label: 'Province' },
  ],
}

const configProduct = {
  nameTable: 'product',
  primaryKey: 'productId',
  primaryName: 'productName',
  header: [
    { key: 'productCode', label: 'Product Code' },
    { key: 'productName', label: 'Product Name' },
    { key: 'unitPrice', label: 'Unit Price', type: 'number' },
    { key: 'unit', label: 'Unit' },
  ],
}

export { configInvoice, configCustomer, configProduct }
