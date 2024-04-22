import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from './Canvas';
import { SketchPicker } from 'react-color'
interface colorData {
    hex: string
}
const CanvasComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captionText, setCaptionText] = useState<string>('1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs');
    const [ctaText, setCTAText] = useState<string>('Shop Now');
    const [backgroundColor, setBackgroundColor] = useState<string>('#0369A1');
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
    const [captionTextColor, setCaptionTextColor] = useState<string>('#FFFFFF');
    const [captionFontSize, setCaptionFontSize] = useState<number>(44);
    const [captionAlignment, setCaptionAlignment] = useState<CanvasTextAlign>('left');
    const [captionXPosition, setCaptionXPosition] = useState<number>(50);
    const [captionYPosition, setCaptionYPosition] = useState<number>(50);
    const [ctaTextColor, setCTATextColor] = useState<string>('#FFFFFF');
    const [ctaFontSize, setCTAFontSize] = useState<number>(30);
    const [ctaXPosition, setCTAXPosition] = useState<number>(190);
    const [ctaYPosition, setCTAYPosition] = useState<number>(320);
    const [recentColor, setRecentColor] = useState<string[]>([]);
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const openEyeDropper = async (): Promise<void> => {
        if ("EyeDropper" in window) {
            const eyeDropper = new window.EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            setBackgroundColor(sRGBHex);
        }
    };

    const recentColorHandler = () => {
        const newRecentColor = recentColor.slice();
        if (backgroundColor !== "" && !newRecentColor.includes(backgroundColor)) {
            if (newRecentColor.length >= 5) {
                newRecentColor.pop();
            }
            newRecentColor.unshift(backgroundColor);
            setRecentColor(newRecentColor);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasObj = new Canvas(canvas);

        const templateData = {
            caption: {
                text: captionText,
                position: { x: captionXPosition, y: captionYPosition },
                max_characters_per_line: 31,
                font_size: captionFontSize,
                alignment: captionAlignment,
                text_color: captionTextColor,
            },
            cta: {
                text: ctaText,
                position: { x: ctaXPosition, y: ctaYPosition },
                text_color: ctaTextColor,
                background_color: '#000000',
            },
            image_mask: { x: 56, y: 442, width: 970, height: 600 },
            urls: {
                mask: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png',
                stroke: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png',
                design_pattern: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png',
            },
        };

        canvasObj.drawBackground(backgroundColor);
        canvasObj.drawPattern(templateData.urls.design_pattern);
        canvasObj.drawText(
            templateData.caption.text,
            templateData.caption.position.x,
            templateData.caption.position.y,
            templateData.caption.text_color,
            templateData.caption.font_size,
            templateData.caption.alignment,
            templateData.caption.max_characters_per_line
        );
        canvasObj.drawCTA(
            templateData.cta.text,
            templateData.cta.position.x,
            templateData.cta.position.y,
            templateData.cta.text_color,
            templateData.cta.background_color,
            200,
            50
        );

        // canvasObj.drawMaskStroke(
        //     templateData.urls.stroke,
        //     templateData.image_mask.x,
        //     templateData.image_mask.y,
        //     templateData.image_mask.width,
        //     templateData.image_mask.height
        // );

        if (selectedImage) {
            canvasObj.drawImageWithinMask(
                selectedImage,
                templateData.image_mask.x,
                templateData.image_mask.y,
                templateData.image_mask.width,
                templateData.image_mask.height
            );
        }
    }, [captionText, ctaText, backgroundColor, selectedImage, captionTextColor, captionFontSize, captionAlignment, captionXPosition, captionYPosition, ctaXPosition, ctaYPosition, ctaTextColor]);

    const handleChangeComplete = (color: colorData) => {
        setBackgroundColor(color.hex);
    };
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const image = new Image();
                image.src = event.target?.result as string;
                image.onload = () => {
                    setSelectedImage(image);
                };
                image.onerror = () => {
                    throw new Error('Failed to load image');
                };
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
        }
    };

    return (
        <div className='flex justify-around h-screen gap-5'>
            <div className='w-1/2 bg-gray-200 flex-1 flex'>
            <canvas
                ref={canvasRef}
                width={1080}
                height={1080}
                className='w-[400px] h-[400px] m-auto '
            ></canvas>
            </div>
            <div className='border m-4 rounded border-black flex flex-col items-start w-1/2 p-4 space-y-4'>
                <div>
                    <input type="file" accept="image/*" onChange={handleImageSelect} />
                </div>
                <div>
                    <label>Caption Text:</label>
                    <input type="text" value={captionText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCaptionText(e.target.value);
                    }} />
                </div>
                <div>
                    <label>Caption Color:</label>
                    <input type="color" value={captionTextColor} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCaptionTextColor(e.target.value);
                    }} />
                </div>
                <div>
                    <label>Font Size:</label>
                    <input type="number" value={captionFontSize.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setCaptionFontSize(parseInt(e.target.value)) }} />
                </div>
                <div>
                    <label>Alignment:</label>
                    <select value={captionAlignment} onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                        setCaptionAlignment(e.target.value as CanvasTextAlign);
                    }}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div>
                    <label>Caption Position:</label>
                    <input type="number" className='border' value={captionXPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCaptionXPosition(parseInt(e.target.value));
                    }} />
                    BY

                    <input type="number" className='border' value={captionYPosition.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCaptionYPosition(parseInt(e.target.value))
                    }} />
                </div>
                <div>
                    <label>CTA Text:</label>
                    <input type="text" value={ctaText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTAText(e.target.value);
                    }} />
                </div>
                <div>
                    <label>Text Color:</label>
                    {/* <SketchPicker color={ctaTextColor} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTATextColor(e.target.value)}} /> */}
                    <input type="color" value={ctaTextColor} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTATextColor(e.target.value);
                    }} />
                </div>
                <div>
                    <label>Font Size:</label>
                    <input type="number" value={ctaFontSize.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTAFontSize(parseInt(e.target.value));
                    }} />
                </div>
                <div className=''>
                    <label>CTA Position:</label>
                    <input type="number" className='border w-max' size={5} value={ctaXPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTAXPosition(parseInt(e.target.value));
                    }} />
                    BY
                    <input type="number" className='border' size={5} value={ctaYPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setCTAYPosition(parseInt(e.target.value));
                    }} />
                </div>
                <div className="">
                    <h1 className="text-slate-500 text-sm font-bold">Choose your color </h1>
                    <div className="flex mt-2 ">
                        {recentColor.map((c, ind) => (
                            <div
                                key={ind}
                                onClick={() => setBackgroundColor(c)}
                                style={{ backgroundColor: c, border: "1px solid black" }}
                                className="w-7 mr-2 h-7 text-lg font-bold rounded-full cursor-pointer text-center"
                            />
                        ))}
                        <div
                            className="w-7 h-7 text-lg font-bold bg-slate-100  rounded-full cursor-pointer text-center"
                            onClick={() => setShowPicker(true)}
                        >
                            +
                        </div>
                        {showPicker && (
                            <div className="absolute z-10">
                                <div
                                    onClick={() => {
                                        setShowPicker(false);
                                        recentColorHandler();
                                    }}
                                    className="fixed top-0 left-0 bottom-0 right-0 z-0"
                                />
                                <SketchPicker color={backgroundColor} onChange={handleChangeComplete} />
                                <div
                                    className="w-full border-2 bg-white border-slate-300 h-10 font-mono text-xs font-bold text-center pt-2 cursor-pointer z-20 absolute"
                                    onClick={openEyeDropper}
                                >
                                    Pick color from this page
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanvasComponent;
