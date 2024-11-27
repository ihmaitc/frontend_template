import ApiService from "../api.service";

export const FrontAppErrorService = {
  GetList(data: any) {
    return ApiService.post("FrontAppError/GetList", data);
  },
  Get(id: number | string) {
    return ApiService.get(`FrontAppError/Get/${id}`);
  },
  Create(data: any) {
    return ApiService.post(`FrontAppError/Create/`, data);
  }
};
