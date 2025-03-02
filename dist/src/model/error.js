export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["EXIST_CATEGORY"] = "EXIST_CATEGORY";
    ErrorCode["NO_DATA"] = "NO_DATA";
    ErrorCode["CATEGORY_NOT_FOUND"] = "CATEGORY_NOT_FOUND";
    ErrorCode["DELETED_CATEGORY"] = "DELETED_CATEGORY";
    ErrorCode["TAKEN_CATEGORY_NAME"] = "TAKEN_CATEGORY_NAME";
})(ErrorCode || (ErrorCode = {}));
export const ErrorStatusMap = {
    EXIST_CATEGORY: 409,
    NO_DATA: 404,
    CATEGORY_NOT_FOUND: 404,
    DELETED_CATEGORY: 404,
    TAKEN_CATEGORY_NAME: 409,
};
//# sourceMappingURL=error.js.map