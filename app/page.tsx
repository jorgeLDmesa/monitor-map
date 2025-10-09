'use client';

import { useMemo, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import { X } from 'lucide-react';

type PlagueReport = {
  id: string;
  date: string;
  description: string;
  images: string[];
};

type Farm = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  reports: PlagueReport[];
};

type GoogleSheetReport = {
  id: string;
  date: string;
  location: string;
  description: string;
};

// Estilo de mapa con terreno montañoso - Outdoors de Maptiler
const MAP_STYLE = 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL';

const FARMS: Farm[] = [
  {
    id: 'finca-esperanza',
    name: 'Finca La Esperanza',
    description: 'Cultivo de aguacate y café orgánico en las montañas de Jericó',
    latitude: 5.7964,
    longitude: -75.7821,
    reports: [
      {
        id: 'rep-1',
        date: '2025-03-15',
        description: 'Detección de agallas en hojas de aguacate. Se observa deformación significativa en el follaje joven.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      },
      {
        id: 'rep-2',
        date: '2025-06-22',
        description: 'Monitoreo de seguimiento. Las agallas se han extendido a más árboles del cultivo.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      },
      {
        id: 'rep-3',
        date: '2025-09-08',
        description: 'Aplicación de tratamiento biológico. Se observa reducción en la formación de nuevas agallas.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      }
    ]
  },
  {
    id: 'finca-mirador',
    name: 'Finca El Mirador',
    description: 'Producción de aguacate Hass con vista panorámica del valle',
    latitude: 5.7887,
    longitude: -75.7693,
    reports: [
      {
        id: 'rep-4',
        date: '2025-04-12',
        description: 'Primera aparición de plagas en cultivo de aguacate. Daño inicial en hojas superiores.',
        images: ['/plaga-aguacate.jpg', '/agalla-aguacate.jpeg']
      },
      {
        id: 'rep-5',
        date: '2025-07-19',
        description: 'Incremento en la población de plagas. Se requiere intervención inmediata.',
        images: ['/plaga-aguacate.jpg', '/agalla-aguacate.jpeg']
      },
      {
        id: 'rep-6',
        date: '2025-10-03',
        description: 'Control efectivo de plagas mediante manejo integrado. Mejora notable en la salud del cultivo.',
        images: ['/plaga-aguacate.jpg', '/agalla-aguacate.jpeg']
      }
    ]
  },
  {
    id: 'finca-san-rafael',
    name: 'Finca San Rafael',
    description: 'Cultivo diversificado con aguacate, plátano y especies nativas',
    latitude: 5.8041,
    longitude: -75.7755,
    reports: [
      {
        id: 'rep-7',
        date: '2025-02-28',
        description: 'Evaluación fitosanitaria rutinaria. Detección temprana de formación de agallas.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      },
      {
        id: 'rep-8',
        date: '2025-08-14',
        description: 'Monitoreo post-tratamiento. Las medidas preventivas han sido efectivas.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      },
      {
        id: 'rep-9',
        date: '2025-11-25',
        description: 'Inspección final del año. El cultivo muestra excelente estado sanitario.',
        images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
      }
    ]
  }
];

export default function Home() {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dynamicReports, setDynamicReports] = useState<GoogleSheetReport[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        setDynamicReports(data.reports || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const allFarms = useMemo(() => {
    const dynamicFarms: Farm[] = dynamicReports.map((report, index) => ({
      id: `dynamic-${report.id}`,
      name: report.location,
      description: report.location,
      latitude: 5.7920 + (index * 0.001),
      longitude: -75.7780 + (index * 0.001),
      reports: [
        {
          id: report.id,
          date: report.date,
          description: report.description,
          images: ['/agalla-aguacate.jpeg', '/plaga-aguacate.jpg']
        }
      ]
    }));

    return [...FARMS, ...dynamicFarms];
  }, [dynamicReports]);

  const selectedFarm = useMemo(
    () => allFarms.find((farm) => farm.id === selectedFarmId) ?? null,
    [selectedFarmId, allFarms],
  );

  const handleImageGalleryOpen = (images: string[]) => {
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  return (
    <main className="relative h-[100dvh] w-full flex">
      {/* Sidebar con listado de puntos */}
      <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Puntos de Monitoreo</h1>
          <p className="text-sm text-gray-500 mt-1">{allFarms.length} ubicaciones</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {allFarms.map((farm) => (
            <button
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedFarmId === farm.id
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`min-w-2 min-h-2 rounded-full mt-1.5 ${
                  selectedFarmId === farm.id ? 'bg-green-400' : 'bg-green-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm truncate ${
                    selectedFarmId === farm.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {farm.name}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${
                    selectedFarmId === farm.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {farm.description}
                  </p>
                  <p className={`text-xs mt-2 ${
                    selectedFarmId === farm.id ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    {farm.reports.length} reporte{farm.reports.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Mapa */}
      <div className="flex-1 ml-80">
        <Map
          initialViewState={{
            longitude: -75.78,
            latitude: 5.79,
            zoom: 12,
          }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onClick={() => setSelectedFarmId(null)}
        >
          <NavigationControl position="top-left" />
          {allFarms.map((farm) => (
            <Marker
              key={farm.id}
              longitude={farm.longitude}
              latitude={farm.latitude}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setSelectedFarmId(farm.id);
              }}
            >
              <button
                type="button"
                className="grid min-h-6 min-w-6 place-items-center rounded-full bg-green-600 shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-transform hover:scale-110"
              >
                <span className="sr-only">{farm.name}</span>
                <span className="h-3 w-3 rounded-full bg-white" />
              </button>
            </Marker>
          ))}
          {selectedFarm ? (
            <Popup
              latitude={selectedFarm.latitude}
              longitude={selectedFarm.longitude}
              anchor="top"
              closeButton={false}
              closeOnClick={false}
              onClose={() => setSelectedFarmId(null)}
              focusAfterOpen={false}
              className="min-w-96"
            >
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header estilo Vercel */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedFarm.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedFarm.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFarmId(null)}
                    className="ml-4 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Historial de Reportes</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {selectedFarm.reports.map((report) => {
                      const formatDateTime = (dateStr: string) => {
                        const regex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})$/;
                        const match = dateStr.match(regex);

                        if (match) {
                          const year = match[1];
                          const month = match[2];
                          const day = match[3];
                          const hour = parseInt(match[4]);
                          const minute = match[5];
                          const ampm = hour >= 12 ? 'p. m.' : 'a. m.';
                          const hour12 = hour % 12 || 12;
                          return `${day}/${month}/${year} - ${hour12}:${minute} ${ampm}`;
                        } else {
                          const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
                          const isoMatch = dateStr.match(isoRegex);
                          if (isoMatch) {
                            return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
                          }
                          return dateStr;
                        }
                      };

                      return (
                        <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-gray-50/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              {formatDateTime(report.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">{report.description}</p>
                          <button
                            onClick={() => handleImageGalleryOpen(report.images)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Ver Anexos ({report.images.length})
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-5xl max-h-[92vh] w-full shadow-2xl overflow-hidden border border-gray-200">
            {/* Header minimalista */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Galería de Anexos</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentImageIndex + 1} de {currentImages.length}
                </p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Contenedor de imagen */}
            <div className="relative bg-gray-50 flex items-center justify-center" style={{ height: 'calc(92vh - 140px)' }}>
              <img
                src={currentImages[currentImageIndex]}
                alt={`Anexo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Controles de navegación */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Indicadores de puntos */}
            {currentImages.length > 1 && (
              <div className="flex justify-center gap-2 px-6 py-4 bg-white border-t border-gray-200">
                {currentImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-gray-900'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
