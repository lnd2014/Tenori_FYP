import React, { useRef, useState } from 'react';

const FileActions = ({ onUpload, onDownloadRequest }) => {
    const fileInputRef = useRef(null);
    // 新增状态：存储用户输入的文件名，默认为 'my-grid-layout'
    const [fileName, setFileName] = useState('my-grid-layout');


    // 处理下载
    const handleDownload = () => {
        const coords = onDownloadRequest();

        // 2. 处理文件名：确保文件名不为空，并自动处理后缀
        // 如果用户没填，则使用默认名；去除首尾空格
        const finalName = fileName.trim() || 'untitled-grid';

        const blob = new Blob([JSON.stringify(coords, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        // 3. 使用用户定义的文件名进行下载
        a.download = `${finalName}.json`;

        a.click();
        URL.revokeObjectURL(url);
    };
        
    // 处理上传
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    onUpload(data); // 直接复用父组件的加载逻辑
                }
            } catch (err) {
                console.error("文件解析失败", err);
            }
        };
        reader.readAsText(file);
        e.target.value = null; // 重置以便下次上传
    };

    return (
        <div className="flex gap-4 mt-4">
            {/* 文件名输入区域 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50 uppercase tracking-wider">Filename:</span>
        <input 
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter filename..."
          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-accent/50 w-48"
        />
      </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">
                UPLOAD GRID
            </button>
            <button onClick={handleDownload} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">
                DOWNLOAD GRID
            </button>
        </div>
    );
};
export default FileActions;