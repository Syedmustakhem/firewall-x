import axios from "axios";

export async function
downloadConfig(
  deviceId: string
) {

  const response =
    await axios.get(
      `http://localhost:5000/api/config/${deviceId}`
    );

  return response.data;

}