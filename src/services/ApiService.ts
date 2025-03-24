import { apiInstance } from "@/config/api";
import axios from "axios";

type Method = "POST" | "PUT" | "PATCH" | "DELETE";
type ContentType = "JSON" | "FormData";

class ApiService<T, R> {
  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  //getter method to fetch the auth token dynamically
  // private get token(): string | null {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("token");
  //     return token;
  //   }
  //   return null;
  // }

  //fetches all data
  getAll = async (params: string): Promise<T> => {
    const res = await apiInstance.get(this.url + params);
    return res.data;
  };

  //fetches a single data entry
  getById = async (id: string): Promise<R> => {
    const res = await apiInstance.get(this.url + "/" + id);

    return res.data;
  };

  // handles mutation requests => POST, PATCH, PUT, DELETE
  /* "slug" can be an id or an extra path to be added to the base url, 
    pass in an empty string if you have no need for a slug(POST methods only) */
  mutate = async <B>(
    slug: string,
    payload: B,
    type: ContentType,
    method: Method
  ) => {
    let response;
    const contentType =
      type === "FormData" ? "multipart/form-data" : "application/json";

    const config = {
      headers: {
        "Content-Type": contentType,
      },
    };

    if (method === "POST") {
      response = await apiInstance.post(
        `${slug ? this.url + "/" + slug : this.url}`,
        payload,
        config
        //   {
        //     headers: {
        //       Authorization: this.token ? `Bearer ${this.token}` : "",
        //       "Content-Type": contentType,
        //     },
        //   }
      );
    } else if (method === "PATCH") {
      response = await apiInstance.patch(
        this.url + "/" + slug,
        payload,
        config
        //      {
        //   headers: {
        //     Authorization: `Bearer ${this.token}`,
        //     "Content-Type": contentType,
        //   },
        // }
      );
    } else if (method === "PUT") {
      response = await apiInstance.put(
        this.url + "/" + slug,
        payload,
        config
        //      {
        //   headers: {
        //     Authorization: `Bearer ${this.token}`,
        //     "Content-Type": contentType,
        //   },
        // }
      );
    } else if (method === "DELETE") {
      response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${this.url}/${slug}`,
        method: "delete",
        data: payload,
        //   headers: {
        //     Authorization: `Bearer ${this.token}`,
        //     "Content-Type": contentType,
        //   },
      });
    }
    return response;
  };
}

export default ApiService;
