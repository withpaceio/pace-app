import { useCallback, useMemo } from 'react';

export type Scale = {
  apply: (input: number) => number;
  invert: (input: number) => number;
};

export default function useScaleLinear(range: number[], domain: number[]): Scale {
  const rangeDelta = range[1] - range[0];
  const domainDelta = domain[1] - domain[0];

  const apply = useCallback(
    (input: number) => {
      'worklet';
      if (domainDelta === 0) {
        return 0;
      }

      return rangeDelta - ((input - domain[0]) / domainDelta) * range[1];
    },
    [domain, domainDelta, range, rangeDelta],
  );

  const invert = useCallback(
    (input: number) => {
      'worklet';
      return domain[0] + (input / range[1]) * domainDelta;
    },
    [domain, domainDelta, range],
  );

  return useMemo(() => ({ apply, invert }), [apply, invert]);
}
