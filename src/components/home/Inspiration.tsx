const Inspiration = () => {
  return (
    <section className="py-24 px-4 bg-muted/20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2 -z-10"></div>
      
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          <div className="md:w-1/2 space-y-8 animate-fade-in">
            <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">Inspire-se com os <br />Melhores Estilos</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              As tranças são mais que um penteado, são uma expressão de arte e cultura. Nossa plataforma celebra essa beleza conectando você às melhores artistas da região.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft transform hover:scale-105 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop" 
                    alt="Estilo de trança" 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4 bg-background/50 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                  <p className="font-medium text-sm text-center italic">"O cabelo é a coroa que você nunca tira."</p>
                </div>
              </div>
              
              <div className="space-y-6 translate-y-12">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft transform hover:scale-105 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600&auto=format&fit=crop" 
                    alt="Detalhe de trança" 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div className="aspect-square rounded-full bg-primary/20 animate-pulse blur-2xl"></div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative mt-16 md:mt-0">
            <div className="aspect-square rounded-full bg-primary/10 absolute -top-20 -right-20 w-80 h-80 -z-10 blur-3xl animate-pulse"></div>
            <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-glow max-w-sm mx-auto transform -rotate-3 hover:rotate-0 transition-all duration-1000 group">
              <img 
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop" 
                alt="Trancista profissional" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white font-medium text-lg">Encontre sua próxima transformação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;