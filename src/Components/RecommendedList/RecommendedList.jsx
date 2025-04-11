import React, { useEffect, useState } from 'react';
import './RecommendedList.css';
import { API_KEY, ValueConverter } from '../../data';
import { Link } from 'react-router-dom';

const RecommendedList = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate categoryId is a number
            const validCategoryId = categoryId && !isNaN(categoryId) ? categoryId : '0';

            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=US&videoCategoryId=${validCategoryId}&key=${API_KEY}`;

            console.log('API Request URL:', url); // Debugging

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.items || !Array.isArray(data.items)) {
                throw new Error('Invalid data format received from API');
            }

            setApiData(data.items);
        } catch (err) {
            console.error("Error fetching recommended videos:", err);
            setError(err.message);
            setApiData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    if (loading) {
        return <div className='recommended loading'>Loading recommendations...</div>;
    }

    if (error) {
        return (
            <div className='recommended error'>
                Error loading recommendations: {error}
                <button onClick={fetchData} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='recommended'>
            {apiData.length > 0 ? (
                apiData.map((item, index) => (
                    <Link
                        to={`/video/${item.snippet?.categoryId || '0'}/${item.id}`}
                        key={item.id || index}
                        className="side-video-list"
                    >
                        <img
                            src={item.snippet?.thumbnails?.medium?.url || ''}
                            alt={item.snippet?.title || 'Video'}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/168x94?text=No+Thumbnail';
                            }}
                        />
                        <div className="vid-info">
                            <h4>{item.snippet?.title || 'Untitled Video'}</h4>
                            <p>{item.snippet?.channelTitle || 'Unknown Channel'}</p>
                            <p>
                                {item.statistics?.viewCount
                                    ? ValueConverter(item.statistics.viewCount) + ' views'
                                    : 'Views not available'
                                }
                            </p>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="no-results">No recommended videos found</div>
            )}
        </div>
    );
};

export default RecommendedList;