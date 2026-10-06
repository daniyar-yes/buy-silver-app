import { useRef, useEffect, useState } from 'react'

const DrawingTool = () => {

    const [isDrawing, setIsDrawing] = useState(false);
    const [imgSrcFromCanvas, setImgSrcFromCanvas] = useState('')
    // 1. Create a reference to hold the DOM node of the canvas
    const canvasRef = useRef(null);

    useEffect(() => {
        // 2. Ensure the canvas element exists in the DOM
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 3. Extract the 2D rendering context
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 4. Use standard standard Canvas 2D API methods to draw

        ctx.strokeStyle = '#093dda'; // Black ink
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';


    }, [])


    // Mouse Actions
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        captureContent(); // Log and save content when user lifts mouse
    };

    const captureContent = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData.data);

        const dataURL = canvas.toDataURL('image/png');
        setImgSrcFromCanvas(dataURL)
    };



    return (
        <>
            <canvas
                ref={canvasRef}
                style={{ border: '3px solid black' }}
                width='600px'
                height='400px'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />

            {!!imgSrcFromCanvas && <img src={imgSrcFromCanvas} />}

            <div>
                <h3>Exported Image Content Snippet:</h3>
                <textarea
                    value={imgSrcFromCanvas}
                    readOnly
                    rows={5}
                    style={{ width: '300px', fontFamily: 'monospace' }}
                    placeholder="Draw on canvas to see Base64 string..."
                />
                {imgSrcFromCanvas && <p><em>Canvas converted to a compressed string asset!</em></p>}
            </div>
        </>
    )
}

export default DrawingTool