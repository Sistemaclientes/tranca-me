import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Clock, Award } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Tranças Africanas: Do Zero ao Profissional",
    description: "Aprenda as técnicas fundamentais para iniciar sua carreira como trancista.",
    duration: "40 horas",
    level: "Iniciante",
    price: "R$ 297,00",
    image: "https://images.unsplash.com/photo-1595475241949-0f0240ee8261?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Técnicas de Mega Hair em Tranças",
    description: "Aperfeiçoe-se nas técnicas de extensão e volumização capilar.",
    duration: "25 horas",
    level: "Intermediário",
    price: "R$ 197,00",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Gestão e Marketing para Trancistas",
    description: "Como gerenciar seu salão e atrair mais clientes pelas redes sociais.",
    duration: "15 horas",
    level: "Todos os níveis",
    price: "R$ 147,00",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
  },
];

const Cursos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
              Aprenda com Especialistas
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Invista na sua carreira com nossos cursos especializados para trancistas.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {course.level}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Videoaulas
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 pt-4">
                  <span className="text-lg font-bold text-primary">{course.price}</span>
                  <Button size="sm">Saber Mais</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <section className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
            <GraduationCap className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Acesso Vitalício</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Todos os nossos cursos oferecem acesso vitalício e certificado de conclusão.
              Aprenda no seu ritmo e melhore suas habilidades profissionais.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium">Certificado Incluso</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium">Material de Apoio</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-8 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Braider Hub. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Cursos;
