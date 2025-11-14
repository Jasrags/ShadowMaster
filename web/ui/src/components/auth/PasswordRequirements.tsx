interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  met: boolean;
  label: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    {
      met: password.length >= 8,
      label: 'At least 8 characters',
    },
    {
      met: /[A-Z]/.test(password),
      label: 'At least one uppercase letter',
    },
    {
      met: /[a-z]/.test(password),
      label: 'At least one lowercase letter',
    },
    {
      met: /[0-9]/.test(password),
      label: 'At least one number',
    },
  ];

  const allMet = requirements.every((req) => req.met);

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="text-xs font-medium text-gray-400 mb-1">Password requirements:</div>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              req.met
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-gray-700 border border-gray-600'
            }`}
          >
            {req.met && (
              <svg
                className="w-3 h-3 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
            {req.label}
          </span>
        </div>
      ))}
      {allMet && (
        <div className="text-xs text-green-400 font-medium mt-2">
          ✓ Password meets all requirements
        </div>
      )}
    </div>
  );
}

