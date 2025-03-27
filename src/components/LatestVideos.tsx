import React from 'react';
import { Video } from '../types';

interface LatestVideosProps {
  videos: Video[];
}

const LatestVideos: React.FC<LatestVideosProps> = ({ videos }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
              <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                {(video.views || 0).toLocaleString()} views
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">{video.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Published: {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestVideos; 