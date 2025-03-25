import { Video } from '../types';

interface VideoEmbedProps {
  video: Video;
}

export default function VideoEmbed({ video }: VideoEmbedProps) {
  return (
    <div>
      {video.thumbnail ? (
        <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
      ) : (
        <div style={{ width: '100%', height: '150px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
          No Thumbnail
        </div>
      )}
    </div>
  );
} 