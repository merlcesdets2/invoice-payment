import { TablerIcon, IconFileInvoice, IconArticle, IconUsers,IconFileReport  } from "@tabler/icons";

interface menulistProp {
  icon: TablerIcon;
  label: string;
  hasChild?: boolean;
  links: LinksProp[] | string; 
}
interface LinksProp {
  label: string;
  link: string 
}
const menulist: menulistProp[] = [
  { label: 'INVOICE', icon: IconFileInvoice, links: '/invoice'},
  {
    label: 'MASTER DATA',
    icon: IconArticle,
    hasChild: true,
    links: [
      { label: 'CUSTOMER', link: '/customer' },
      { label: 'PRODUCT', link: '/product' },
    ],
  },
  {
    label: 'USER MANAGEMENT',
    icon: IconUsers,
    links: '/user-management',
  },
  {
    label: 'REPORT',
    icon: IconFileReport ,
    links: '/report',
  }
];

export {
  menulist
}
