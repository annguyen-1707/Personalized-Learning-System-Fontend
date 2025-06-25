import React from "react";

function ListeningImg({ image, title, code, onClick }) {
    const showImage = (image) => {
        console.log("Show image:", image);
        window.open("http://localhost:8080/images/content_listening/" + image, "_blank");
    };
    return (
        <div className="relative">
            <img
                onClick={onClick}
                src={
                    image
                        ? "http://localhost:8080/images/content_listening/" + image
                        : "https://via.placeholder.com/300x200"
                }
                alt={title || "No title"}
                className="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
            />
            {code && (
                <div className="absolute top-0 right-0 m-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-300">
                        {code}
                    </span>
                </div>
            )}
        </div>
    );
}

export default ListeningImg;