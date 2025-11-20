import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Skill } from '../../lib/types';

interface SkillViewModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Helper function to format values for display
const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export function SkillViewModal({ skill, isOpen, onOpenChange }: SkillViewModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!skill || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {skill.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close skill view"
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-gray-100 mt-1">{skill.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-gray-100 mt-1">{skill.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Attribute</label>
                    <p className="text-gray-100 mt-1">{skill.attribute}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Can Default</label>
                    <p className="text-gray-100 mt-1">{skill.default === 'True' ? 'Yes' : 'No'}</p>
                  </div>
                  {skill.source && (
                    <div>
                      <label className="text-sm text-gray-400">Source</label>
                      <p className="text-gray-100 mt-1">{skill.source}</p>
                    </div>
                  )}
                  {skill.page && (
                    <div>
                      <label className="text-sm text-gray-400">Page</label>
                      <p className="text-gray-100 mt-1">{skill.page}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Skill Group */}
              {skill.skillgroup && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Skill Group</h2>
                  <p className="text-gray-100">{skill.skillgroup}</p>
                </section>
              )}

              {/* Specializations */}
              {skill.specs && skill.specs.spec && skill.specs.spec.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Available Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {skill.specs.spec.map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Additional Information */}
              {(skill.exotic !== undefined || skill.requiresflymovement !== undefined || 
                skill.requiresgroundmovement !== undefined || skill.requiresswimmovement !== undefined) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skill.exotic !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Exotic Skill</label>
                        <p className="text-gray-100 mt-1">{formatValue(skill.exotic)}</p>
                      </div>
                    )}
                    {skill.requiresflymovement !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Requires Fly Movement</label>
                        <p className="text-gray-100 mt-1">{formatValue(skill.requiresflymovement)}</p>
                      </div>
                    )}
                    {skill.requiresgroundmovement !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Requires Ground Movement</label>
                        <p className="text-gray-100 mt-1">{formatValue(skill.requiresgroundmovement)}</p>
                      </div>
                    )}
                    {skill.requiresswimmovement !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Requires Swim Movement</label>
                        <p className="text-gray-100 mt-1">{formatValue(skill.requiresswimmovement)}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-sr-light-gray flex justify-end">
            <Button
              onPress={handleClose}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

