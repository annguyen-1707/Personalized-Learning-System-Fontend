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

const uploadVideoToYouTube = async (videoFile, lessonName) => {
    try {
        const formData = new FormData();
        formData.append("videoFile", videoFile);
        formData.append("lessonName", lessonName);
        formData.append("accessToken", localStorage.getItem("accessToken"));
        const response = await axios.post("/api/uploadfile/youtube", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        throw new Error(error || "can not upload video to YouTube");
    }
};

export { uploadFile, uploadVideoToYouTube };