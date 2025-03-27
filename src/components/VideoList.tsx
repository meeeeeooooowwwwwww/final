import { Video } from '../types';
import VideoEmbed from './VideoEmbed';

interface VideoListProps {
  videos: Video[];
}

export default function VideoList({ videos }: VideoListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
          <VideoEmbed video={video} />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p className="text-gray-600 mt-2">{video.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 