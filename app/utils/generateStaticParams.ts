export async function generateStaticParams() {
    const data = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}, {id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}, {id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}, {id: 26}, {id: 27}, {id: 28}, {id: 29}, {id: 30}, {id: 31}, {id: 32}, {id: 33}, {id: 34}, {id: 35}, {id: 36}]
    
    return data.map((product) => ({
        id: product.id.toString()
    }));
} 