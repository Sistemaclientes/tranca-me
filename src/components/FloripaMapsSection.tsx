import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const FloripaMapsSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-48.5482, -27.5969], // Grande Florianópolis
      zoom: 10,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Adicionar marcadores para áreas de cobertura
    const locations = [
      { name: 'Florianópolis', coords: [-48.5482, -27.5969] },
      { name: 'São José', coords: [-48.6334, -27.5974] },
      { name: 'Palhoça', coords: [-48.6667, -27.6447] },
      { name: 'Biguaçu', coords: [-48.6550, -27.4950] },
    ];

    locations.forEach(location => {
      new mapboxgl.Marker({ color: '#8B5CF6' })
        .setLngLat(location.coords as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<strong>${location.name}</strong><br>Área de cobertura`)
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [tokenSubmitted, mapboxToken]);

  const handleSubmitToken = () => {
    if (mapboxToken.trim()) {
      setTokenSubmitted(true);
    }
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cobertura na Grande Florianópolis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Atendemos profissionais e clientes em Florianópolis, São José, Palhoça, 
            Biguaçu e região. Veja no mapa nossa área de cobertura.
          </p>
        </div>

        {!tokenSubmitted ? (
          <Card className="max-w-md mx-auto p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Mapbox Token (necessário para visualizar o mapa)
                </label>
                <Input
                  type="text"
                  placeholder="Cole seu Mapbox public token aqui"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Obtenha seu token gratuito em{' '}
                  <a 
                    href="https://mapbox.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
              <Button onClick={handleSubmitToken} className="w-full">
                Carregar Mapa
              </Button>
            </div>
          </Card>
        ) : (
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        )}
      </div>
    </section>
  );
};

export default FloripaMapsSection;
