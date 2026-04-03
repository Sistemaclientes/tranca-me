import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  // Split images: first 3 shown in grid, rest in carousel
  const gridImages = images.slice(0, 3);
  const carouselImages = images.slice(3);

  return (
    <>
      {/* First 3 images in grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gridImages.map((image, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`${title} - Foto ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Remaining images in carousel */}
      {carouselImages.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3">
            Mais fotos ({carouselImages.length})
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openLightbox(index + 3)}
                  >
                    <img
                      src={image}
                      alt={`${title} - Foto ${index + 4}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      )}

      <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {selectedIndex !== null && (
              <>
                <img
                  src={images[selectedIndex]}
                  alt={`${title} - Foto ${selectedIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />

                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                      {selectedIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
