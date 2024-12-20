import axios from "axios";

const PINATA_API_KEY = "364a2ee707c99061169f";
const PINATA_SECRET_API_KEY = "6169ad75d44c3a0b90f3daf64b37f6f001c33cf403814e1ea731a6f3eda05e97";

// Helper function to fetch image from path and convert to Blob
const fetchImageAsBlob = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image as Blob:", error);
    throw new Error("Failed to fetch image");
  }
};

// Upload image or metadata to IPFS
export const uploadToIPFS = async (fileOrData) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();

  // Check if it's an image path or metadata
  if (typeof fileOrData === "string" && fileOrData.endsWith(".png")) {
    // It's an image path, fetch and convert it to Blob
    const imageBlob = await fetchImageAsBlob(fileOrData);
    data.append("file", imageBlob, "tokenImage.png");
  } else if (typeof fileOrData === "string") {
    // It's JSON metadata
    const metadataBlob = new Blob([fileOrData], { type: "application/json" });
    data.append("file", metadataBlob, "metadata.json");
  } else {
    throw new Error("Invalid input: Provide image path or metadata string");
  }

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    // Return the IPFS URL or CID from the response
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
};