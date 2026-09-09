import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Sliders, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  minKb: number;
  maxKb: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'ssc-photo',
    name: 'SSC Photo (20KB - 50KB)',
    width: 200,
    height: 230,
    minKb: 20,
    maxKb: 50,
    description: 'Standard 200×230 px, 20-50 KB for SSC CGL, CHSL, MTS, GD Constable',
  },
  {
    id: 'ssc-sign',
    name: 'SSC Signature (10KB - 20KB)',
    width: 140,
    height: 60,
    minKb: 10,
    maxKb: 20,
    description: 'Standard 140×60 px, 10-20 KB black ink on white paper',
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Photo / Sign (20KB - 300KB)',
    width: 350,
    height: 350,
    minKb: 20,
    maxKb: 300,
    description: 'Square 350×350 px, between 20 KB and 300 KB for Civil Services & CDS',
  },
  {
    id: 'ibps-photo',
    name: 'IBPS / Banking Photo (20KB - 50KB)',
    width: 200,
    height: 230,
    minKb: 20,
    maxKb: 50,
    description: 'Standard 200×230 px for SBI, IBPS PO, Clerk & RRB',
  },
  {
    id: 'custom',
    name: 'Custom Dimensions & Size',
    width: 300,
    height: 300,
    minKb: 10,
    maxKb: 100,
    description: 'Specify your own custom width, height, and target size',
  },
];

interface ImageResizerProps {
  onBackToHome: () => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({ onBackToHome }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc-photo');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [targetWidth, setTargetWidth] = useState<number>(200);
  const [targetHeight, setTargetHeight] = useState<number>(230);
  const [targetMaxKb, setTargetMaxKb] = useState<number>(50);
  const [quality, setQuality] = useState<number>(0.85);

  const [resizedBlobUrl, setResizedBlobUrl] = useState<string | null>(null);
  const [resizedSizeKb, setResizedSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Set document title & SEO for this tool
  useEffect(() => {
    document.title = 'Sarkari Photo & Signature Resizer (20KB to 50KB Online) | Sarkari Aavedan';
    window.scrollTo(0, 0);
  }, []);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setTargetWidth(preset.width);
      setTargetHeight(preset.height);
      setTargetMaxKb(preset.maxKb);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    setErrorMessage(null);
    setOriginalSizeKb(parseFloat((file.size / 1024).toFixed(1)));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setOriginalImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Re-run compression when parameters or image change
  useEffect(() => {
    if (!originalImage) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill with clean white background in case source has transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Adaptive compression to target under targetMaxKb
      let q = quality;
      const attemptCompression = (qVal: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              return;
            }
            const sizeKb = blob.size / 1024;
            // If slightly too big and quality is still above 0.3, step down
            if (sizeKb > targetMaxKb && qVal > 0.35) {
              attemptCompression(qVal - 0.1);
              return;
            }

            if (blobUrlRef.current) {
              URL.revokeObjectURL(blobUrlRef.current);
            }
            const newUrl = URL.createObjectURL(blob);
            blobUrlRef.current = newUrl;
            setResizedBlobUrl(newUrl);
            setResizedSizeKb(parseFloat(sizeKb.toFixed(1)));
            setIsProcessing(false);
          },
          'image/jpeg',
          qVal
        );
      };

      attemptCompression(q);
    };
    img.src = originalImage;
  }, [originalImage, targetWidth, targetHeight, targetMaxKb, quality]);

  return (
    <div className="tool-container">
      {/* Top back navigation */}
      <div className="tool-back-bar no-print">
        <button className="btn-outline" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <span className="tool-tag">Free 100% Client-Side Tool</span>
      </div>

      <header className="tool-header">
        <h1 className="tool-main-title">
          Sarkari Photo & Signature Resizer Online
        </h1>
        <p className="tool-sub-title">
          Easily resize, crop, and compress your passport photograph and signature to exact dimensions and <strong>20 KB – 50 KB</strong> for SSC, UPSC, Banking, Railway, and State PSC application forms. <em>100% private: runs directly in your browser.</em>
        </p>
      </header>

      {/* Main Tool Grid */}
      <div className="tool-grid">
        {/* Left Column: Preset & Controls */}
        <div className="tool-controls-card">
          <h2 className="tool-card-title">
            <Sliders size={18} />
            <span>Select Exam Preset</span>
          </h2>

          <div className="tool-presets-list">
            {PRESETS.map((p) => (
              <label 
                key={p.id} 
                className={`tool-preset-option ${selectedPreset === p.id ? 'active' : ''}`}
                onClick={() => handlePresetChange(p.id)}
              >
                <input 
                  type="radio" 
                  name="preset" 
                  checked={selectedPreset === p.id} 
                  onChange={() => handlePresetChange(p.id)} 
                />
                <div className="tool-preset-meta">
                  <strong>{p.name}</strong>
                  <span className="tool-preset-desc">{p.description}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="tool-sliders-section">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1rem' }}>
              Fine-Tune Dimensions & Size
            </h3>

            <div className="tool-input-row">
              <div className="tool-input-group">
                <label>Width (px)</label>
                <input 
                  type="number" 
                  value={targetWidth} 
                  onChange={(e) => setTargetWidth(Number(e.target.value))} 
                  min={50} 
                  max={2000} 
                />
              </div>
              <div className="tool-input-group">
                <label>Height (px)</label>
                <input 
                  type="number" 
                  value={targetHeight} 
                  onChange={(e) => setTargetHeight(Number(e.target.value))} 
                  min={50} 
                  max={2000} 
                />
              </div>
              <div className="tool-input-group">
                <label>Max Size (KB)</label>
                <input 
                  type="number" 
                  value={targetMaxKb} 
                  onChange={(e) => setTargetMaxKb(Number(e.target.value))} 
                  min={5} 
                  max={500} 
                />
              </div>
            </div>

            <div className="tool-quality-slider" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Compression Quality</span>
                <strong>{Math.round(quality * 100)}%</strong>
              </div>
              <input 
                type="range" 
                min={0.2} 
                max={1.0} 
                step={0.05} 
                value={quality} 
                onChange={(e) => setQuality(Number(e.target.value))} 
                style={{ width: '100%', marginTop: '0.25rem' }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Upload & Live Result */}
        <div className="tool-preview-card">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/jpeg,image/png,image/webp" 
            style={{ display: 'none' }} 
          />

          {!originalImage ? (
            <div 
              className="tool-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="tool-upload-icon" />
              <h3>Click to Upload Photo or Signature</h3>
              <p>Supports JPG, JPEG, PNG, WEBP (Any size)</p>
              <button type="button" className="btn-primary" style={{ marginTop: '1rem' }}>
                Browse from Device
              </button>
            </div>
          ) : (
            <div className="tool-result-wrapper">
              <div className="tool-comparison-grid">
                {/* Original */}
                <div className="tool-image-box">
                  <span className="tool-box-label">Original Image</span>
                  <div className="tool-img-display">
                    <img src={originalImage} alt="Original uploaded" />
                  </div>
                  <div className="tool-stat-badge">
                    <span>{originalDimensions.width}×{originalDimensions.height} px</span>
                    <span>•</span>
                    <span>{originalSizeKb} KB</span>
                  </div>
                </div>

                {/* Resized Output */}
                <div className="tool-image-box highlight">
                  <span className="tool-box-label">Resized & Compressed</span>
                  <div className="tool-img-display">
                    {isProcessing ? (
                      <div className="tool-spinner-wrap">
                        <RefreshCw className="animate-spin" size={28} />
                        <span>Compressing...</span>
                      </div>
                    ) : (
                      resizedBlobUrl && <img src={resizedBlobUrl} alt="Resized output" />
                    )}
                  </div>
                  <div className="tool-stat-badge success">
                    <span>{targetWidth}×{targetHeight} px</span>
                    <span>•</span>
                    <strong>{resizedSizeKb} KB</strong>
                    {resizedSizeKb <= targetMaxKb && <CheckCircle2 size={14} color="#10b981" />}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="tool-action-bar">
                <button 
                  className="btn-outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw size={16} />
                  <span>Choose Another Image</span>
                </button>

                {resizedBlobUrl && (
                  <a 
                    href={resizedBlobUrl} 
                    download={`sarkariavedan-resized-${targetWidth}x${targetHeight}.jpg`}
                    className="btn-primary tool-download-btn"
                  >
                    <Download size={18} />
                    <span>Download Resized Photo (JPEG)</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="tool-error-msg" style={{ marginTop: '1rem' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* SEO Guidelines Section */}
      <section className="tool-seo-guide">
        <h2>Government Job Photo & Signature Upload Guidelines 2026</h2>
        
        <div className="tool-guide-cards">
          <div className="tool-guide-card">
            <h3>SSC Guidelines (CGL, CHSL, MTS, GD)</h3>
            <ul>
              <li><strong>Photograph:</strong> 20 KB to 50 KB, dimension 3.5 cm (width) × 4.5 cm (height) or ~200×230 pixels.</li>
              <li>Must be taken against a plain light/white background with both ears visible.</li>
              <li><strong>Signature:</strong> 10 KB to 20 KB in JPEG format, dimensions 140×60 pixels with black ballpoint pen.</li>
            </ul>
          </div>

          <div className="tool-guide-card">
            <h3>UPSC Guidelines (Civil Services, NDA, CDS)</h3>
            <ul>
              <li><strong>Photograph:</strong> 20 KB to 300 KB, clear front view with neutral expression.</li>
              <li>Candidate's name and date of photo must be imprinted if mandated by specific exam notice.</li>
              <li><strong>Signature:</strong> 20 KB to 300 KB, clear scan on plain white sheet.</li>
            </ul>
          </div>

          <div className="tool-guide-card">
            <h3>Banking & Railway Exams (IBPS, SBI, RRB)</h3>
            <ul>
              <li><strong>Photograph:</strong> 20 KB to 50 KB, passport style, color photo with white background.</li>
              <li><strong>Signature:</strong> 10 KB to 20 KB. Capital letters / block signature is strictly prohibited and leads to rejection.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
