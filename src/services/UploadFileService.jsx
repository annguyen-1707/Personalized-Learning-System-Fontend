import axios from "axios";

const uploadFile = async (file, targetFolder) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`/api/uploadfile?targetFolder=${targetFolder}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data
    } catch (error) {
        throw new Error(error || "can not upload file");
    }
};

export default uploadFile;