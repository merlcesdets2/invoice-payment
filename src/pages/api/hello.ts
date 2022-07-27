// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: object
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): void {
  const elements = [
    {
      name: 'AAA',
      productCode: 111,
      producDescription: 'loremloremloremloremlorem',
      status: 'Avilable',
      remark: 'Carbon',
    },
    {
      name: 'BBB',
      productCode: 112,
      producDescription: 'loremloremloremloremlorem',
      status: 'Rental',
      remark: 'Nitrogen',
    },
    {
      name: 'CCC',
      productCode: 113,
      producDescription: 'loremloremloremloremlorem',
      status: 'Sold',
      remark: 'Yttrium',
    },
    {
      name: 'DDD',
      productCode: 114,
      producDescription: 'loremloremloremloremlorem',
      status: 'Avilable',
      remark: 'Barium',
    },
    {
      name: 'FFF',
      productCode: 115,
      producDescription: 'loremloremloremloremlorem',
      status: 'Avilable',
      remark: 'Cerium',
    },
  ]
  res.status(200).json({ result: elements })
}
