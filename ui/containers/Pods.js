import React, { useState, Fragment } from 'react';

import { useConfigContext } from '../state-management/config-management';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';
import NewTableInfo from './NewTableInfo';

export default function Pods({ namespace, navigate }) {
  const { config } = useConfigContext();

  return (
    <Fragment>
      <NewTableInfo
        title="Pods"
        namespace={namespace}
        command="get pods"
        navigate={navigate}
        formatHeader={() => ['Name', 'Ready', 'Status', 'Restarts', 'Age']}
        formatItems={items =>
          items.map(({ metadata, status, spec }) => [
            metadata.name,
            getContainersReady(spec, status),
            status.phase,
            getContainersRestarts(status),
            metadata.creationTimestamp
          ])
        }
        dialogItems={[
          { value: 'Logs', type: 'pods', href: 'logs' },
          { value: 'Edit', type: 'pods', href: 'edit' },
          { value: 'Info', type: 'pods', href: 'get' },
          { value: 'Describe', type: 'pods', href: 'describe' }
        ]}
      />
    </Fragment>
  );
}
