import '@google/model-viewer';

const ModelViewer = () => {
    return (
        <model-viewer
            src="/spider.glb"
            alt="A 3D model"
            auto-rotate
            camera-controls
            ar
            ar-modes="webxr scene-viewer quick-look"
            style={{ width: '100%', height: '500px' }}
            autoplay
            animation-name="attack1"
        />
    );
}
export default ModelViewer;
