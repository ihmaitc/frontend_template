import ApiService from "../api.service";

const ManualService = {
  GetModuleSelectList() {
    return ApiService.get("manual/GetModuleSelectList");
  },
  StateSelectList() {
    return ApiService.get("manual/StateSelectList");
  },
  LanguageSelectList() {
    return ApiService.get("manual/LanguageSelectList");
  },
  GenderSelectList() {
    return ApiService.get("manual/GenderSelectList");
  },
  GetAnswerTypeSelectList() {
    return ApiService.get("manual/GetInvAnswerTypeSelectList");
  },
  GetQuestionnaireTypeSelectList() {
    return ApiService.get("manual/GetInvQuestionnaireTypeSelectList");
  },
  StatusSelectList() {
    return ApiService.get("manual/StatusSelectList");
  },
  IdentityDocumentSelectList() {
    return ApiService.get("manual/IdentityDocumentSelectList");
  }
};
export default ManualService;
