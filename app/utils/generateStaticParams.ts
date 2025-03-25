import { IProduct } from "@/app/store/products/productTypes";

export async function generateStaticParams() {
    const response = await fetch('https://fakestoreapi.com/products?limit=10');
    const data: IProduct[] = await response.json();
    
    return data.map((product) => ({
        id: product.id.toString()
    }));
} 