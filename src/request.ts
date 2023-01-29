//存放请求路径的文件
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
class Request {
  private baseUrl = "/api";

  private request(opts: AxiosRequestConfig) {
    const instance: AxiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 3000,
    });
    this.setInterceptors(instance);
    return instance(opts);
  }
  //拦截器
  private setInterceptors(instance: AxiosInstance) {
    //请求拦截器
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      if (!config.url?.includes("/login/cellphone")) {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    });
    //响应拦截器
    instance.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.status == 200) {
          return Promise.resolve(res.data);
        } else {
          return Promise.reject(res.data);
        }
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  } //封装get请求
  public get(url: string, options?: AxiosRequestConfig): Promise<{ [key: string]: any }> {
    return this.request({
      url: url,
      method: "get",
      params: options,
    });
  } //封装post请求
  public post(url: string, options: AxiosRequestConfig): Promise<{ [key: string]: any }> {
    return this.request({
      url: url,
      method: "post",
      data: options,
    });
  }
}
const httpRequest = new Request();
export default httpRequest;
