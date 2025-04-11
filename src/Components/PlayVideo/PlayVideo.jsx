import React, { useEffect, useState } from 'react'
import './PlayVideo.css'

import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, ValueConverter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = ({ videoId }) => {

    const [apiData, setApiData] = useState(null);
    const [ChannelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [expanded, setExpanded] = useState(false)

    const fetchVideoData = async () => {
        try {
            const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]);
            } else {
                console.warn("No video data found");
            }
        } catch (error) {
            console.error("Failed to fetch video data", error);
        }
    };

    const fetchOtherData = async () => {
        try {
            // ✅ Fixed the missing '=' in the API key
            const ChannelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData ? apiData.snippet.channelId : ""}&key=${API_KEY}`;
            const response = await fetch(ChannelData_url);
            const data = await response.json();

            const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
            await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data.items));


            // ✅ Check if data.items exists and has at least one item
            if (data.items && data.items.length > 0) {
                setChannelData(data.items[0]);
            } else {
                console.warn("No channel data found");
            }
        } catch (error) {
            console.error("Failed to fetch channel data", error);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId])

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
        }
    }, [apiData]);


    // Function to format description
    const formatDescription = (text) => {
        // Escape HTML entities to prevent injection issues
        const escapeHTML = (str) =>
            str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        // Replace URLs with anchor tags
        const linkedText = text.replace(
            /(https?:\/\/[^\s]+)/g,
            (url) =>
                `<a href='${escapeHTML(url)}' target='_blank' rel='noopener noreferrer' style='color: blue; text-decoration: underline;'>${escapeHTML(url)}</a>`
        );

        // Replace line breaks with <br/>
        return linkedText.replace(/\n/g, "<br/>");
    };



    return (
        <div className='play-video'>
            {/*<video src={video1} controls autoPlay muted ></video>*/}
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title HERE"}</h3>
            <hr />
            <div className="publisher">
                <img className='profile-img' src={ChannelData ? ChannelData.snippet.thumbnails.default.url : user_profile} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : "=="}</p>
                    <span>{ChannelData ? ValueConverter(ChannelData.statistics.subscriberCount) : "=="} Subscribe</span>
                </div>
                <button>Subscribe</button>
                <div className="play-video-info">
                    <div className='G-BUTTON'>
                        <span className='like'><img src={like} alt="" />{apiData ? ValueConverter(apiData.statistics.likeCount) : "16K"}</span>
                        <span className='like'><img src={dislike} alt="" /></span>
                        <span className='share'><img src={share} alt="" /></span>
                        <span className='save'><img src={save} alt="" /></span>
                    </div>
                </div>
            </div>
            <div className="vid-description">

                <div className="video-description">
                    <p>{apiData ? ValueConverter(apiData.statistics.viewCount) : "16k"} views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "Date"}</p>

                    {apiData ? (
                        <div>
                            <div className={`video-text ${expanded ? "expanded" : ""}`} dangerouslySetInnerHTML={{ __html: formatDescription(apiData.snippet.description) }} />
                            <span className="more-btn" onClick={() => setExpanded(!expanded)}>
                                {expanded ? "Show Less" : "More"}
                            </span>
                        </div>
                    ) : "description"}
                </div>
                <hr />
                <h4>{apiData ? ValueConverter(apiData.statistics.commentCount) : ""} Comments</h4>
                {commentData.map((item, index) => {
                    return (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>{item ? moment(item.snippet.topLevelComment.updatedAt).fromNow() : "DATE"}</span></h3>
                                <div className="comment-text">
                                    {item ? (
                                        <div dangerouslySetInnerHTML={{ __html: formatDescription(item.snippet.topLevelComment.snippet.textDisplay) }} />
                                    ) : "comment"}
                                </div>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{item ? ValueConverter(item.snippet.topLevelComment.snippet.likeCount) : "likes"}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PlayVideo