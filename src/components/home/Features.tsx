import { Search, Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Search className="h-7 w-7 text-primary" />,
      title: "Busque por Região",
      description: "Encontre trancistas qualificadas perto de você usando nosso sistema de busca inteligente por cidade e bairro",
      bgColor: "bg-primary/10",
      delay: "animate-delay-100"
    },
    {
      icon: <Star className="h-7 w-7 text-secondary" />,
      title: "Veja Avaliações",
      description: "Confira fotos de trabalhos anteriores e avaliações de outros clientes para escolher a melhor profissional",
      bgColor: "bg-secondary/10",
      delay: "animate-delay-200"
    },
    {
      icon: <MapPin className="h-7 w-7 text-primary" />,
      title: "Conecte-se Fácil",
      description: "Entre em contato direto via WhatsApp ou Instagram e agende seu horário com praticidade",
      bgColor: "bg-primary/10",
      delay: "animate-delay-300"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display text-4xl font-bold">Como Funciona</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Nossa plataforma foi criada para facilitar a conexão entre profissionais e clientes de forma simples e segura
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-500 animate-fade-in group">
              <CardContent className="p-10 space-y-6 text-center">
                <div className={`h-16 w-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mx-auto transition-transform group-hover:scale-110 duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;