import ApiService from "../api.service";

const PersonService = {
  GetByPassportData(data: any) {
    return ApiService.post(`/Person/GetByPassportData`, data);
  },
  GetPersonFamily(data: any) {
    return ApiService.post("Person/GetPersonFamily", data);
  },
  GetPhotoFromGSP(id: any) {
    return ApiService.get(`/Person/GetPhotoFromGSP/${id}`);
  }
};
export default PersonService;
