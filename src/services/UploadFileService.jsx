import axios from "axios";

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("/api/uploadfile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    console.log("response", response.data);
    return response.data.data
};

export default uploadFile;