import Api from ".";
import { ProductSimpleTypes } from "../types/Products.types";

const ProductsServices = {
  getProducts: async (idBusiness: string | number) => {
    const response = await Api.get("/products/" + idBusiness);
    return response.data;
  },


  createProduct: async (product: ProductSimpleTypes) => {
    const response = await Api.post("/products", product);
    return response.data;
  },

  updateProduct: async (idProduct: string | number, product: any) => {
    const response = await Api.put("/products/" + idProduct, product);
    return response.data;
  },

  updateImagesProducts: async (idProduct: string | number, image: any) => {
    const response = await Api.patch("/products/" + idProduct + '/images', image);
    return response.data;
  },

  deleteImageProduct: async (idProduct: string | number, idImage: any) => {
    const response = await Api.delete("/products/" + idProduct + '/images/' + idImage);
    return response.data;
  },

  updateInventoryProduct: async ( data: { inventory_item_id: number, available_adjustment: number }) => {
    const response = await Api.post("/products/product-variant-qtd", data);
    return response.data;
  }
}

export default ProductsServices;