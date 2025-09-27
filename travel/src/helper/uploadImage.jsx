const url = import.meta.env.VITE_CLOUDINARY_URL;
console.log(url);


const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const dataResponse = await fetch(url, {
        method: "post",
        body: formData
    });
    const data = await dataResponse.json();
    console.log(data);

    return data;
}
export default uploadImage;