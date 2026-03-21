import React, { useRef } from 'react';

const FileActions = ({ onUpload, onDownloadRequest }) => {
    const fileInputRef = useRef(null);

    // 处理下载
    const handleDownload = () => {
        const coords = onDownloadRequest(); // 获取坐标数组
        const blob = new Blob([JSON.stringify(coords, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `my-grid-layout.json`;
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