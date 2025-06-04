export function ProjectVideo() {
  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-secondary/20">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/your-video-id"
        title="Project Demo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}