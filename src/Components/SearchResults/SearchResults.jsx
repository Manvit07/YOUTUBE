// src/pages/search/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_KEY, ValueConverter } from '../../data';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './SearchResults.css';

const SearchResults = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search_query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error(`YouTube API error: ${response.status}`);
                }

                const data = await response.json();

                if (!data.items || data.items.length === 0) {
                    throw new Error('No videos found for this search');
                }

                // Filter out any results without videoId (like channel results)
                const videoItems = data.items.filter(item => item.id.kind === "youtube#video");
                setVideos(videoItems);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery && searchQuery.trim() !== '') {
            fetchSearchResults();
        } else {
            setLoading(false);
            setError('Please enter a search term');
        }
    }, [searchQuery]);

    if (loading) {
        return <div className="loading">Loading search results...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="search-results">
            <h2>Search results for: "{searchQuery}"</h2>
            <div className="results-container">
                {videos.map((video, index) => (
                    <div key={index} className="search-card">
                        <Link to={`/video/${video.snippet.categoryId}/${video.id.videoId}`}>
                            <img
                                src={video.snippet.thumbnails?.medium?.url || ''}
                                alt={video.snippet.title}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                                }}
                            />
                        </Link>
                        <div className="search-info">
                            <Link to={`/video/${video.snippet.categoryId}/${video.id.videoId}`}>
                                <h3>{video.snippet.title}</h3>
                            </Link>
                            <Link to={`/channel/${video.snippet.channelId}`} className="channel-link">
                                <p>{video.snippet.channelTitle}</p>
                            </Link>
                            <p className="publish-date">{moment(video.snippet.publishedAt).fromNow()}</p>
                            <p className="description">{video.snippet.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;