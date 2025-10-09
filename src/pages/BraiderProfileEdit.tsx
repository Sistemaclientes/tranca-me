import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cities, neighborhoodsByCity } from "@/data/braiders";
import { LogOut } from "lucide-react";

const BraiderProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    instagram: "",
    facebook: "",
    description: "",
    city: "",
    neighborhood: "",
    services: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
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
      .single();

    if (profile) {
      setFormData({
        name: profile.name || "",
        whatsapp: profile.whatsapp || "",
        email: profile.email || "",
        instagram: profile.instagram || "",
        facebook: profile.facebook || "",
        description: profile.description || "",
        city: profile.city || "",
        neighborhood: profile.neighborhood || "",
        services: profile.services?.join(", ") || "",
      });
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;

    const servicesArray = formData.services.split(",").map(s => s.trim()).filter(Boolean);

    const profileData = {
      user_id: userId,
      name: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      instagram: formData.instagram,
      facebook: formData.facebook,
      description: formData.description,
      city: formData.city,
      neighborhood: formData.neighborhood,
      services: servicesArray,
    };

    const { error } = await supabase
      .from("braider_profiles")
      .upsert(profileData, { onConflict: "user_id" });

    if (error) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil salvo!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
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
        <div className="container mx-auto max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display text-3xl font-bold">Meu Perfil</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <Card className="bg-gradient-card border-none shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="services">Serviços (separados por vírgula) *</Label>
                  <Input
                    id="services"
                    placeholder="Box Braids, Nagô, Twist, Dreadlocks"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte um pouco sobre sua experiência e estilo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={5}
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  Salvar Perfil
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BraiderProfileEdit;
