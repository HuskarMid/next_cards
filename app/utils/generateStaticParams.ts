import { IProduct } from '../store/products/productTypes';

export async function generateStaticParams(products: IProduct[]) {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
} 