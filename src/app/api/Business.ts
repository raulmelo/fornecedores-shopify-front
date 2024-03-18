import Api from ".";
import { BusinessCreateTypes } from "../pages/business/business-types";
import { BusinessResponseType } from "../types/Business.types";




const BusinessServices = {
  createBusiness: async (data: BusinessCreateTypes) => {
    const response = await Api.post("/business/create", data);
    return response.data;
  },

  getBusiness: async () => {
    const response = await Api.get<BusinessResponseType[]>("/business");
    return response.data;
  },

  getBusinessByUser: async (id: string | number) => {
    const response = await Api.get<BusinessResponseType[]>(`/business/user/${id}`);
    return response.data;
  },


  getBusinessById: async (id: string | number) => {
    const response = await Api.get<BusinessResponseType>(`/business/${id}`);
    return response.data;
  },

  addUserBusiness: async (
    idBusiness: string | number,
    idUser: string | number
  ) => {
    const response = await Api.patch(
      `/business/adduser/${idBusiness}/${idUser}`
    );
    return response.data;
  },

  removeUserBusiness: async (
    idBusiness: string | number,
    idUser: string | number
  ) => {
    const response = await Api.delete(
      `/business/removeuser/${idBusiness}/${idUser}`
    );
    return response.data;
  },

  disabledBusiness: async (id: string | number) => {
    const response = await Api.delete(`/business/${id}`);
    return response.data;
  },

  enabledBusiness: async (id: string | number) => {
    const response = await Api.patch(`/business/enabled/${id}`);
    return response.data;
  },
};

export default BusinessServices;