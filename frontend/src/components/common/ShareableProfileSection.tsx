// Inside: src/components/common/ShareableProfileSection.tsx
import { useState } from 'react';
import { Company } from '../../types';
import { trackShare } from '../../utils/facebookPixel';

// --- Social Sharing Functions ---
const shareToWhatsApp = (url: string, companyName: string) => {
  const text = encodeURIComponent(`Check out ${companyName}: ${url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
  trackShare({ name: companyName } as Company, 'WhatsApp');
};

const shareToFacebook = (url: string, companyName: string) => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  trackShare({ name: companyName } as Company, 'Facebook');
};

const shareViaEmail = (url: string, companyName: string) => {
  const subject = encodeURIComponent(`Check out ${companyName}`);
  const body = encodeURIComponent(`I found this company that might interest you: ${url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  trackShare({ name: companyName } as Company, 'Email');
};


// --- The Component ---
interface Props {
  company: Company;
}

const ShareableProfileSection = ({ company }: Props) => {
  const [copied, setCopied] = useState(false);

  // The guide expects `profileUrl` from the API. If not present, use the current window URL as a fallback.
  const profileUrl = company.profileUrl || window.location.href;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      trackShare(company, 'Copy Link');
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  return (
    <div className="share-section" style={{ border: '1px solid #eee', padding: '1.5rem', margin: '2rem 0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>Share this Profile</h3>
      <div className="share-controls" style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={profileUrl}
          readOnly
          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        {/* You can replace this with your existing <Button> component if you have one */}
        <button onClick={copyProfileLink} style={{ padding: '8px 16px' }}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <div className="social-share-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => shareToWhatsApp(profileUrl, company.name)}>Share on WhatsApp</button>
        <button onClick={() => shareToFacebook(profileUrl, company.name)}>Share on Facebook</button>
        <button onClick={() => shareViaEmail(profileUrl, company.name)}>Share via Email</button>
      </div>
    </div>
  );
};

export default ShareableProfileSection;