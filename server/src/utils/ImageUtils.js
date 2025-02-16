import axios from "axios";
import mime from "mime-types";

export const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

export const binaryToBase64 = (imageByte) => {
  return Buffer.from(imageByte, "binary").toString("base64");
}

export const processImageUrls = async (images) => {
  try {
    return await Promise.all(
      images.map(async (image) => await urlToGenerativePart(image))
    );
  } catch (error) {
    console.error("processImages | Error:", error);
  }
};

const urlToGenerativePart = async (url) => {
  try {
    // Make a GET request to the image URL
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Determine the MIME type based on the response headers
    const mimeType = response.headers["content-type"] || mime.lookup(url);

    if (!mimeType || !mimeType.startsWith("image/")) {
      console.error("processImages | Unsupported image MIME type:", mimeType);
      return { Error: "Unsupported image MIME type" };
    }

    // Convert the binary data to base64
    const base64Data = binaryToBase64(response.data)

    // Return an object with inlineData
    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  } catch (error) {
    console.error(
      "processImages | Error fetching image from URL:",
      error.message
    );
    return { Error: "Error fetching image from URL" };
  }
};

export const processImageFiles = async (images) => {
  try {
    return await Promise.all(
      images.map(async (image) => await imageFileToGenerativeParts(image))
    );
  } catch (error) {
    console.error("processImages | Error:", error);
  }
};

const imageFileToGenerativeParts = async (image) => {
  try {
    return {
      inlineData: {
        data: binaryToBase64(Array.from(image.buffer)),
        mimeType: image.mimetype,
      },
    };
  } catch (error) {
    console.error("processImages | Error:", error);
  }
}