import Link from "next/link";
import React from "react";

interface VinylAffiliateProps {
    vinylTitle: string;
    artist: string;
    className?: string;
}

const VinylAffiliate: React.FC<VinylAffiliateProps> = ({ vinylTitle, artist }) => {

    const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(vinylTitle + " " + artist)}&tag=vinylovers06-20`;
    const discogsSearchUrl = `https://www.discogs.com/search/?q=${encodeURIComponent(vinylTitle + " " + artist)}`;
    const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(vinylTitle + " " + artist)}`;
  
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm mt-5">
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-xl font-semibold">Where to Buy</h2>
        </div>
        <div className="flex flex-col space-y-2">
          <a href={amazonSearchUrl} target="_blank" rel="noopener noreferrer" className="underline primary text-blue-600 hover:text-blue-800">
            Amazon
          </a>
          <Link href={discogsSearchUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">
            Discogs
          </Link>
          <Link href={ebaySearchUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">
            eBay
          </Link>
        </div>
      </div>
    );
  };

export default VinylAffiliate;