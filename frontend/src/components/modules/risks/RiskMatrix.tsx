// src/components/modules/risks/RiskMatrix.tsx

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Activity,
  Target,
  Shield
} from 'lucide-react';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  ownerName?: string;
  probability: number;
  impact: number;
  score: number;
  level: string;
  priority: string;
  status: string;
  treatment: string;
  currentControls?: string;
  mitigationPlan?: string;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RiskMatrixProps {
  risks: Risk[];
  onRiskClick?: (risk: Risk) => void;
  showLegend?: boolean;
  showStats?: boolean;
  interactive?: boolean;
}

export default function RiskMatrix({ 
  risks, 
  onRiskClick,
  showLegend = true,
  showStats = true,
  interactive = true
}: RiskMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{ probability: number; impact: number } | null>(null);
  const [hoveredRisk, setHoveredRisk] = useState<Risk | null>(null);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Definir la matriz 5x5
  const matrix = {
    rows: [
      { value: 5, label: 'Muy Alta', short: 'MA' },
      { value: 4, label: 'Alta', short: 'A' },
      { value: 3, label: 'Media', short: 'M' },
      { value: 2, label: 'Baja', short: 'B' },
      { value: 1, label: 'Muy Baja', short: 'MB' }
    ],
    cols: [
      { value: 1, label: 'Muy Bajo', short: 'MB' },
      { value: 2, label: 'Bajo', short: 'B' },
      { value: 3, label: 'Medio', short: 'M' },
      { value: 4, label: 'Alto', short: 'A' },
      { value: 5, label: 'Muy Alto', short: 'MA' }
    ]
  };

  // Función para obtener el color de la celda según el score
  const getCellColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score <= 4) return 'bg-green-100 hover:bg-green-200 border-green-300';
    if (score <= 9) return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
    if (score <= 15) return 'bg-orange-100 hover:bg-orange-200 border-orange-300';
    return 'bg-red-100 hover:bg-red-200 border-red-300';
  };

  // Función para obtener el color del nivel de riesgo
  const getRiskLevelColor = (score: number) => {
    if (score <= 4) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Bajo' };
    if (score <= 9) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Medio' };
    if (score <= 15) return { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Alto' };
    return { bg: 'bg-red-500', text: 'text-red-700', label: 'Crítico' };
  };

  // Función para obtener riesgos en una celda específica
  const getRisksInCell = (probability: number, impact: number) => {
    return risks.filter(r => r.probability === probability && r.impact === impact);
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const total = risks.length;
    const critical = risks.filter(r => r.score > 15).length;
    const high = risks.filter(r => r.score > 9 && r.score <= 15).length;
    const medium = risks.filter(r => r.score > 4 && r.score <= 9).length;
    const low = risks.filter(r => r.score <= 4).length;
    
    const avgScore = total > 0 ? risks.reduce((acc, r) => acc + r.score, 0) / total : 0;
    
    // Tendencia (simplificada - en producción usarías datos históricos)
    const trend = avgScore > 10 ? 'increasing' : avgScore < 7 ? 'decreasing' : 'stable';
    
    return { total, critical, high, medium, low, avgScore, trend };
  };

  const stats = calculateStats();

  // Manejar click en celda
  const handleCellClick = (probability: number, impact: number) => {
    if (!interactive) return;
    
    const cellRisks = getRisksInCell(probability, impact);
    if (cellRisks.length > 0) {
      setSelectedCell({ probability, impact });
      if (cellRisks.length === 1 && onRiskClick) {
        onRiskClick(cellRisks[0]);
      }
    }
  };

  // Manejar click en riesgo individual
  const handleRiskItemClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setShowRiskDetails(true);
    if (onRiskClick) {
      onRiskClick(risk);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Riesgos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Críticos</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Altos</p>
                <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Medios</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bajos</p>
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tendencia</p>
                <div className="flex items-center">
                  {stats.trend === 'increasing' && (
                    <>
                      <TrendingUp className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-sm font-medium text-red-600">Aumentando</span>
                    </>
                  )}
                  {stats.trend === 'decreasing' && (
                    <>
                      <TrendingDown className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">Disminuyendo</span>
                    </>
                  )}
                  {stats.trend === 'stable' && (
                    <>
                      <Minus className="h-5 w-5 text-blue-500 mr-1" />
                      <span className="text-sm font-medium text-blue-600">Estable</span>
                    </>
                  )}
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Matriz Principal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Matriz de Riesgos - Probabilidad vs Impacto
        </h3>

        <div className="flex">
          {/* Eje Y - Probabilidad */}
          <div className="flex flex-col justify-center mr-4">
            <div className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">
              PROBABILIDAD →
            </div>
          </div>

          {/* Contenedor de la matriz */}
          <div className="flex-1">
            <div className="grid grid-cols-6 gap-0">
              {/* Celda vacía esquina superior izquierda */}
              <div className="h-24"></div>
              
              {/* Headers de columnas (Impacto) */}
              {matrix.cols.map((col) => (
                <div key={col.value} className="h-24 flex flex-col items-center justify-center border-b-2 border-gray-300">
                  <div className="text-xs font-medium text-gray-600">{col.short}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">{col.label}</div>
                </div>
              ))}

              {/* Filas de la matriz */}
              {matrix.rows.map((row) => (
                <React.Fragment key={row.value}>
                  {/* Header de fila (Probabilidad) */}
                  <div className="h-24 flex items-center justify-center border-r-2 border-gray-300">
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600">{row.short}</div>
                      <div className="text-xs text-gray-500 mt-1">{row.label}</div>
                    </div>
                  </div>

                  {/* Celdas de la matriz */}
                  {matrix.cols.map((col) => {
                    const cellRisks = getRisksInCell(row.value, col.value);
                    const score = row.value * col.value;
                    const isSelected = selectedCell?.probability === row.value && selectedCell?.impact === col.value;

                    return (
                      <div
                        key={`${row.value}-${col.value}`}
                        className={`
                          h-24 border border-gray-300 p-1 cursor-pointer transition-all relative
                          ${getCellColor(row.value, col.value)}
                          ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                          ${interactive ? 'hover:shadow-md' : ''}
                        `}
                        onClick={() => handleCellClick(row.value, col.value)}
                        onMouseEnter={() => cellRisks.length > 0 && setHoveredRisk(cellRisks[0])}
                        onMouseLeave={() => setHoveredRisk(null)}
                      >
                        {/* Score de la celda */}
                        <div className="text-xs font-semibold text-gray-700 text-center">
                          {score}
                        </div>

                        {/* Indicador de riesgos */}
                        {cellRisks.length > 0 && (
                          <div className="mt-1">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {cellRisks.slice(0, 3).map((risk, idx) => (
                                <div
                                  key={risk.id}
                                  className="w-2 h-2 rounded-full bg-gray-700 opacity-70"
                                  title={risk.title}
                                />
                              ))}
                            </div>
                            {cellRisks.length > 3 && (
                              <div className="text-xs text-center text-gray-600 mt-1">
                                +{cellRisks.length - 3}
                              </div>
                            )}
                            <div className="text-xs text-center font-medium text-gray-800 mt-1">
                              {cellRisks.length} {cellRisks.length === 1 ? 'riesgo' : 'riesgos'}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Etiqueta del eje X */}
            <div className="text-center mt-4">
              <div className="text-sm font-medium text-gray-700">IMPACTO →</div>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        {showLegend && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Niveles de Riesgo</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Bajo (1-4)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Medio (5-9)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Alto (10-15)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Crítico (16-25)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de riesgos de la celda seleccionada */}
      {selectedCell && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Riesgos en Probabilidad {selectedCell.probability} × Impacto {selectedCell.impact}
            </h3>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {getRisksInCell(selectedCell.probability, selectedCell.impact).map((risk) => {
              const riskLevel = getRiskLevelColor(risk.score);
              return (
                <div
                  key={risk.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRiskItemClick(risk)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${riskLevel.bg} mr-2`}></div>
                        <h4 className="font-medium text-gray-900">{risk.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Responsable: {risk.ownerName}</span>
                        <span>Estado: {risk.status}</span>
                        <span>Tratamiento: {risk.treatment}</span>
                        {risk.progress !== undefined && (
                          <span>Progreso: {risk.progress}%</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip de riesgo */}
      {hoveredRisk && interactive && (
        <div className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-sm pointer-events-none"
             style={{
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)'
             }}>
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
            <h4 className="font-medium text-gray-900">{hoveredRisk.title}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-2">{hoveredRisk.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Score: {hoveredRisk.score}</span>
            <span>Nivel: {hoveredRisk.level}</span>
          </div>
        </div>
      )}

      {/* Modal de detalles del riesgo */}
      {showRiskDetails && selectedRisk && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles del Riesgo
                  </h3>
                  <button
                    onClick={() => {
                      setShowRiskDetails(false);
                      setSelectedRisk(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className={`rounded-lg p-4 mb-4 ${getRiskLevelColor(selectedRisk.score).text} bg-opacity-10`}
                     style={{ backgroundColor: `${getRiskLevelColor(selectedRisk.score).bg}20` }}>
                  <h2 className="text-xl font-bold">{selectedRisk.title}</h2>
                  <div className="mt-2 flex items-center gap-4">
                    <span>Nivel: {getRiskLevelColor(selectedRisk.score).label}</span>
                    <span>Score: {selectedRisk.score}</span>
                    <span>P: {selectedRisk.probability} × I: {selectedRisk.impact}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Descripción</h4>
                    <p className="text-sm text-gray-600">{selectedRisk.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Información</h4>
                      <dl className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Categoría:</dt>
                          <dd className="font-medium">{selectedRisk.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Responsable:</dt>
                          <dd className="font-medium">{selectedRisk.ownerName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Estado:</dt>
                          <dd className="font-medium">{selectedRisk.status}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Tratamiento</h4>
                      <dl className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tipo:</dt>
                          <dd className="font-medium">{selectedRisk.treatment}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Prioridad:</dt>
                          <dd className="font-medium">{selectedRisk.priority}</dd>
                        </div>
                        {selectedRisk.progress !== undefined && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Progreso:</dt>
                            <dd className="font-medium">{selectedRisk.progress}%</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {selectedRisk.currentControls && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Controles Actuales</h4>
                      <p className="text-sm text-gray-600">{selectedRisk.currentControls}</p>
                    </div>
                  )}

                  {selectedRisk.mitigationPlan && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Plan de Mitigación</h4>
                      <p className="text-sm text-gray-600">{selectedRisk.mitigationPlan}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                <button
                  onClick={() => {
                    setShowRiskDetails(false);
                    setSelectedRisk(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}