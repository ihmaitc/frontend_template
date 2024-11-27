import ApiService from "../api.service";

const AccountService = {
  Login(data: any, Headers: any) {
    return ApiService.post("account/Login", data, Headers);
  },
  Registrate(data: any, headers: any) {
    return ApiService.post("account/Registrate", data, headers);
  }
};
export default AccountService;
