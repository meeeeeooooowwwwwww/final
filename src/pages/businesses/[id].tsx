import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { Business } from '../../types';
import Head from 'next/head';

export default function BusinessPage() {
  const router = useRouter();
  const { id } = router.query;
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      if (!id) return;

      try {
        const response = await fetch(`/api/businesses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business');
        }
        const data = await response.json();
        setBusiness(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [id]);

  return (
    <>
      <Head>
        <title>{business ? `${business.name} - GetIt` : 'Loading Business - GetIt'}</title>
        <meta name="description" content={business?.description?.slice(0, 160) || 'Loading business...'} />
      </Head>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : error || !business ? (
          <div className="text-red-600">
            {error || 'Business not found'}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                {business.isPaid && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                    Premium Listing - Tier {business.tier}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <p className="text-gray-700 mb-4">{business.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {business.address}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>{' '}
                      <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                        {business.phone}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                        {business.email}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Website:</span>{' '}
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {business.website}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag) => (
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
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Add getServerSideProps to handle server-side rendering
export async function getServerSideProps() {
  return {
    props: {}, // Return empty props since we'll handle data fetching on the client side
  };
} 