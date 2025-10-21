'use client';

import { useMemo, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import { X, FileText } from 'lucide-react';

type Location = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  pdfUrl: string;
};

// Estilo de mapa con terreno monta�oso - Outdoors de Maptiler
const MAP_STYLE = 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL';

// Coordenadas de Rionegro, Antioquia, Colombia
const LOCATIONS: Location[] = [
  {
    id: 'rionegro',
    name: 'Rionegro',
    description: 'Rionegro, Antioquia, Colombia',
    latitude: 6.1549,
    longitude: -75.3736,
    pdfUrl: 'https://docs.google.com/document/d/18uNkEVXedC7iBegmyYoTI8CMcqA11J3r/edit#bookmark=id.hw5gvadvefes'
  }
];

export default function PoliticaPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const selectedLocation = useMemo(
    () => LOCATIONS.find((location) => location.id === selectedLocationId) ?? null,
    [selectedLocationId],
  );

  const handlePdfOpen = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <main className="relative h-[100dvh] w-full flex">
      {/* Sidebar con PDFs */}
      <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Pol�tica</h1>
          <p className="text-sm text-gray-500 mt-1">Documentos y ubicaciones</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* PDF General */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              PDF General
            </h3>
            <button
              onClick={() => handlePdfOpen('https://docs.google.com/document/d/1Wf_lZjPJNcrCGtLND43f4lXEwG2hoMT6/edit')}
              className="w-full mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Abrir documento
            </button>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Ubicaciones */}
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-3">Ubicaciones</h2>
            <div className="space-y-2">
              {LOCATIONS.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedLocationId === location.id
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`min-w-2 min-h-2 rounded-full mt-1.5 ${
                      selectedLocationId === location.id ? 'bg-blue-400' : 'bg-blue-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm truncate ${
                        selectedLocationId === location.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {location.name}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        selectedLocationId === location.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {location.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mapa */}
      <div className="flex-1 ml-80">
        <Map
          initialViewState={{
            longitude: -75.3736,
            latitude: 6.1549,
            zoom: 12,
          }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onClick={() => setSelectedLocationId(null)}
        >
          <NavigationControl position="top-left" />
          {LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setSelectedLocationId(location.id);
              }}
            >
              <button
                type="button"
                className="grid min-h-6 min-w-6 place-items-center rounded-full bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-transform hover:scale-110"
              >
                <span className="sr-only">{location.name}</span>
                <span className="h-3 w-3 rounded-full bg-white" />
              </button>
            </Marker>
          ))}
          {selectedLocation ? (
            <Popup
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              anchor="top"
              closeButton={false}
              closeOnClick={false}
              onClose={() => setSelectedLocationId(null)}
              focusAfterOpen={false}
              className="min-w-96"
            >
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedLocation.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedLocation.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLocationId(null)}
                    className="ml-4 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    Documento PDF
                  </h3>
                  <button
                    onClick={() => handlePdfOpen(selectedLocation.pdfUrl)}
                    className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Abrir PDF en nueva ventana
                  </button>
                </div>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>
    </main>
  );
}
