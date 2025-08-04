// /pages/api/proxy-login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://amirpeyravan.ir/auth/login",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Unknown error" });
  }
}
