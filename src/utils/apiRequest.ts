import axios, { AxiosResponse } from "axios";

interface apiRequestProps {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  headers?: any;
  data?: any;
  params?: any;
}

const apiRequest = async <T = any>({
  url,
  method,
  headers,
  data,
  params,
}: apiRequestProps): Promise<AxiosResponse<T, any>> => {
  return await axios({
    url,
    method,
    data,
    params,
    timeout: 5000,
    headers,
  });
};

export default apiRequest;
