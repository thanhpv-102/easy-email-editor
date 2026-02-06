import { posthog } from '@demo/utils/posthog';
import { useEffect, useState } from 'react';

export const useShowLiveChat = () => {
  const [featureEnabled, setFeatureEnabled] = useState(false);

  useEffect(() => {
    posthog.onFeatureFlags(function () {
      if (posthog.isFeatureEnabled('show_live_chat')) {
        setFeatureEnabled(true);
      }
    });
  }, []);

  return { showLiveChat: featureEnabled };
};
