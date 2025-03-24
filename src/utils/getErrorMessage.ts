export function getErrorMessage(error: any): string {
  return error?.response?.data?.message;
}
