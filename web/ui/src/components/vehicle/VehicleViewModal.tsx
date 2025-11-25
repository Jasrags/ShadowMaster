import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Vehicle } from '../../lib/types';

interface VehicleViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function VehicleViewModal({ vehicle, isOpen, onOpenChange }: VehicleViewModalProps) {
  if (!vehicle) return null;

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <Dialog className="p-6">
            {({ close }) => (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{vehicle.name || 'Unknown Vehicle'}</h2>
                    {vehicle.type && (
                      <p className="text-gray-400">{vehicle.type.replace(/\b\w/g, l => l.toUpperCase())}</p>
                    )}
                  </div>
                  <button
                    onClick={close}
                    className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {vehicle.type && (
                        <div>
                          <dt className="text-gray-400">Type</dt>
                          <dd className="text-gray-200">{vehicle.type.replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {vehicle.subtype && (
                        <div>
                          <dt className="text-gray-400">Subtype</dt>
                          <dd className="text-gray-200">{vehicle.subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {vehicle.handling && (
                        <div>
                          <dt className="text-gray-400">Handling</dt>
                          <dd className="text-gray-200">
                            {vehicle.handling.off_road !== undefined
                              ? `${vehicle.handling.on_road}/${vehicle.handling.off_road}`
                              : String(vehicle.handling.on_road || '-')}
                          </dd>
                        </div>
                      )}
                      {vehicle.speed && (
                        <div>
                          <dt className="text-gray-400">Speed</dt>
                          <dd className="text-gray-200">
                            {vehicle.speed.value !== undefined
                              ? `${vehicle.speed.value}${vehicle.speed.movement_type || ''}`
                              : '-'}
                          </dd>
                        </div>
                      )}
                      {vehicle.acceleration !== undefined && (
                        <div>
                          <dt className="text-gray-400">Acceleration</dt>
                          <dd className="text-gray-200">{vehicle.acceleration}</dd>
                        </div>
                      )}
                      {vehicle.body && (
                        <div>
                          <dt className="text-gray-400">Body</dt>
                          <dd className="text-gray-200">
                            {vehicle.body.value !== undefined
                              ? `${vehicle.body.value}${vehicle.body.structure !== undefined ? `(${vehicle.body.structure})` : ''}`
                              : '-'}
                          </dd>
                        </div>
                      )}
                      {vehicle.armor !== undefined && (
                        <div>
                          <dt className="text-gray-400">Armor</dt>
                          <dd className="text-gray-200">{vehicle.armor}</dd>
                        </div>
                      )}
                      {vehicle.pilot !== undefined && (
                        <div>
                          <dt className="text-gray-400">Pilot</dt>
                          <dd className="text-gray-200">{vehicle.pilot}</dd>
                        </div>
                      )}
                      {vehicle.sensor !== undefined && (
                        <div>
                          <dt className="text-gray-400">Sensor</dt>
                          <dd className="text-gray-200">{vehicle.sensor}</dd>
                        </div>
                      )}
                      {vehicle.seats !== undefined && (
                        <div>
                          <dt className="text-gray-400">Seats</dt>
                          <dd className="text-gray-200">{vehicle.seats}</dd>
                        </div>
                      )}
                      {vehicle.cost !== undefined && (
                        <div>
                          <dt className="text-gray-400">Cost</dt>
                          <dd className="text-gray-200">{vehicle.cost.toLocaleString()}¥</dd>
                        </div>
                      )}
                      {vehicle.availability && (
                        <div>
                          <dt className="text-gray-400">Availability</dt>
                          <dd className="text-gray-200">
                            {vehicle.availability.value !== undefined
                              ? `${vehicle.availability.value}${vehicle.availability.restricted ? 'R' : ''}${vehicle.availability.forbidden ? 'F' : ''}`
                              : '-'}
                          </dd>
                        </div>
                      )}
                      {vehicle.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{vehicle.source.source}</dd>
                        </div>
                      )}
                      {vehicle.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{vehicle.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

