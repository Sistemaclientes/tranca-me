import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cities, neighborhoodsByCity } from "@/data/braiders";
import { Upload, X, Loader2 } from "lucide-react";
import SuggestCityDialog from "@/components/SuggestCityDialog";
import SuggestNeighborhoodDialog from "@/components/SuggestNeighborhoodDialog";
import { compressImage } from "@/lib/image-utils";

const BraiderProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    professionalName: "",
    whatsapp: "",
    email: "",
    instagram: "",
    facebook: "",
    description: "",
    city: "",
    neighborhood: "",
    services: "",
    pricing: "",
  });
  
  const [uploading, setUploading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [presentationVideo, setPresentationVideo] = useState<File | null>(null);

  useEffect(() => {
    checkUser();

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Checking user timed out");
        setLoading(false);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout);
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);
      setFormData(prev => ({ ...prev, email: session.user.email || "" }));

      // Load existing profile if exists
      const { data: profile } = await supabase
        .from("braider_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        setFormData({
          name: profile.name || "",
          professionalName: profile.professional_name || "",
          whatsapp: formatPhoneNumber(profile.whatsapp || ""),
          email: profile.email || "",
          instagram: profile.instagram || "",
          facebook: profile.facebook || "",
          description: profile.description || "",
          city: profile.city || "",
          neighborhood: profile.neighborhood || "",
          services: profile.services?.join(", ") || "",
          pricing: profile.pricing || "",
        });
        
        if (profile.image_url) {
          setProfilePhotoPreview(profile.image_url);
        }
        
        if (profile.gallery_urls && profile.gallery_urls.length > 0) {
          setGalleryPreviews(profile.gallery_urls);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    if (phoneNumberLength < 11) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7
    )}-${phoneNumber.slice(7, 11)}`;
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryPhotos(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPresentationVideo(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    // Compress image if it's an image file
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      console.log(`Comprimindo imagem ${file.name}...`);
      fileToUpload = await compressImage(file);
      // Ensure extension is .webp if it was converted
      if (fileToUpload.type === 'image/webp' && !path.endsWith('.webp')) {
        path = path.replace(/\.[^/.]+$/, "") + ".webp";
      }
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileToUpload, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;

    setUploading(true);
    console.log("Iniciando salvamento do perfil...");

    try {
      let imageUrl = profilePhotoPreview;
      if (imageUrl && imageUrl.startsWith('blob:')) {
        imageUrl = ""; // Don't save blob URLs
      }
      
      let videoUrl = null;
      let galleryUrls = galleryPreviews.filter(url => url && typeof url === 'string' && url.startsWith('http'));

      // Upload profile photo
      if (profilePhoto) {
        console.log("Fazendo upload da foto de perfil...");
        const photoPath = `${userId}/profile-${Date.now()}.jpg`;
        imageUrl = await uploadFile(profilePhoto, 'profile-photos', photoPath);
      }

      // Upload gallery photos
      if (galleryPhotos.length > 0) {
        console.log(`Fazendo upload de ${galleryPhotos.length} fotos da galeria...`);
        for (const photo of galleryPhotos) {
          const galleryPath = `${userId}/gallery-${Date.now()}-${Math.random()}.jpg`;
          const url = await uploadFile(photo, 'gallery-photos', galleryPath);
          galleryUrls.push(url);
        }
      }

      // Upload presentation video
      if (presentationVideo) {
        console.log("Fazendo upload do vídeo...");
        const videoPath = `${userId}/video-${Date.now()}.mp4`;
        videoUrl = await uploadFile(presentationVideo, 'presentation-videos', videoPath);
      }

      const servicesArray = formData.services.split(",").map(s => s.trim()).filter(Boolean);

      const profileData = {
        user_id: userId,
        name: formData.name,
        professional_name: formData.professionalName,
        whatsapp: formData.whatsapp.replace(/\D/g, ""), // Save only digits
        email: formData.email,
        instagram: formData.instagram,
        facebook: formData.facebook,
        description: formData.description,
        city: formData.city,
        neighborhood: formData.neighborhood,
        services: servicesArray,
        pricing: formData.pricing,
        image_url: imageUrl,
        gallery_urls: galleryUrls,
        video_url: videoUrl,
      };

      console.log("Dados do perfil a serem salvos:", profileData);

      const { data, error } = await supabase
        .from("braider_profiles")
        .upsert(profileData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) {
        console.error("Erro no upsert:", error);
        toast({
          title: "Erro ao salvar perfil",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Perfil salvo com sucesso!", data);
        toast({
          title: "Perfil salvo com sucesso!",
          description: "Redirecionando...",
        });
        
        // Redirect to the profile page directly to show it's saved
        setTimeout(() => {
          navigate(`/trancista/${data.id}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Exceção no handleSubmit:", error);
      toast({
        title: "Erro no processamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold text-primary mb-4">
              Cadastre-se como Trancista
            </h1>
            <div className="bg-gradient-card p-6 rounded-lg shadow-soft max-w-3xl mx-auto">
              <p className="text-sm leading-relaxed text-gray-700">
                Ao preencher este formulário, você criará seu <strong>perfil profissional completo</strong> na plataforma.
                Inclua todas as informações necessárias: nome, localização, descrição dos serviços, valores, 
                foto de perfil, galeria de trabalhos e vídeo de apresentação (opcional).
              </p>
              <p className="text-sm leading-relaxed text-gray-700 mt-3">
                Após enviar, o sistema criará automaticamente sua <strong>página individual</strong>, 
                onde você poderá visualizar suas informações, fotos e avaliações. 
                Você também poderá <strong>editar e atualizar seu perfil</strong> sempre que desejar.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-primary">Informações Pessoais</CardTitle>
                <CardDescription>Dados básicos sobre você</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalName">Nome Profissional</Label>
                    <Input
                      id="professionalName"
                      value={formData.professionalName}
                      onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
                      placeholder="Como você é conhecida"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-primary">Localização</CardTitle>
                <CardDescription>Onde você atende</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value, neighborhood: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Select
                      value={formData.neighborhood}
                      onValueChange={(value) => setFormData({ ...formData, neighborhood: value })}
                      disabled={!formData.city}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o bairro" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.city && neighborhoodsByCity[formData.city]?.map((neighborhood) => (
                          <SelectItem key={neighborhood} value={neighborhood}>
                            {neighborhood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SuggestCityDialog />
                  <SuggestNeighborhoodDialog cityName={formData.city} />
                </div>

                <p className="text-xs text-muted-foreground">
                  Não encontrou sua cidade ou bairro? Use os botões acima para sugerir. 
                  Sua sugestão será avaliada por um administrador.
                </p>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-primary">Informações de Contato</CardTitle>
                <CardDescription>Como os clientes podem te encontrar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: formatPhoneNumber(e.target.value) })}
                      maxLength={15}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@seu_instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="seu.facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Serviços e Valores */}
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-primary">Serviços e Valores</CardTitle>
                <CardDescription>Informações sobre seus serviços</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição sobre você e seus serviços *</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte sobre sua experiência, estilo e diferenciais..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Tipos de Tranças Oferecidas (separados por vírgula) *</Label>
                  <Input
                    id="services"
                    placeholder="Box Braids, Nagô, Twist, Dreadlocks"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing">Valores</Label>
                  <Textarea
                    id="pricing"
                    placeholder="Ex: Box Braids - R$ 200,00\nNagô - R$ 150,00\nTwist - R$ 180,00"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fotos e Vídeo */}
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-primary">Fotos e Vídeo</CardTitle>
                <CardDescription>Imagens e vídeo de apresentação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Foto Principal do Perfil</Label>
                  <div className="flex items-center gap-4">
                    {profilePhotoPreview && (
                      <img 
                        src={profilePhotoPreview} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Photos */}
                <div className="space-y-2">
                  <Label htmlFor="galleryPhotos">Galeria de Trabalhos</Label>
                  <Input
                    id="galleryPhotos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryPhotosChange}
                    className="cursor-pointer"
                  />
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryPhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Presentation Video */}
                <div className="space-y-2">
                  <Label htmlFor="presentationVideo">Vídeo de Apresentação (opcional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="presentationVideo"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="cursor-pointer"
                    />
                    {presentationVideo && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        {presentationVideo.name}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero" 
              className="w-full h-12 text-lg"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Criar Meu Perfil Profissional"
              )}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BraiderProfileEdit;
