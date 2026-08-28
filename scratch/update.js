const fs = require('fs');
let code = fs.readFileSync('components/sections/UmkmSection.tsx', 'utf8');

code = code.replace(/interface Product \{\s*id: string;[\s\S]*?\s*\];/m, 
`import { Product } from "@/lib/db";

interface Props {
  initialProducts: Product[];
}

export default function UmkmSection({ initialProducts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };`);

code = code.replace(/products\.filter/g, 'initialProducts.filter');
code = code.replace(/\?\s*products/g, '? initialProducts');
code = code.replace(/\{product\.price\}/g, '{formatPrice(product.price)}');
code = code.replace(/product\.waText/g, '\`Halo, saya tertarik memesan ${product.name} dari Desa Salawu.\`');
code = code.replace(/6281234567890/g, '${product.waNumber}');

fs.writeFileSync('components/sections/UmkmSection.tsx', code);
