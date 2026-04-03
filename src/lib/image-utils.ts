import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1, // Max size 1MB
    maxWidthOrHeight: 1200, // Max dimension 1200px
    useWebWorker: true,
    fileType: "image/webp", // Convert to WebP
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Rename file to have .webp extension
    const fileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
    return new File([compressedFile], fileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Erro ao comprimir imagem:", error);
    return file; // Return original if fails
  }
};

/**
 * Gets a transformed Supabase Storage URL (if transformations are supported)
 * Otherwise returns the standard public URL
 */
export const getOptimizedImageUrl = (url: string, width = 800, height?: number) => {
  if (!url || !url.includes('storage.googleapis.com') && !url.includes('supabase.co')) return url;
  
  // If it's a Supabase URL, we can append transformation parameters
  // Note: This requires a Supabase Pro plan or a project that supports it
  // Example format: .../object/public/bucket/path?width=800&height=600&quality=80&format=webp
  const separator = url.includes('?') ? '&' : '?';
  const heightParam = height ? `&height=${height}` : '';
  
  return `${url}${separator}width=${width}${heightParam}&quality=80&format=webp`;
};
