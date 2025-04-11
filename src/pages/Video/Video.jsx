// src/pages/video/Video.jsx
import React from 'react'
import './Video.css'
import PlayVideo from '../../Components/PlayVideo/PlayVideo'
import RecommendedList from '../../Components/RecommendedList/RecommendedList'
import { useParams } from 'react-router-dom'

const Video = () => {
    const { videoId, categoryId } = useParams();
    console.log('Video params:', { videoId, categoryId }); // Check if these are correct

    return (
        <div className='play-container'>
            <PlayVideo videoId={videoId} />
            <RecommendedList categoryId={categoryId} />
        </div>
    )
}

export default Video