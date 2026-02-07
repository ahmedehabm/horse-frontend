// features/Stream/StreamModal.tsx
import { useCallback, useEffect, useState } from "react";
import { FaStop, FaExpand, FaCompress } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Horse } from "@/types";
import { SOCKET_URL } from "@/constants";

interface StreamModalProps {
  horse: Horse;
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStopStream: () => void;
}

export default function StreamModal({
  horse,
  token,
  open,
  onOpenChange,
  onStopStream,
}: StreamModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const streamUrl = `${SOCKET_URL}/stream/${token}`;

  const toggleFullscreen = useCallback(() => {
    const videoContainer = document.getElementById("stream-container");

    if (!document.fullscreenElement && videoContainer) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Reset error state when modal opens
  useEffect(() => {
    if (open) {
      setStreamError(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <img
                src={horse.image}
                alt={horse.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-semibold">{horse.name}</span>
              <span className="ml-2 text-xs font-medium text-red-500 uppercase tracking-wider">
                ● Live
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Live stream from {horse.camera?.thingName || "camera"}
          </DialogDescription>
        </DialogHeader>

        {/* Video Container */}
        <div
          id="stream-container"
          className="relative bg-black aspect-video w-full"
        >
          {/*  MJPEG Stream using <img> tag */}
          {streamError ? (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <p className="text-xl mb-2">⚠️ Stream Unavailable</p>
                <p className="text-sm text-white/60">Unable to load stream</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setStreamError(false)}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <img
              src={streamUrl}
              alt={`${horse.name} Live Stream`}
              className="w-full h-full object-contain"
              onError={() => {
                console.error("Stream error for:", streamUrl);
                setStreamError(true);
              }}
              onLoad={() => {
                console.log("Stream loaded:", streamUrl);
              }}
            />
          )}

          {/* Video Controls Overlay */}
          {!streamError && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <FaCompress className="h-4 w-4" />
                    ) : (
                      <FaExpand className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 pt-2 flex items-center justify-between border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              Token: {token.slice(-8)}
            </span>
          </div>

          <Button
            variant="destructive"
            onClick={onStopStream}
            className="gap-2"
          >
            <FaStop className="h-3 w-3" />
            Stop Stream
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
