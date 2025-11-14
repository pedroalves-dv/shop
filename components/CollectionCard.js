/*
  CollectionCard component
  - What it is: renders a collection tile used on the homepage and collection lists.
  - What it controls (CSS classes): .collection-card, .collection-image-wrap, .collection-image-box,
    .collection-extrusion-right, .collection-extrusion-bottom, .collection-info, .collection-card-title
  - Notes: links into /collections/[handle]. Keep image aspect and hover extrusion here.
*/
import Link from 'next/link';
import Image from 'next/image';

export default function CollectionCard({ collection, priority = false }) {
  return (
    <div className="collection-card">
      <Link href={`/collections/${encodeURIComponent(collection.handle)}`}>
        <div className="collection-image-wrap">
            <div className="collection-image-box">
              {collection.image ? (
                <Image
                  src={collection.image}
                  alt={collection.imageAlt || collection.title}
                  width={1200}
                  height={900}
                  className="collection-image"
                  quality={95}
                  priority={priority}
                  unoptimized={true}
                />
              ) : (
                <div className="collection-image-fallback">
                  {collection.title.charAt(0)}
                </div>
              )}
            </div>

            <div className="collection-extrusion-right" />
            <div className="collection-extrusion-bottom" />
          </div>
      </Link>

      <div className="collection-info">
        <Link href={`/collections/${encodeURIComponent(collection.handle)}`}>
            <h3 className="collection-card-title">{collection.title}</h3>
        </Link>

        {collection.productCount !== undefined && (
          <p className="collection-count">{collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}</p>
        )}
      </div>
    </div>
  );
}
