import React, { useState } from "react"

const imageUrlsData = [
    "https://picsum.photos/id/1018/800/600",
    "https://picsum.photos/id/1015/800/600",
    "https://picsum.photos/id/1019/800/600",
    "https://picsum.photos/id/1020/800/600",
    "https://picsum.photos/id/1021/800/600",
    "https://picsum.photos/id/1022/800/600",
];

export const Carousel = ({imageUrls = imageUrlsData, visibleImagesCount = 4}) => {
    const [ startIndex, setStartIndex ] = useState(0);

    const canGoNext = startIndex + visibleImagesCount < imageUrls.length;
    const canGoPrevious = startIndex > 0;

    const handlePreviousClick = () => {
        if(canGoPrevious){
            setStartIndex((prev)=>prev - 1)
        }
    }

    const handleNextClick = () => {
        if(canGoNext){
            setStartIndex((prev)=>prev + 1)
        }
    }

    return (
        <div className="flex w-full relative">
            <button className={`absolute top-1/2 left-1 bg-gray-300 p-4 rounded-md hover:cursor-pointer ${!canGoPrevious && "bg-gray-600 hover:cursor-not-allowed"}`} onClick={handlePreviousClick} disabled={!canGoPrevious}>{"<"}</button>
            <ul className={`flex w-full`}>
            {imageUrls.slice(startIndex, startIndex + visibleImagesCount).map((imageUrl, index)=>{
                return (
                    <li key={index} className={`w-1/${visibleImagesCount} overflow-clip`}><img src={imageUrl}/></li>
                )
            })}
            </ul>
            <button className={`absolute top-1/2 right-1 bg-gray-300 p-4 rounded-md hover:cursor-pointer ${!canGoNext && "bg-gray-600 hover:cursor-not-allowed"}`} onClick={handleNextClick} disabled={!canGoNext}>{">"}</button>
        </div>
    )
}