import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { Download, QrCode, Palette } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

function App() {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (qrRef.current) {
      const dataUrl = await htmlToImage.toPng(qrRef.current);
      const link = document.createElement('a');
      link.download = 'artistic-qrcode.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <QrCode size={48} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">艺术二维码生成器</h1>
          <p className="text-gray-600">免费在线生成各种艺术二维码</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-8">
            {/* Input Section */}
            <div className="space-y-2">
              <label htmlFor="qr-content" className="block text-sm font-medium text-gray-700">
                二维码内容
              </label>
              <div className="relative">
                <input
                  id="qr-content"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="在此输入二维码内容"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Color Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">颜色设置</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    二维码颜色
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-12 w-24 cursor-pointer rounded-lg border-0"
                    />
                    <span className="text-sm font-mono text-gray-600 bg-white px-3 py-1 rounded-md shadow-sm">
                      {fgColor.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    背景颜色
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-12 w-24 cursor-pointer rounded-lg border-0"
                    />
                    <span className="text-sm font-mono text-gray-600 bg-white px-3 py-1 rounded-md shadow-sm">
                      {bgColor.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Preview Section */}
            <div className="flex flex-col items-center pt-4">
              <div 
                ref={qrRef} 
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: bgColor }}
              >
                <QRCode
                  value={text || 'Example'}
                  size={280}
                  level="Q"
                  includeMargin={true}
                  renderAs="svg"
                  fgColor={fgColor}
                  bgColor={bgColor}
                />
              </div>
              <button
                onClick={handleDownload}
                disabled={!text}
                className="mt-8 flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                <Download size={20} />
                下载二维码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;