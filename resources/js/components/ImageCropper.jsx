import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

// Helper: mengubah hasil crop menjadi File object
const createCroppedImage = (imageSrc, pixelCrop, rotation = 0) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const radians = (rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(radians));
            const cos = Math.abs(Math.cos(radians));
            const newWidth = image.width * cos + image.height * sin;
            const newHeight = image.width * sin + image.height * cos;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.translate(newWidth / 2, newHeight / 2);
            ctx.rotate(radians);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);

            // Buat canvas kedua untuk hasil crop
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');
            cropCanvas.width = pixelCrop.width;
            cropCanvas.height = pixelCrop.height;

            cropCtx.drawImage(
                canvas,
                pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
                0, 0, pixelCrop.width, pixelCrop.height
            );

            cropCanvas.toBlob((blob) => {
                const file = new File([blob], 'cropped-profile.jpg', { type: 'image/jpeg' });
                resolve({ file, url: URL.createObjectURL(blob) });
            }, 'image/jpeg', 0.92);
        };
    });
};

export default function ImageCropper({ imageSrc, onCropDone, onCancel, aspectRatio = 1, cropShape = 'round' }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (croppedAreaPixels) {
            const result = await createCroppedImage(imageSrc, croppedAreaPixels, rotation);
            onCropDone(result);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Sesuaikan Foto Profil</h3>
                    <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                        <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="relative w-full h-72 sm:h-80 bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        cropShape={cropShape}
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Controls */}
                <div className="px-5 py-4 space-y-3">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-3">
                        <ZoomOut className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-slate-700 accent-[#8B5E3C] cursor-pointer"
                        />
                        <ZoomIn className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
                    </div>

                    {/* Rotate Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setRotation((r) => (r + 90) % 360)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                        >
                            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                            Putar 90°
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#8B5E3C] hover:bg-[#7A5234] rounded-xl shadow-sm transition inline-flex items-center justify-center"
                    >
                        <Check className="w-4 h-4 mr-1.5" />
                        Gunakan Foto
                    </button>
                </div>
            </div>
        </div>
    );
}
