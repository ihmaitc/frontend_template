import ApiService from "../api.service";

export const UserSettingService = {
  GetByKey(query: string) {
    return ApiService.get(`UserSetting/GetByKey/${query}`);
  },
  Save(data: Object) {
    return ApiService.post(`UserSetting/save`, data);
  }
};
